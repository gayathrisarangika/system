<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\Submission;
use App\Models\SubmissionFile;
use App\Models\SubmissionStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JournalSubmissionManagementController extends Controller
{
    /**
     * Operator Dashboard: View list of submissions for assigned journal with search, filter, sort, paginate.
     */
    public function submissions(Request $request, Journal $journal)
    {
        $this->authorizeOperator($journal);

        $query = $journal->submissions()->with(['authors', 'files']);

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('paper_id', 'LIKE', "%{$search}%")
                  ->orWhere('title', 'LIKE', "%{$search}%")
                  ->orWhereHas('authors', function ($a) use ($search) {
                      $a->where('full_name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%");
                  });
            });
        }

        // Filter by Status
        if ($status = $request->input('status')) {
            if ($status !== 'All') {
                $query->where('status', $status);
            }
        }

        // Sort
        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $allowedSorts = ['paper_id', 'title', 'status', 'created_at', 'submitted_at'];

        if (in_array($sortColumn, $allowedSorts)) {
            $query->orderBy($sortColumn, strtolower($sortDirection) === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $submissions = $query->paginate(10)->withQueryString();

        return Inertia::render('Management/Journal/Submissions', [
            'journal' => $journal,
            'submissions' => $submissions,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'All'),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'statusOptions' => [
                'Submitted',
                'Initial Screening',
                'Under Review',
                'Revision Required',
                'Resubmitted',
                'Accepted',
                'Rejected',
            ],
        ]);
    }

    /**
     * View detailed submission information.
     */
    public function show(Submission $submission)
    {
        $this->authorizeOperator($submission->journal);

        $submission->load(['journal', 'authors', 'files', 'statusHistories.user']);

        return Inertia::render('Management/Journal/SubmissionDetail', [
            'submission' => $submission,
            'statusOptions' => [
                'Submitted',
                'Initial Screening',
                'Under Review',
                'Revision Required',
                'Resubmitted',
                'Accepted',
                'Rejected',
            ],
        ]);
    }

    /**
     * Update submission status and record audit history.
     */
    public function updateStatus(Request $request, Submission $submission)
    {
        $this->authorizeOperator($submission->journal);

        $validated = $request->validate([
            'status' => 'required|string|in:Submitted,Initial Screening,Under Review,Revision Required,Resubmitted,Accepted,Rejected',
            'note' => 'nullable|string|max:1000',
        ]);

        $oldStatus = $submission->status;
        $submission->update(['status' => $validated['status']]);

        // Record history entry
        SubmissionStatusHistory::create([
            'submission_id' => $submission->id,
            'status' => $validated['status'],
            'user_id' => Auth::id(),
            'note' => $validated['note'] ?? "Status updated from '{$oldStatus}' to '{$validated['status']}'.",
        ]);

        return back()->with('success', 'Submission status updated successfully.');
    }

    /**
     * Edit Submission Period and Document Requirements.
     */
    public function editSettings(Journal $journal)
    {
        $this->authorizeOperator($journal);

        $setting = $journal->submissionSetting;
        if (!$setting) {
            $setting = $journal->submissionSetting()->create([
                'code' => strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $journal->journal_title), 0, 3)) ?: 'JRN',
                'is_open' => true,
                'opening_datetime' => now(),
                'closing_datetime' => now()->addMonths(6),
            ]);
        }

        $documentRequirements = $journal->documentRequirements;

        return Inertia::render('Management/Journal/SubmissionSettings', [
            'journal' => $journal,
            'setting' => [
                'id' => $setting->id,
                'code' => $setting->code,
                'is_open' => (bool) $setting->is_open,
                'opening_datetime' => $setting->opening_datetime ? $setting->opening_datetime->format('Y-m-d\TH:i') : '',
                'closing_datetime' => $setting->closing_datetime ? $setting->closing_datetime->format('Y-m-d\TH:i') : '',
            ],
            'documentRequirements' => $documentRequirements,
        ]);
    }

    /**
     * Update Submission Period and Document Requirements.
     */
    public function updateSettings(Request $request, Journal $journal)
    {
        $this->authorizeOperator($journal);

        $validated = $request->validate([
            'code' => 'required|string|max:10|alpha_dash',
            'is_open' => 'required|boolean',
            'opening_datetime' => 'nullable|date',
            'closing_datetime' => 'nullable|date|after_or_equal:opening_datetime',
            'requirements' => 'required|array|min:1',
            'requirements.*.id' => 'nullable|integer',
            'requirements.*.document_type' => 'required|string|max:50',
            'requirements.*.label' => 'required|string|max:100',
            'requirements.*.is_required' => 'required|boolean',
            'requirements.*.allowed_mimes' => 'required|string|max:100',
            'requirements.*.max_size_mb' => 'required|integer|min:1|max:100',
        ]);

        // Update Submission Setting
        $journal->submissionSetting()->updateOrCreate(
            ['journal_id' => $journal->id],
            [
                'code' => strtoupper($validated['code']),
                'is_open' => $validated['is_open'],
                'opening_datetime' => $validated['opening_datetime'] ?? null,
                'closing_datetime' => $validated['closing_datetime'] ?? null,
            ]
        );

        // Update or create document requirements
        $existingIds = [];
        foreach ($validated['requirements'] as $req) {
            $record = $journal->documentRequirements()->updateOrCreate(
                ['id' => $req['id'] ?? null],
                [
                    'journal_id' => $journal->id,
                    'document_type' => $req['document_type'],
                    'label' => $req['label'],
                    'is_required' => $req['is_required'],
                    'allowed_mimes' => $req['allowed_mimes'],
                    'max_size_mb' => $req['max_size_mb'],
                ]
            );
            $existingIds[] = $record->id;
        }

        // Delete removed requirements
        $journal->documentRequirements()->whereNotIn('id', $existingIds)->delete();

        return back()->with('success', 'Submission settings updated successfully.');
    }

    /**
     * Operator Secure File Download.
     */
    public function downloadFile(Submission $submission, SubmissionFile $file)
    {
        $this->authorizeOperator($submission->journal);

        if ($file->submission_id !== $submission->id) {
            abort(404, 'File not found.');
        }

        if (!Storage::disk('local')->exists($file->file_path)) {
            abort(404, 'File not found on server storage.');
        }

        return Storage::disk('local')->download($file->file_path, $file->original_filename);
    }

    /**
     * Ensure current user is authorized to manage the journal submissions.
     */
    private function authorizeOperator(Journal $journal)
    {
        if (Auth::user()->role === 'admin') {
            return;
        }

        if (Auth::user()->role === 'editor') {
            if ($journal->editor_id === Auth::id() || $journal->department_id === Auth::user()->department_id) {
                return;
            }
        }

        abort(403, 'Unauthorized access to journal submissions.');
    }
}
