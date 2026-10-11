<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Journal;
use App\Models\Department;
use App\Models\Submission;
use App\Models\SubmissionFile;
use App\Services\PaperIdGeneratorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
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

    public function test_unauthorized_user_cannot_download_author_submission_file()
    {
        Storage::fake('local');

        $editor = User::factory()->create();
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Security Test Journal',
            'university_name' => 'Sabaragamuwa University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $author = User::factory()->create();
        $otherUser = User::factory()->create();

        $submission = Submission::create([
            'paper_id' => 'SEC-2026-0001',
            'journal_id' => $journal->id,
            'user_id' => $author->id,
            'title' => 'Secret Paper',
            'abstract' => 'Secret Abstract',
            'status' => 'Submitted',
        ]);

        $fileRecord = $submission->files()->create([
            'document_type' => 'manuscript',
            'original_filename' => 'manuscript.pdf',
            'file_path' => 'submissions/SEC/2026/SEC-2026-0001/manuscript.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
        ]);

        Storage::disk('local')->put($fileRecord->file_path, 'PDF Content');

        // Other user attempting to download author's paper file
        $response = $this->actingAs($otherUser)->get("/author/submission/{$submission->id}/file/{$fileRecord->id}");
        $response->assertStatus(403);

        // Submitting author downloading own paper file
        $responseAuthor = $this->actingAs($author)->get("/author/submission/{$submission->id}/file/{$fileRecord->id}");
        $responseAuthor->assertStatus(200);
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
