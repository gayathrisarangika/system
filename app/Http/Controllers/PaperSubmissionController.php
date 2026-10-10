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
        if ($journal->status !== 'approved') {
            abort(404, 'Journal not found or not approved.');
        }

        $setting = $journal->submissionSetting;
        if (!$setting || !$setting->isCurrentlyOpen()) {
            return redirect()->route('submissions.index')
                ->with('error', 'Submissions for this journal are currently closed.');
        }

        $journal->load(['documentRequirements']);

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
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Preview / Confirmation Step handler. Stores uploaded files in temporary
     * directory on private storage and draft metadata in session, then redirects to GET confirmation page.
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
        $sessionKey = "pending_submission_{$journal->id}";
        $existingSession = $request->session()->get($sessionKey, []);

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

        foreach ($requirements as $req) {
            $type = $req->document_type;
            $hasExistingFile = isset($existingSession['temp_files'][$type]);
            $fileRule = ($req->is_required && !$hasExistingFile) ? 'required|file' : 'nullable|file';
            $mimes = $req->allowed_mimes ? str_replace(' ', '', $req->allowed_mimes) : 'pdf,doc,docx';
            $maxKb = ($req->max_size_mb ?: 10) * 1024;
            $rules["files.{$type}"] = "{$fileRule}|mimes:{$mimes}|max:{$maxKb}";
        }

        $validated = $request->validate($rules);

        // Ensure at least one corresponding author
        $hasCorresponding = collect($validated['authors'])->contains('is_corresponding', true);
        if (!$hasCorresponding && !empty($validated['authors'])) {
            $validated['authors'][0]['is_corresponding'] = true;
        }

        // Handle uploaded files: store in temp directory on private disk
        $tempFiles = $existingSession['temp_files'] ?? [];
        $fileDetails = $existingSession['file_details'] ?? [];

        if ($request->hasFile('files')) {
            $sessionId = $request->session()->getId();
            $tempDirectory = "submissions/temp/{$sessionId}_{$journal->id}";

            foreach ($request->file('files') as $type => $file) {
                if ($file && $file->isValid()) {
                    $filename = $type . '_' . time() . '.' . $file->getClientOriginalExtension();
                    $filePath = $file->storeAs($tempDirectory, $filename, 'local');

                    $tempFiles[$type] = [
                        'temp_path' => $filePath,
                        'original_filename' => $file->getClientOriginalName(),
                        'size_mb' => round($file->getSize() / (1024 * 1024), 2),
                        'file_size' => $file->getSize(),
                        'mime_type' => $file->getClientMimeType(),
                    ];

                    $fileDetails[$type] = [
                        'original_filename' => $file->getClientOriginalName(),
                        'size_mb' => round($file->getSize() / (1024 * 1024), 2),
                        'mime_type' => $file->getClientMimeType(),
                    ];
                }
            }
        }

        // Store pending submission data in session
        $request->session()->put($sessionKey, [
            'title' => $validated['title'],
            'abstract' => $validated['abstract'],
            'keywords' => $validated['keywords'] ?? '',
            'authors' => $validated['authors'],
            'temp_files' => $tempFiles,
            'file_details' => $fileDetails,
        ]);
        $request->session()->save();

        return redirect()->route('submissions.confirm.show', $journal);
    }

    /**
     * Display Confirmation page via GET request.
     */
    public function showConfirm(Request $request, Journal $journal)
    {
        if ($journal->status !== 'approved') {
            abort(404);
        }

        $setting = $journal->submissionSetting;
        if (!$setting || !$setting->isCurrentlyOpen()) {
            return redirect()->route('submissions.index')
                ->with('error', 'Submissions for this journal are currently closed.');
        }

        $pending = $request->session()->get("pending_submission_{$journal->id}");
        if (!$pending) {
            return redirect()->route('submissions.create', $journal)
                ->with('error', 'Please enter paper details first.');
        }

        return Inertia::render('Submissions/Confirm', [
            'journal' => [
                'id' => $journal->id,
                'journal_title' => $journal->journal_title,
                'university_name' => $journal->university_name,
            ],
            'paper' => [
                'title' => $pending['title'],
                'abstract' => $pending['abstract'],
                'keywords' => $pending['keywords'] ?? '',
                'authors' => $pending['authors'],
                'file_details' => $pending['file_details'] ?? [],
            ],
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Final submission endpoint. Reads pending submission session data, generates Paper ID,
     * moves temporary files to /submissions/{CODE}/{YEAR}/{PAPER_ID}/, persists DB records & notifies.
     */
    public function store(Request $request, Journal $journal, PaperIdGeneratorService $idGenerator)
    {
        if (!Auth::check()) {
            abort(401, 'Authentication required to submit paper.');
        }

        if ($journal->status !== 'approved') {
            abort(404);
        }

        $setting = $journal->submissionSetting;
        if (!$setting || !$setting->isCurrentlyOpen()) {
            return redirect()->route('submissions.index')
                ->with('error', 'Submissions for this journal are currently closed.');
        }

        $request->validate([
            'agreement' => 'required|accepted',
        ]);

        $sessionKey = "pending_submission_{$journal->id}";
        $pending = $request->session()->get($sessionKey);

        // Direct payload mode support (e.g. for API/automated tests)
        if (!$pending && $request->has('title') && $request->has('authors')) {
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

            foreach ($requirements as $req) {
                $fileRule = $req->is_required ? 'required|file' : 'nullable|file';
                $mimes = $req->allowed_mimes ? str_replace(' ', '', $req->allowed_mimes) : 'pdf,doc,docx';
                $maxKb = ($req->max_size_mb ?: 10) * 1024;
                $rules["files.{$req->document_type}"] = "{$fileRule}|mimes:{$mimes}|max:{$maxKb}";
            }

            $validated = $request->validate($rules);

            $pending = [
                'title' => $validated['title'],
                'abstract' => $validated['abstract'],
                'keywords' => $validated['keywords'] ?? '',
                'authors' => $validated['authors'],
                'temp_files' => [],
            ];

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $docType => $file) {
                    if ($file && $file->isValid()) {
                        $tempDirectory = "submissions/temp/" . $request->session()->getId() . "_{$journal->id}";
                        $filename = $docType . '_' . time() . '.' . $file->getClientOriginalExtension();
                        $filePath = $file->storeAs($tempDirectory, $filename, 'local');

                        $pending['temp_files'][$docType] = [
                            'temp_path' => $filePath,
                            'original_filename' => $file->getClientOriginalName(),
                            'file_size' => $file->getSize(),
                            'mime_type' => $file->getClientMimeType(),
                        ];
                    }
                }
            }
        }

        if (!$pending) {
            return redirect()->route('submissions.create', $journal)
                ->with('error', 'Submission session expired. Please resubmit your paper details.');
        }

        // Generate atomic Paper ID
        $paperId = $idGenerator->generate($journal);
        $code = $setting ? strtoupper($setting->code) : 'JRN';
        $year = date('Y');

        // Path structure: /submissions/ECO/2026/ECO-2026-0001/
        $directoryPath = "submissions/{$code}/{$year}/{$paperId}";

        // Create Submission record
        $submission = Submission::create([
            'paper_id' => $paperId,
            'journal_id' => $journal->id,
            'user_id' => Auth::id(),
            'title' => $pending['title'],
            'abstract' => $pending['abstract'],
            'keywords' => $pending['keywords'] ?? '',
            'status' => 'Submitted',
            'submitted_at' => now(),
        ]);

        // Save Authors
        foreach ($pending['authors'] as $authorData) {
            $submission->authors()->create([
                'full_name' => $authorData['full_name'],
                'email' => $authorData['email'],
                'affiliation' => $authorData['affiliation'],
                'designation' => $authorData['designation'] ?? null,
                'is_corresponding' => (bool) $authorData['is_corresponding'],
                'order' => (int) $authorData['order'],
            ]);
        }

        // Move temporary files to final private storage destination
        if (!empty($pending['temp_files'])) {
            foreach ($pending['temp_files'] as $docType => $fileInfo) {
                $tempPath = $fileInfo['temp_path'];
                if (Storage::disk('local')->exists($tempPath)) {
                    $filename = $docType . '_' . time() . '.' . pathinfo($tempPath, PATHINFO_EXTENSION);
                    $finalPath = "{$directoryPath}/{$filename}";

                    Storage::disk('local')->move($tempPath, $finalPath);

                    $submission->files()->create([
                        'document_type' => $docType,
                        'original_filename' => $fileInfo['original_filename'],
                        'file_path' => $finalPath,
                        'file_size' => $fileInfo['file_size'],
                        'mime_type' => $fileInfo['mime_type'],
                    ]);
                }
            }
        }

        // Add Initial Status History
        SubmissionStatusHistory::create([
            'submission_id' => $submission->id,
            'status' => 'Submitted',
            'user_id' => Auth::id(),
            'note' => 'Paper submitted by author.',
        ]);

        // Clear session data
        $request->session()->forget($sessionKey);

        // Send Emails asynchronously or inline safely
        try {
            $correspondingAuthor = $submission->correspondingAuthor();
            if ($correspondingAuthor && $correspondingAuthor->email) {
                Mail::to($correspondingAuthor->email)->send(new AuthorSubmissionConfirmationMail($submission));
            }

            // Find journal operator email
            $operator = $journal->editor;
            if ($operator && $operator->email) {
                Mail::to($operator->email)->send(new OperatorSubmissionNotificationMail($submission));
            }
        } catch (\Throwable $e) {
            // Log mail exception without failing submission response
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
