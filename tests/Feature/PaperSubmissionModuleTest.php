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

        $submission = Submission::where('paper_id', "AIR-" . date('Y') . "-0001")->first();
        $this->assertNotNull($submission);
        $this->assertNull($submission->user_id);
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

        $submission = Submission::where('paper_id', "AIR-" . date('Y') . "-0001")->first();
        $this->assertNotNull($submission);
        $this->assertNull($submission->user_id);
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
            return $mail->hasTo('corr.author@example.com')
                && $mail->envelope()->subject === 'Paper Submission Confirmation – [ETJ-' . date('Y') . '-0001]';
        });

        Mail::assertSent(OperatorSubmissionNotificationMail::class, function ($mail) {
            return $mail->hasTo('journal.editor@example.com')
                && $mail->envelope()->subject === 'New Paper Submission – [ETJ-' . date('Y') . '-0001]';
        });
    }

    public function test_author_receives_confirmation_email_and_operator_receives_separate_notification_email()
    {
        Mail::fake();
        Storage::fake('local');

        $editor = User::factory()->create([
            'role' => 'editor',
            'email' => 'operator.journal@example.com',
        ]);
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Journal of Separate Emails',
            'university_name' => 'Sabaragamuwa University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'JSE',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        $payload = [
            'title' => 'Quantum Computing and Cryptography',
            'abstract' => 'In-depth analysis of quantum key distribution protocols.',
            'keywords' => 'Quantum, Cryptography',
            'authors' => [
                [
                    'full_name' => 'Prof. Primary Corresponding Author',
                    'email' => 'corresponding.author@example.com',
                    'affiliation' => 'Department of Physics, Sabaragamuwa University',
                    'designation' => 'Professor',
                    'is_corresponding' => true,
                    'order' => 1,
                ],
                [
                    'full_name' => 'Co-Author One',
                    'email' => 'coauthor1@example.com',
                    'affiliation' => 'Department of Physics',
                    'designation' => 'Lecturer',
                    'is_corresponding' => false,
                    'order' => 2,
                ],
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
            'agreement' => true,
        ];

        $response = $this->post("/submit-paper/journal/{$journal->id}", $payload);
        $response->assertStatus(200);

        $expectedPaperId = 'JSE-' . date('Y') . '-0001';

        // 1. Author Confirmation Email checks
        Mail::assertSent(AuthorSubmissionConfirmationMail::class, function ($mail) use ($expectedPaperId) {
            // Recipient must be strictly corresponding author
            $hasCorrectRecipient = $mail->hasTo('corresponding.author@example.com')
                && !$mail->hasTo('operator.journal@example.com')
                && !$mail->hasTo('coauthor1@example.com');

            // Subject must follow format: Paper Submission Confirmation – [Paper ID]
            $hasCorrectSubject = $mail->envelope()->subject === "Paper Submission Confirmation – [{$expectedPaperId}]";

            // Content checks
            $rendered = $mail->render();
            $hasContent = str_contains($rendered, $expectedPaperId)
                && str_contains($rendered, 'Quantum Computing and Cryptography')
                && str_contains($rendered, 'Journal of Separate Emails')
                && str_contains($rendered, 'Prof. Primary Corresponding Author')
                && str_contains($rendered, 'Paper Submission Successful');

            return $hasCorrectRecipient && $hasCorrectSubject && $hasContent;
        });

        // Ensure Author NEVER receives OperatorSubmissionNotificationMail
        Mail::assertNotSent(OperatorSubmissionNotificationMail::class, function ($mail) {
            return $mail->hasTo('corresponding.author@example.com')
                || $mail->hasTo('coauthor1@example.com');
        });

        // 2. Operator Notification Email checks
        Mail::assertSent(OperatorSubmissionNotificationMail::class, function ($mail) use ($expectedPaperId) {
            // Recipient must be journal operator
            $hasCorrectRecipient = $mail->hasTo('operator.journal@example.com')
                && !$mail->hasTo('corresponding.author@example.com');

            // Subject must follow format: New Paper Submission – [Paper ID]
            $hasCorrectSubject = $mail->envelope()->subject === "New Paper Submission – [{$expectedPaperId}]";

            // Content checks
            $rendered = $mail->render();
            $hasContent = str_contains($rendered, $expectedPaperId)
                && str_contains($rendered, 'Quantum Computing and Cryptography')
                && str_contains($rendered, 'Journal of Separate Emails')
                && str_contains($rendered, 'Prof. Primary Corresponding Author')
                && str_contains($rendered, 'corresponding.author@example.com')
                && str_contains($rendered, 'New Paper Submission Alert');

            return $hasCorrectRecipient && $hasCorrectSubject && $hasContent;
        });

        // Verify exact count of sent emails: 1 author confirmation, 1 operator notification
        Mail::assertSent(AuthorSubmissionConfirmationMail::class, 1);
        Mail::assertSent(OperatorSubmissionNotificationMail::class, 1);
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

    public function test_guest_unauthenticated_user_can_access_and_submit_paper_without_login()
    {
        Mail::fake();
        Storage::fake('local');

        $editor = User::factory()->create([
            'role' => 'editor',
            'email' => 'operator.editor@example.com'
        ]);
        $dept = Department::create(['name' => 'Department of Computing']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Guest Submission Journal',
            'university_name' => 'Test University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'GSJ',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        // Unauthenticated access to form create succeeds (status 200)
        $responseCreate = $this->get("/submit-paper/journal/{$journal->id}");
        $responseCreate->assertStatus(200);

        // Guest submits Step 1 payload
        $payload = [
            'title' => 'Guest Research Paper Title',
            'abstract' => 'Guest Research Paper Abstract',
            'keywords' => 'Guest, Public',
            'authors' => [
                [
                    'full_name' => 'Guest Author Name',
                    'email' => 'guest.author@example.com',
                    'affiliation' => 'Sabaragamuwa University',
                    'is_corresponding' => true,
                    'order' => 1,
                ]
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
        ];

        $confirmResponse = $this->post("/submit-paper/journal/{$journal->id}/confirm", $payload);
        $confirmResponse->assertRedirect(route('submissions.confirm.view', $journal));

        // Unauthenticated access to confirmation view succeeds
        $showConfirmResponse = $this->get("/submit-paper/journal/{$journal->id}/confirm");
        $showConfirmResponse->assertStatus(200);

        // Guest completes final store
        $storeResponse = $this->post("/submit-paper/journal/{$journal->id}", [
            'agreement' => true,
        ]);
        $storeResponse->assertStatus(200);

        // Assert submission created with null user_id
        $submission = Submission::where('paper_id', 'GSJ-' . date('Y') . '-0001')->first();
        $this->assertNotNull($submission);
        $this->assertNull($submission->user_id);

        // Assert emails sent to both parties (guest author and journal operator)
        Mail::assertSent(AuthorSubmissionConfirmationMail::class, function ($mail) {
            return $mail->hasTo('guest.author@example.com');
        });

        Mail::assertSent(OperatorSubmissionNotificationMail::class, function ($mail) {
            return $mail->hasTo('operator.editor@example.com');
        });
    }

    public function test_admin_user_submission_sends_email_to_specified_author_email_not_admin()
    {
        Mail::fake();
        Storage::fake('local');

        $admin = User::factory()->create([
            'role' => 'admin',
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
        ]);

        $editor = User::factory()->create([
            'role' => 'editor',
            'email' => 'operator.editor@example.com',
        ]);

        $dept = Department::create(['name' => 'Department of Social Sciences']);
        $journal = Journal::create([
            'editor_id' => $editor->id,
            'journal_title' => 'Social Sciences Journal',
            'university_name' => 'Test University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'SSJ',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        // Accessing create form as admin
        $response = $this->actingAs($admin)->get("/submit-paper/journal/{$journal->id}");
        $response->assertStatus(200);

        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        $payload = [
            'title' => 'Admin Testing Paper Submission',
            'abstract' => 'Abstract for admin submission test',
            'authors' => [
                [
                    'full_name' => 'John Real Author',
                    'email' => 'real.author@example.com',
                    'affiliation' => 'Sabaragamuwa University',
                    'is_corresponding' => true,
                    'order' => 1,
                ]
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
        ];

        $this->actingAs($admin)->post("/submit-paper/journal/{$journal->id}/confirm", $payload);

        $storeResponse = $this->actingAs($admin)->post("/submit-paper/journal/{$journal->id}", [
            'agreement' => true,
        ]);
        $storeResponse->assertStatus(200);

        // Verify author confirmation mail is sent to real.author@example.com
        Mail::assertSent(AuthorSubmissionConfirmationMail::class, function ($mail) {
            return $mail->hasTo('real.author@example.com') && !$mail->hasTo('admin@gmail.com');
        });
    }

    public function test_corresponding_author_excluded_from_operator_notifications_and_operators_deduplicated_direct_flow()
    {
        Mail::fake();
        Storage::fake('local');

        $dept = Department::create(['name' => 'Department of Computing']);

        // Journal editor who is also the author submitting a paper
        $editorAuthor = User::factory()->create([
            'role' => 'editor',
            'email' => 'Author.Editor@example.com',
            'department_id' => $dept->id,
        ]);

        // Second editor in same department
        $otherEditor = User::factory()->create([
            'role' => 'editor',
            'email' => 'other.editor@example.com',
            'department_id' => $dept->id,
        ]);

        $journal = Journal::create([
            'editor_id' => $editorAuthor->id,
            'journal_title' => 'Exclusion Direct Test Journal',
            'university_name' => 'Test University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $journal->submissionSetting()->create([
            'code' => 'EXD',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        $payload = [
            'title' => 'Direct Flow Paper Exclusion Test',
            'abstract' => 'Testing exclusion of corresponding author from operator notification',
            'authors' => [
                [
                    'full_name' => 'Author Editor',
                    'email' => 'author.editor@example.com', // lowercase vs mixed case
                    'affiliation' => 'Test University',
                    'is_corresponding' => true,
                    'order' => 1,
                ]
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
            'agreement' => true,
        ];

        $response = $this->post("/submit-paper/journal/{$journal->id}", $payload);
        $response->assertStatus(200);

        // Author should receive confirmation mail
        Mail::assertSent(AuthorSubmissionConfirmationMail::class, function ($mail) {
            return $mail->hasTo('author.editor@example.com');
        });

        // Author should NEVER receive operator notification mail
        Mail::assertNotSent(OperatorSubmissionNotificationMail::class, function ($mail) {
            return $mail->hasTo('author.editor@example.com') || $mail->hasTo('Author.Editor@example.com');
        });

        // Other legitimate editor should receive operator notification
        Mail::assertSent(OperatorSubmissionNotificationMail::class, function ($mail) {
            return $mail->hasTo('other.editor@example.com');
        });

        Mail::assertSent(OperatorSubmissionNotificationMail::class, 1);
        Mail::assertSent(AuthorSubmissionConfirmationMail::class, 1);
    }

    public function test_corresponding_author_excluded_from_operator_notifications_and_operators_deduplicated_session_draft_flow()
    {
        Mail::fake();
        Storage::fake('local');

        $dept = Department::create(['name' => 'Department of Computing']);

        // Journal editor who is also the corresponding author
        $editorAuthor = User::factory()->create([
            'role' => 'editor',
            'email' => 'Editor.Author@example.com',
            'department_id' => $dept->id,
        ]);

        // Second editor assigned to journal directly
        $otherEditor = User::factory()->create([
            'role' => 'editor',
            'email' => 'co.operator@example.com',
            'publication_id' => 999, // placeholder, will update
        ]);

        $journal = Journal::create([
            'editor_id' => $editorAuthor->id,
            'journal_title' => 'Exclusion Session Test Journal',
            'university_name' => 'Test University',
            'department_id' => $dept->id,
            'status' => 'approved',
        ]);

        $otherEditor->update(['publication_id' => $journal->id]);

        $journal->submissionSetting()->create([
            'code' => 'EXS',
            'is_open' => true,
            'opening_datetime' => now()->subDay(),
            'closing_datetime' => now()->addMonth(),
        ]);

        $manuscript = UploadedFile::fake()->create('manuscript.pdf', 500, 'application/pdf');

        $payload = [
            'title' => 'Session Draft Flow Paper Exclusion Test',
            'abstract' => 'Testing exclusion of corresponding author from operator notification in two step flow',
            'authors' => [
                [
                    'full_name' => 'Editor Author',
                    'email' => 'editor.author@example.com',
                    'affiliation' => 'Test University',
                    'is_corresponding' => true,
                    'order' => 1,
                ]
            ],
            'files' => [
                'manuscript' => $manuscript,
            ],
        ];

        // Step 1: Confirm post
        $confirmResponse = $this->post("/submit-paper/journal/{$journal->id}/confirm", $payload);
        $confirmResponse->assertRedirect(route('submissions.confirm.view', $journal));

        // Step 2: Final store post
        $storeResponse = $this->post("/submit-paper/journal/{$journal->id}", [
            'agreement' => true,
        ]);
        $storeResponse->assertStatus(200);

        // Author should receive confirmation mail
        Mail::assertSent(AuthorSubmissionConfirmationMail::class, function ($mail) {
            return $mail->hasTo('editor.author@example.com');
        });

        // Author should NEVER receive operator notification mail
        Mail::assertNotSent(OperatorSubmissionNotificationMail::class, function ($mail) {
            return $mail->hasTo('editor.author@example.com') || $mail->hasTo('Editor.Author@example.com');
        });

        // Co-operator should receive operator notification
        Mail::assertSent(OperatorSubmissionNotificationMail::class, function ($mail) {
            return $mail->hasTo('co.operator@example.com');
        });

        Mail::assertSent(OperatorSubmissionNotificationMail::class, 1);
        Mail::assertSent(AuthorSubmissionConfirmationMail::class, 1);
    }
}
