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
     * Preview / Confirmation Step before final submission.
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

        foreach ($requirements as $req) {
            $fileRule = $req->is_required ? 'required|file' : 'nullable|file';
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

        // Return confirmation details to frontend without saving yet
        $fileDetails = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $type => $file) {
                if ($file) {
                    $fileDetails[$type] = [
                        'original_filename' => $file->getClientOriginalName(),
                        'size_mb' => round($file->getSize() / (1024 * 1024), 2),
                        'mime_type' => $file->getClientMimeType(),
                    ];
                }
            }
        }

        return Inertia::render('Submissions/Confirm', [
            'journal' => [
                'id' => $journal->id,
                'journal_title' => $journal->journal_title,
                'university_name' => $journal->university_name,
            ],
            'paper' => [
                'title' => $validated['title'],
                'abstract' => $validated['abstract'],
                'keywords' => $validated['keywords'] ?? '',
                'authors' => $validated['authors'],
                'file_details' => $fileDetails,
            ],
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
            'title' => $validated['title'],
            'abstract' => $validated['abstract'],
            'keywords' => $validated['keywords'] ?? '',
            'status' => 'Submitted',
            'submitted_at' => now(),
        ]);

        // Save Authors
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

        // Save Files on private disk
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $docType => $file) {
                if ($file && $file->isValid()) {
                    $filename = $docType . '_' . time() . '.' . $file->getClientOriginalExtension();
                    $filePath = $file->storeAs($directoryPath, $filename, 'local'); // Private disk

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

        // Add Initial Status History
        SubmissionStatusHistory::create([
            'submission_id' => $submission->id,
            'status' => 'Submitted',
            'user_id' => Auth::id(),
            'note' => 'Paper submitted by author.',
        ]);

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
