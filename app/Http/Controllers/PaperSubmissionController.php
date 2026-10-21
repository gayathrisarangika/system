<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\Submission;
use App\Models\SubmissionAuthor;
use App\Models\SubmissionFile;
use App\Models\SubmissionStatusHistory;
use App\Models\User;
use App\Services\PaperIdGeneratorService;
use App\Mail\AuthorSubmissionConfirmationMail;
use App\Mail\OperatorSubmissionNotificationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaperSubmissionController extends Controller
{
    /**
     * Display central "Paper Submission" page showing all approved journals
     * with Open/Closed cards.
     */
    public function index()
    {
        $journals = Journal::where('status', 'approved')
            ->with(['submissionSetting', 'department'])
            ->get()
            ->map(function ($journal) {
                $setting = $journal->submissionSetting;
                $isOpen = $setting ? $setting->isCurrentlyOpen() : false;

                return [
                    'id' => $journal->id,
                    'journal_title' => $journal->journal_title,
                    'university_name' => $journal->university_name,
                    'cover_image_url' => $journal->cover_image_url,
                    'issn' => $journal->issn,
                    'is_open' => $isOpen,
                    'manual_is_open' => $setting ? (bool) $setting->is_open : false,
                    'code' => $setting ? $setting->code : 'JRN',
                    'opening_datetime' => $setting?->opening_datetime?->format('Y-m-d H:i'),
                    'closing_datetime' => $setting?->closing_datetime?->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('Submissions/Index', [
            'journals' => $journals,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Render Paper Submission Form for an open journal.
     */
    public function create(Journal $journal)
    {
        if ($journal->status !== 'approved') {
            abort(404, 'Journal not found or not approved.');
        }

        $setting = $journal->submissionSetting;
        if (!$setting || !$setting->isCurrentlyOpen()) {
            return redirect()->route('submissions.index')
                ->with('error', 'Submissions for this journal are currently closed.');
        }

        $journal->load(['documentRequirements']);
        $draft = session("submission_draft_{$journal->id}");

        return Inertia::render('Submissions/Create', [
            'journal' => [
                'id' => $journal->id,
                'journal_title' => $journal->journal_title,
                'university_name' => $journal->university_name,
                'cover_image_url' => $journal->cover_image_url,
                'issn' => $journal->issn,
                'code' => $setting->code,
                'document_requirements' => $journal->documentRequirements,
            ],
            'draft' => $draft,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Process Step 1 submission: store uploaded files in temporary disk storage
     * and save draft in session before redirecting to confirmation page.
     */
    public function confirm(Request $request, Journal $journal)
    {
        if ($journal->status !== 'approved') {
            abort(404);
        }

        $setting = $journal->submissionSetting;
        if (!$setting || !$setting->isCurrentlyOpen()) {
            return redirect()->route('submissions.index')
                ->with('error', 'Submissions for this journal are currently closed.');
        }

        $requirements = $journal->documentRequirements;

        $rules = [
            'title' => 'required|string|max:1000',
            'abstract' => 'required|string|max:5000',
            'keywords' => 'nullable|string|max:500',
            'authors' => 'required|array|min:1',
            'authors.*.full_name' => 'required|string|max:255',
            'authors.*.email' => 'required|email|max:255',
            'authors.*.affiliation' => 'required|string|max:255',
            'authors.*.designation' => 'nullable|string|max:255',
            'authors.*.is_corresponding' => 'required|boolean',
            'authors.*.order' => 'required|integer',
        ];

        // Check if draft already has files stored
        $existingDraft = session("submission_draft_{$journal->id}");

        foreach ($requirements as $req) {
            $hasExistingFile = isset($existingDraft['file_details'][$req->document_type]);
            $fileRule = ($req->is_required && !$hasExistingFile) ? 'required|file' : 'nullable|file';
            $mimes = $req->allowed_mimes ? str_replace(' ', '', $req->allowed_mimes) : 'pdf,doc,docx';
            $maxKb = ($req->max_size_mb ?: 10) * 1024;
            $rules["files.{$req->document_type}"] = "{$fileRule}|mimes:{$mimes}|max:{$maxKb}";
        }

        $validated = $request->validate($rules);

        // Ensure at least one corresponding author
        $hasCorresponding = collect($validated['authors'])->contains('is_corresponding', true);
        if (!$hasCorresponding && !empty($validated['authors'])) {
            $validated['authors'][0]['is_corresponding'] = true;
        }

        // Maintain existing files from session draft if not replaced
        $fileDetails = $existingDraft['file_details'] ?? [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $type => $file) {
                if ($file && $file->isValid()) {
                    $ext = $file->getClientOriginalExtension();
                    $tempFilename = $type . '_' . uniqid() . ($ext ? '.' . $ext : '');
                    $tempPath = $file->storeAs("tmp_submissions/" . session()->getId(), $tempFilename, 'local');

                    $fileDetails[$type] = [
                        'original_filename' => $file->getClientOriginalName(),
                        'size_mb' => round($file->getSize() / (1024 * 1024), 2),
                        'mime_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                        'temp_path' => $tempPath,
                    ];
                }
            }
        }

        session(["submission_draft_{$journal->id}" => [
            'title' => $validated['title'],
            'abstract' => $validated['abstract'],
            'keywords' => $validated['keywords'] ?? '',
            'authors' => $validated['authors'],
            'file_details' => $fileDetails,
        ]]);

        return redirect()->route('submissions.confirm.view', $journal);
    }

    /**
     * Render confirmation step GET page.
     */
    public function showConfirm(Journal $journal)
    {
        if ($journal->status !== 'approved') {
            abort(404);
        }

        $setting = $journal->submissionSetting;
        if (!$setting || !$setting->isCurrentlyOpen()) {
            return redirect()->route('submissions.index')
                ->with('error', 'Submissions for this journal are currently closed.');
        }

        $draft = session("submission_draft_{$journal->id}");
        if (!$draft || !is_array($draft) || empty($draft['title']) || empty($draft['authors'])) {
            return redirect()->route('submissions.create', $journal)
                ->with('error', 'Please complete the submission form first.');
        }

        return Inertia::render('Submissions/Confirm', [
            'journal' => [
                'id' => $journal->id,
                'journal_title' => $journal->journal_title,
                'university_name' => $journal->university_name,
            ],
            'paper' => $draft,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Final submission endpoint. Server-side validation, Paper ID generation,
     * file storage in /submissions/{CODE}/{YEAR}/{PAPER_ID}/, database storage, emails.
     */
    public function store(Request $request, Journal $journal, PaperIdGeneratorService $idGenerator)
    {
        if ($journal->status !== 'approved') {
            abort(404);
        }

        $setting = $journal->submissionSetting;
        if (!$setting || !$setting->isCurrentlyOpen()) {
            return redirect()->route('submissions.index')
                ->with('error', 'Submissions for this journal are currently closed.');
        }

        $draftKey = "submission_draft_{$journal->id}";

        // Handle submission from session draft (2-step browser flow)
        if (session()->has($draftKey)) {
            $validated = $request->validate([
                'agreement' => 'required|accepted',
            ]);

            $draft = session($draftKey);

            if (!is_array($draft) || empty($draft['title']) || empty($draft['authors']) || !is_array($draft['authors'])) {
                session()->forget($draftKey);
                return redirect()->route('submissions.create', $journal)
                    ->with('error', 'Your submission draft has expired or is invalid. Please fill the submission form again.');
            }

            $paperId = $idGenerator->generate($journal);
            $code = ($setting && !empty($setting->code)) ? strtoupper($setting->code) : 'JRN';
            $year = date('Y');
            $directoryPath = "submissions/{$code}/{$year}/{$paperId}";

            $submission = DB::transaction(function () use ($journal, $paperId, $draft) {
                $submission = Submission::create([
                    'paper_id' => $paperId,
                    'journal_id' => $journal->id,
                    'user_id' => Auth::id(),
                    'title' => $draft['title'],
                    'abstract' => $draft['abstract'],
                    'keywords' => $draft['keywords'] ?? '',
                    'status' => 'Submitted',
                    'submitted_at' => now(),
                ]);

                foreach ($draft['authors'] as $authorData) {
                    $submission->authors()->create([
                        'full_name' => $authorData['full_name'],
                        'email' => $authorData['email'],
                        'affiliation' => $authorData['affiliation'],
                        'designation' => $authorData['designation'] ?? null,
                        'is_corresponding' => (bool) ($authorData['is_corresponding'] ?? false),
                        'order' => (int) ($authorData['order'] ?? 1),
                    ]);
                }

                SubmissionStatusHistory::create([
                    'submission_id' => $submission->id,
                    'status' => 'Submitted',
                    'user_id' => Auth::id(),
                    'note' => 'Paper submitted by author.',
                ]);

                return $submission;
            });

            if (!empty($draft['file_details']) && is_array($draft['file_details'])) {
                Storage::disk('local')->makeDirectory($directoryPath);

                foreach ($draft['file_details'] as $docType => $fileInfo) {
                    if (isset($fileInfo['temp_path']) && Storage::disk('local')->exists($fileInfo['temp_path'])) {
                        $ext = pathinfo($fileInfo['original_filename'] ?? '', PATHINFO_EXTENSION);
                        $filename = $docType . '_' . time() . ($ext ? '.' . $ext : '');
                        $filePath = "{$directoryPath}/{$filename}";

                        try {
                            Storage::disk('local')->move($fileInfo['temp_path'], $filePath);

                            $submission->files()->create([
                                'document_type' => $docType,
                                'original_filename' => $fileInfo['original_filename'] ?? 'file',
                                'file_path' => $filePath,
                                'file_size' => $fileInfo['file_size'] ?? 0,
                                'mime_type' => $fileInfo['mime_type'] ?? 'application/octet-stream',
                            ]);
                        } catch (\Throwable $e) {
                            logger()->error("Failed to move submission file {$fileInfo['temp_path']} to {$filePath}: " . $e->getMessage());
                        }
                    }
                }
            }

            $this->sendSubmissionEmails($submission, $journal);

            session()->forget($draftKey);

            $submittedAtFormatted = now()->format('d F Y, h:i A');
            if ($submission->submitted_at) {
                if ($submission->submitted_at instanceof \DateTimeInterface) {
                    $submittedAtFormatted = $submission->submitted_at->format('d F Y, h:i A');
                } elseif (is_string($submission->submitted_at)) {
                    $submittedAtFormatted = date('d F Y, h:i A', strtotime($submission->submitted_at));
                }
            }

            return Inertia::render('Submissions/Success', [
                'submission' => [
                    'paper_id' => $submission->paper_id,
                    'title' => $submission->title,
                    'status' => $submission->status,
                    'journal_title' => $journal->journal_title,
                    'submitted_at' => $submittedAtFormatted,
                ],
                'auth' => [
                    'user' => Auth::user(),
                ],
            ]);
        }

        // Direct single-request submission payload (backward compatibility)
        $requirements = $journal->documentRequirements;

        $rules = [
            'title' => 'required|string|max:1000',
            'abstract' => 'required|string|max:5000',
            'keywords' => 'nullable|string|max:500',
            'authors' => 'required|array|min:1',
            'authors.*.full_name' => 'required|string|max:255',
            'authors.*.email' => 'required|email|max:255',
            'authors.*.affiliation' => 'required|string|max:255',
            'authors.*.designation' => 'nullable|string|max:255',
            'authors.*.is_corresponding' => 'required|boolean',
            'authors.*.order' => 'required|integer',
            'agreement' => 'required|accepted',
        ];

        foreach ($requirements as $req) {
            $fileRule = $req->is_required ? 'required|file' : 'nullable|file';
            $mimes = $req->allowed_mimes ? str_replace(' ', '', $req->allowed_mimes) : 'pdf,doc,docx';
            $maxKb = ($req->max_size_mb ?: 10) * 1024;
            $rules["files.{$req->document_type}"] = "{$fileRule}|mimes:{$mimes}|max:{$maxKb}";
        }

        $validated = $request->validate($rules);

        $paperId = $idGenerator->generate($journal);
        $code = ($setting && !empty($setting->code)) ? strtoupper($setting->code) : 'JRN';
        $year = date('Y');
        $directoryPath = "submissions/{$code}/{$year}/{$paperId}";

        $submission = DB::transaction(function () use ($journal, $paperId, $validated) {
            $submission = Submission::create([
                'paper_id' => $paperId,
                'journal_id' => $journal->id,
                'user_id' => Auth::id(),
                'title' => $validated['title'],
                'abstract' => $validated['abstract'],
                'keywords' => $validated['keywords'] ?? '',
                'status' => 'Submitted',
                'submitted_at' => now(),
            ]);

            foreach ($validated['authors'] as $authorData) {
                $submission->authors()->create([
                    'full_name' => $authorData['full_name'],
                    'email' => $authorData['email'],
                    'affiliation' => $authorData['affiliation'],
                    'designation' => $authorData['designation'] ?? null,
                    'is_corresponding' => (bool) ($authorData['is_corresponding'] ?? false),
                    'order' => (int) ($authorData['order'] ?? 1),
                ]);
            }

            SubmissionStatusHistory::create([
                'submission_id' => $submission->id,
                'status' => 'Submitted',
                'user_id' => Auth::id(),
                'note' => 'Paper submitted by author.',
            ]);

            return $submission;
        });

        if ($request->hasFile('files')) {
            Storage::disk('local')->makeDirectory($directoryPath);

            foreach ($request->file('files') as $docType => $file) {
                if ($file && $file->isValid()) {
                    try {
                        $filename = $docType . '_' . time() . '.' . $file->getClientOriginalExtension();
                        $filePath = $file->storeAs($directoryPath, $filename, 'local');

                        $submission->files()->create([
                            'document_type' => $docType,
                            'original_filename' => $file->getClientOriginalName(),
                            'file_path' => $filePath,
                            'file_size' => $file->getSize(),
                            'mime_type' => $file->getClientMimeType(),
                        ]);
                    } catch (\Throwable $e) {
                        logger()->error("Failed to store submission file for {$docType}: " . $e->getMessage());
                    }
                }
            }
        }

        $this->sendSubmissionEmails($submission, $journal);

        $submittedAtFormatted = now()->format('d F Y, h:i A');
        if ($submission->submitted_at) {
            if ($submission->submitted_at instanceof \DateTimeInterface) {
                $submittedAtFormatted = $submission->submitted_at->format('d F Y, h:i A');
            } elseif (is_string($submission->submitted_at)) {
                $submittedAtFormatted = date('d F Y, h:i A', strtotime($submission->submitted_at));
            }
        }

        return Inertia::render('Submissions/Success', [
            'submission' => [
                'paper_id' => $submission->paper_id,
                'title' => $submission->title,
                'status' => $submission->status,
                'journal_title' => $journal->journal_title,
                'submitted_at' => $submittedAtFormatted,
            ],
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Eager loads relations and sends email notifications to corresponding author
     * and responsible journal editors / operators.
     */
    private function sendSubmissionEmails(Submission $submission, Journal $journal): void
    {
        try {
            $submission->load(['journal', 'authors', 'files', 'user']);

            // 1. Author email dispatch (Corresponding author and any submission author emails)
            $authorEmails = $submission->authors
                ->pluck('email')
                ->filter()
                ->unique();

            if ($authorEmails->isEmpty()) {
                $correspondingAuthor = $submission->correspondingAuthor();
                if ($correspondingAuthor?->email) {
                    $authorEmails->push($correspondingAuthor->email);
                } elseif ($submission->user?->email) {
                    $authorEmails->push($submission->user->email);
                }
            }

            foreach ($authorEmails as $email) {
                Mail::to($email)->send(new AuthorSubmissionConfirmationMail($submission));
            }

            // 2. Editor / Operator email dispatch
            $editorEmails = collect();

            if ($journal->editor_id) {
                $journalEditor = User::find($journal->editor_id);
                if ($journalEditor && $journalEditor->email) {
                    $editorEmails->push($journalEditor->email);
                }
            }

            $assignedEditors = User::where('role', 'editor')
                ->where(function ($q) use ($journal) {
                    $q->where('publication_id', $journal->id)
                      ->orWhere(function ($q2) use ($journal) {
                          if ($journal->department_id) {
                              $q2->where('department_id', $journal->department_id);
                          }
                      });
                })
                ->whereNotNull('email')
                ->pluck('email');

            $editorEmails = $editorEmails->merge($assignedEditors);

            if ($editorEmails->isEmpty()) {
                $adminEmails = User::where('role', 'admin')
                    ->whereNotNull('email')
                    ->pluck('email');
                $editorEmails = $editorEmails->merge($adminEmails);
            }

            $uniqueEditorEmails = $editorEmails->unique()->filter();

            foreach ($uniqueEditorEmails as $email) {
                Mail::to($email)->send(new OperatorSubmissionNotificationMail($submission));
            }
        } catch (\Throwable $e) {
            logger()->error("Failed to send paper submission email for paper {$submission->paper_id}: " . $e->getMessage());
        }
    }
}
