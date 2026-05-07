<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Department;
use App\Models\Journal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class JournalUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_journal_update_does_not_wipe_files()
    {
        Storage::fake('public');

        $dept = Department::create(['name' => 'IT']);
        $user = User::create([
            'name' => 'Editor',
            'username' => 'editor',
            'email' => 'editor@example.com',
            'password' => bcrypt('password'),
            'role' => 'editor',
            'department_id' => $dept->id
        ]);

        $journal = Journal::create([
            'editor_id' => $user->id,
            'department_id' => $dept->id,
            'journal_title' => 'Test Journal',
            'university_name' => 'Test Uni',
            'cover_image' => 'covers/old.png',
            'status' => 'approved'
        ]);

        $this->actingAs($user);

        // Update without new file
        $response = $this->put("/editor/journal/{$journal->id}", [
            'journal_title' => 'Updated Journal',
            'university_name' => 'Test Uni',
            'cover_image' => null, // Frontend sends null if no new file selected
        ]);

        $response->assertRedirect();
        $journal->refresh();

        $this->assertEquals('Updated Journal', $journal->journal_title);
        $this->assertEquals('covers/old.png', $journal->cover_image); // Should NOT be null
    }
}
