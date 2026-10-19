<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Journal;
use App\Models\Department;
use App\Models\Submission;
use App\Models\SubmissionFile;
use App\Services\PaperIdGeneratorService;
use App\Mail\AuthorStatusUpdateMail;
use App\Mail\AuthorSubmissionConfirmationMail;
use App\Mail\OperatorSubmissionNotificationMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PaperSubmissionModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_paper_id_generator_format_and_atomicity()
    {
        $editor = User::factory()->create();
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Test Journal of Economics',
            'university_name' => 'Test University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'ECO',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $service = new PaperIdGeneratorService();
        $id1 = $service->generate($journal);
        $this->assertEquals("ECO-" . date('Y') . "-0001", $id1);

        // Create submission with id1
        $author = User::factory()->create();
        Submission::create([
            'paper_id' => $id1,
            'journal_id' => $journal->id,
            'user_id' => $author->id,
            'title' => 'First Paper',
            'abstract' => 'First Abstract',
            'status' => 'Submitted',
        ]);

        $id2 = $service->generate($journal);
        $this->assertEquals("ECO-" . date('Y') . "-0002", $id2);
    }

    public function test_submission_landing_page_renders()
    {
        $editor = User::factory()->create();
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Test Open Journal',
            'university_name' => 'Test University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'TOJ',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $response = $this->get('/submit-paper');
        $response->assertStatus(200);
    }

    public function test_author_can_submit_paper_and_files_stored_privately()
    {
        Storage::fake('local');

        $editor = User::factory()->create();
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Journal of AI Research',
            'university_name' => 'Sabaragamuwa University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'AIR',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $journal->documentRequirements()->create([
            'document_type' => 'manuscript',
            'label' => 'Main Manuscript',
            'is_required' => true,
            'allowed_mimes' => 'pdf,doc,docx',
            'max_size_mb' => 10,
        ]);

        $author = User::factory()->create();

        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        $payload = [
            'title' => 'Advanced Deep Learning Architecture',
            'abstract' => 'Comprehensive abstract detailing neural network design.',
            'keywords' => 'AI, Deep Learning',
            'authors' => [
                [
                    'full_name' => 'Dr. Author Name',
                    'email' => 'author@example.com',
                    'affiliation' => 'Sabaragamuwa University',
                    'designation' => 'Senior Lecturer',
                    'is_corresponding' => true,
                    'order' => 1,
                ]
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
            'agreement' => true,
        ];

        $response = $this->actingAs($author)->post("/submit-paper/journal/{$journal->id}", $payload);

        $response->assertStatus(200);

        $submission = Submission::where('user_id', $author->id)->first();
        $this->assertNotNull($submission);
        $this->assertEquals("AIR-" . date('Y') . "-0001", $submission->paper_id);

        // Assert file exists on private storage
        $fileRecord = $submission->files()->first();
        $this->assertNotNull($fileRecord);
        Storage::disk('local')->assertExists($fileRecord->file_path);
    }

    public function test_editor_status_update_sends_email_notification_to_author()
    {
        Mail::fake();

        $editor = User::factory()->create(['role' => 'editor']);
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Test Status Update Journal',
            'university_name' => 'Sabaragamuwa University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $author = User::factory()->create();

        $submission = Submission::create([
            'paper_id' => 'TSU-2026-0001',
            'journal_id' => $journal->id,
            'user_id' => $author->id,
            'title' => 'Status Update Test Paper',
            'abstract' => 'Test Abstract',
            'status' => 'Submitted',
        ]);

        $submission->authors()->create([
            'full_name' => 'Corresponding Author',
            'email' => 'author.status@example.com',
            'affiliation' => 'Sabaragamuwa University',
            'is_corresponding' => true,
            'order' => 1,
        ]);

        $response = $this->actingAs($editor)->post("/editor/submission/{$submission->id}/status", [
            'status' => 'Under Review',
            'note' => 'Your manuscript is currently under peer review.',
        ]);

        $response->assertStatus(302);
        $this->assertEquals('Under Review', $submission->fresh()->status);

        Mail::assertSent(AuthorStatusUpdateMail::class, function ($mail) use ($submission) {
            return $mail->hasTo('author.status@example.com') &&
                   $mail->submission->id === $submission->id &&
                   $mail->newStatus === 'Under Review' &&
                   $mail->note === 'Your manuscript is currently under peer review.';
        });
    }

    public function test_two_step_confirmation_submission_flow_succeeds()
    {
        Storage::fake('local');

        $editor = User::factory()->create();
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Journal of AI Research',
            'university_name' => 'Sabaragamuwa University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'AIR',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $journal->documentRequirements()->create([
            'document_type' => 'manuscript',
            'label' => 'Main Manuscript',
            'is_required' => true,
            'allowed_mimes' => 'pdf,doc,docx',
            'max_size_mb' => 10,
        ]);

        $author = User::factory()->create();
        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        $payload = [
            'title' => 'Multi-step Submission Test Title',
            'abstract' => 'Multi-step Submission Test Abstract',
            'keywords' => 'Test, Confirmation',
            'authors' => [
                [
                    'full_name' => 'John Doe',
                    'email' => 'john@example.com',
                    'affiliation' => 'Sabaragamuwa University',
                    'designation' => 'Researcher',
                    'is_corresponding' => true,
                    'order' => 1,
                ]
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
        ];

        // Step 1: Submit details for confirmation
        $confirmResponse = $this->actingAs($author)->post("/submit-paper/journal/{$journal->id}/confirm", $payload);
        $confirmResponse->assertRedirect(route('submissions.confirm.view', $journal));

        // Step 2: Render GET confirmation page
        $showConfirmResponse = $this->actingAs($author)->get("/submit-paper/journal/{$journal->id}/confirm");
        $showConfirmResponse->assertStatus(200);
        $showConfirmResponse->assertInertia(fn ($page) => $page
            ->component('Submissions/Confirm')
            ->where('paper.title', 'Multi-step Submission Test Title')
        );

        // Step 3: Final submission post
        $finalResponse = $this->actingAs($author)->post("/submit-paper/journal/{$journal->id}", [
            'agreement' => true,
        ]);
        $finalResponse->assertStatus(200);
        $finalResponse->assertInertia(fn ($page) => $page->component('Submissions/Success'));

        $submission = Submission::where('user_id', $author->id)->first();
        $this->assertNotNull($submission);
        $this->assertEquals("AIR-" . date('Y') . "-0001", $submission->paper_id);

        $fileRecord = $submission->files()->first();
        $this->assertNotNull($fileRecord);
        Storage::disk('local')->assertExists($fileRecord->file_path);
    }

    public function test_confirmation_redirects_back_without_405_error_when_agreement_unaccepted()
    {
        Storage::fake('local');

        $editor = User::factory()->create();
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Journal of AI Research',
            'university_name' => 'Sabaragamuwa University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'AIR',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $author = User::factory()->create();
        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        $payload = [
            'title' => 'Validation Test Title',
            'abstract' => 'Validation Test Abstract',
            'authors' => [
                [
                    'full_name' => 'Jane Doe',
                    'email' => 'jane@example.com',
                    'affiliation' => 'Sabaragamuwa University',
                    'is_corresponding' => true,
                    'order' => 1,
                ]
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
        ];

        // Step 1: Post to confirm
        $this->actingAs($author)->post("/submit-paper/journal/{$journal->id}/confirm", $payload);

        // Step 2: Visit GET confirm page first
        $this->actingAs($author)->get("/submit-paper/journal/{$journal->id}/confirm");

        // Step 3: Attempt final submission without agreement
        $response = $this->actingAs($author)
            ->from(route('submissions.confirm.view', $journal))
            ->post("/submit-paper/journal/{$journal->id}", [
                'agreement' => false,
            ]);

        // Redirects back to GET /submit-paper/journal/{journal}/confirm with 302, NOT 405!
        $response->assertStatus(302);
        $response->assertRedirect(route('submissions.confirm.view', $journal));
        $response->assertSessionHasErrors(['agreement']);
    }

    public function test_submission_sends_emails_to_author_and_editor_in_two_step_flow()
    {
        Mail::fake();
        Storage::fake('local');

        $editor = User::factory()->create([
            'role' => 'editor',
            'email' => 'journal.editor@example.com'
        ]);
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Email Test Journal',
            'university_name' => 'Sabaragamuwa University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'ETJ',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $authorUser = User::factory()->create(['email' => 'author.user@example.com']);
        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        $payload = [
            'title' => 'Email Flow Paper Title',
            'abstract' => 'Email Flow Paper Abstract',
            'keywords' => 'Email, Test',
            'authors' => [
                [
                    'full_name' => 'Corresponding Author',
                    'email' => 'corr.author@example.com',
                    'affiliation' => 'Sabaragamuwa University',
                    'is_corresponding' => true,
                    'order' => 1,
                ]
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
        ];

        // Step 1: Confirm post
        $this->actingAs($authorUser)->post("/submit-paper/journal/{$journal->id}/confirm", $payload);

        // Step 2: Final store post
        $response = $this->actingAs($authorUser)->post("/submit-paper/journal/{$journal->id}", [
            'agreement' => true,
        ]);

        $response->assertStatus(200);

        Mail::assertSent(AuthorSubmissionConfirmationMail::class, function ($mail) {
            return $mail->hasTo('corr.author@example.com');
        });

        Mail::assertSent(OperatorSubmissionNotificationMail::class, function ($mail) {
            return $mail->hasTo('journal.editor@example.com');
        });
    }

    public function test_submission_sends_emails_to_department_editors_when_journal_editor_has_no_email()
    {
        Mail::fake();
        Storage::fake('local');

        $dept = Department::create(['name' => 'Department of Computing']);
        $noEmailEditor = User::factory()->create([
            'role' => 'editor',
            'department_id' => $dept->id,
            'email' => null,
        ]);
        $deptEditor = User::factory()->create([
            'role' => 'editor',
            'department_id' => $dept->id,
            'email' => 'dept.editor@example.com'
        ]);

        $journal = Journal::create([
            'editor_id' => $noEmailEditor->id,
            'journal_title' => 'Department Editor Journal',
            'university_name' => 'Sabaragamuwa University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'DEJ',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $authorUser = User::factory()->create(['email' => 'submitting.author@example.com']);
        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        $payload = [
            'title' => 'Null Editor ID Test Title',
            'abstract' => 'Null Editor ID Test Abstract',
            'authors' => [
                [
                    'full_name' => 'Submitting Author',
                    'email' => 'submitting.author@example.com',
                    'affiliation' => 'Sabaragamuwa University',
                    'is_corresponding' => true,
                    'order' => 1,
                ]
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
            'agreement' => true,
        ];

        $response = $this->actingAs($authorUser)->post("/submit-paper/journal/{$journal->id}", $payload);
        $response->assertStatus(200);

        Mail::assertSent(AuthorSubmissionConfirmationMail::class, function ($mail) {
            return $mail->hasTo('submitting.author@example.com');
        });

        Mail::assertSent(OperatorSubmissionNotificationMail::class, function ($mail) {
            return $mail->hasTo('dept.editor@example.com');
        });
    }

    public function test_unauthenticated_user_redirected_to_login_when_accessing_submission_routes()
    {
        $editor = User::factory()->create();
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Unauth Test Journal',
            'university_name' => 'Test University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'UTJ',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        // Unauthenticated access to form create
        $responseCreate = $this->get("/submit-paper/journal/{$journal->id}");
        $responseCreate->assertRedirect(route('login'));

        // Unauthenticated access to confirm view
        $responseConfirmView = $this->get("/submit-paper/journal/{$journal->id}/confirm");
        $responseConfirmView->assertRedirect(route('login'));

        // Unauthenticated post to confirm
        $responseConfirm = $this->post("/submit-paper/journal/{$journal->id}/confirm", []);
        $responseConfirm->assertRedirect(route('login'));

        // Unauthenticated final store
        $responseStore = $this->post("/submit-paper/journal/{$journal->id}", ['agreement' => true]);
        $responseStore->assertRedirect(route('login'));
    }
}
