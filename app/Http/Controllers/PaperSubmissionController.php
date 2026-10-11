<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\Submission;
use App\Models\SubmissionAuthor;
use App\Models\SubmissionFile;
use App\Models\SubmissionStatusHistory;
use App\Services\PaperIdGeneratorService;
use App\Mail\AuthorSubmissionConfirmationMail;
use App\Mail\OperatorSubmissionNotificationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to submit a paper.');
        }

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
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to submit a paper.');
        }

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
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to submit a paper.');
        }

        if ($journal->status !== 'approved') {
            abort(404);
        }

        $setting = $journal->submissionSetting;
        if (!$setting || !$setting->isCurrentlyOpen()) {
            return redirect()->route('submissions.index')
                ->with('error', 'Submissions for this journal are currently closed.');
        }

        $draft = session("submission_draft_{$journal->id}");
        if (!$draft) {
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
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to submit a paper.');
        }

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

            $paperId = $idGenerator->generate($journal);
            $code = $setting ? strtoupper($setting->code) : 'JRN';
            $year = date('Y');
            $directoryPath = "submissions/{$code}/{$year}/{$paperId}";

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
                    'is_corresponding' => (bool) $authorData['is_corresponding'],
                    'order' => (int) $authorData['order'],
                ]);
            }

            if (!empty($draft['file_details'])) {
                foreach ($draft['file_details'] as $docType => $fileInfo) {
                    if (isset($fileInfo['temp_path']) && Storage::disk('local')->exists($fileInfo['temp_path'])) {
                        $ext = pathinfo($fileInfo['original_filename'], PATHINFO_EXTENSION);
                        $filename = $docType . '_' . time() . ($ext ? '.' . $ext : '');
                        $filePath = "{$directoryPath}/{$filename}";

                        Storage::disk('local')->move($fileInfo['temp_path'], $filePath);

                        $submission->files()->create([
                            'document_type' => $docType,
                            'original_filename' => $fileInfo['original_filename'],
                            'file_path' => $filePath,
                            'file_size' => $fileInfo['file_size'] ?? 0,
                            'mime_type' => $fileInfo['mime_type'] ?? 'application/octet-stream',
                        ]);
                    }
                }
            }

            SubmissionStatusHistory::create([
                'submission_id' => $submission->id,
                'status' => 'Submitted',
                'user_id' => Auth::id(),
                'note' => 'Paper submitted by author.',
            ]);

            try {
                $correspondingAuthor = $submission->correspondingAuthor();
                if ($correspondingAuthor && $correspondingAuthor->email) {
                    Mail::to($correspondingAuthor->email)->send(new AuthorSubmissionConfirmationMail($submission));
                }

                $operator = $journal->editor;
                if ($operator && $operator->email) {
                    Mail::to($operator->email)->send(new OperatorSubmissionNotificationMail($submission));
                }
            } catch (\Throwable $e) {
                logger()->error("Failed to send paper submission email for {$paperId}: " . $e->getMessage());
            }

            session()->forget($draftKey);

            return Inertia::render('Submissions/Success', [
                'submission' => [
                    'paper_id' => $submission->paper_id,
                    'title' => $submission->title,
                    'status' => $submission->status,
                    'journal_title' => $journal->journal_title,
                    'submitted_at' => $submission->submitted_at->format('d F Y, h:i A'),
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
        $code = $setting ? strtoupper($setting->code) : 'JRN';
        $year = date('Y');
        $directoryPath = "submissions/{$code}/{$year}/{$paperId}";

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
                'is_corresponding' => (bool) $authorData['is_corresponding'],
                'order' => (int) $authorData['order'],
            ]);
        }

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $docType => $file) {
                if ($file && $file->isValid()) {
                    $filename = $docType . '_' . time() . '.' . $file->getClientOriginalExtension();
                    $filePath = $file->storeAs($directoryPath, $filename, 'local');

                    $submission->files()->create([
                        'document_type' => $docType,
                        'original_filename' => $file->getClientOriginalName(),
                        'file_path' => $filePath,
                        'file_size' => $file->getSize(),
                        'mime_type' => $file->getClientMimeType(),
                    ]);
                }
            }
        }

        SubmissionStatusHistory::create([
            'submission_id' => $submission->id,
            'status' => 'Submitted',
            'user_id' => Auth::id(),
            'note' => 'Paper submitted by author.',
        ]);

        try {
            $correspondingAuthor = $submission->correspondingAuthor();
            if ($correspondingAuthor && $correspondingAuthor->email) {
                Mail::to($correspondingAuthor->email)->send(new AuthorSubmissionConfirmationMail($submission));
            }

            $operator = $journal->editor;
            if ($operator && $operator->email) {
                Mail::to($operator->email)->send(new OperatorSubmissionNotificationMail($submission));
            }
        } catch (\Throwable $e) {
            logger()->error("Failed to send paper submission email for {$paperId}: " . $e->getMessage());
        }

        return Inertia::render('Submissions/Success', [
            'submission' => [
                'paper_id' => $submission->paper_id,
                'title' => $submission->title,
                'status' => $submission->status,
                'journal_title' => $journal->journal_title,
                'submitted_at' => $submission->submitted_at->format('d F Y, h:i A'),
            ],
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Author Dashboard - View own submissions.
     */
    public function mySubmissions()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $submissions = Submission::where('user_id', Auth::id())
            ->with(['journal', 'correspondingAuthor'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Submissions/AuthorDashboard', [
            'submissions' => $submissions,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Author Submission Detail View.
     */
    public function showSubmission(Submission $submission)
    {
        if (!Auth::check() || $submission->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to submission.');
        }

        $submission->load(['journal', 'authors', 'files', 'statusHistories.user']);

        return Inertia::render('Submissions/AuthorDetail', [
            'submission' => $submission,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Author Secure File Download.
     */
    public function downloadFile(Submission $submission, SubmissionFile $file)
    {
        if (!Auth::check() || $submission->user_id !== Auth::id()) {
            abort(403, 'Unauthorized file access.');
        }

        if ($file->submission_id !== $submission->id) {
            abort(404, 'File not found.');
        }

        if (!Storage::disk('local')->exists($file->file_path)) {
            abort(404, 'File path does not exist on server.');
        }

        return Storage::disk('local')->download($file->file_path, $file->original_filename);
    }
}
