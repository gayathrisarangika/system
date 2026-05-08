<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Department;
use App\Models\ConferenceName;
use App\Models\SymposiumName;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserCreationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Setup admin user
        $this->admin = User::create([
            'username' => 'admin',
            'password' => 'password',
            'role' => 'admin',
        ]);
    }

    public function test_admin_can_create_journal_editor()
    {
        $dept = Department::create(['name' => 'Faculty of Applied Sciences']);

        $response = $this->actingAs($this->admin)->post('/admin/users', [
            'name' => 'Journal Editor',
            'email' => 'journal@example.com',
            'username' => 'j_editor',
            'password' => 'password',
            'role' => 'editor',
            'type' => 'journal',
            'publication_id' => $dept->id,
            'journal_title' => 'Custom Journal Title',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'username' => 'j_editor',
            'department_id' => $dept->id,
            'journal_title' => 'Custom Journal Title',
            'type' => 'journal',
        ]);
    }

    public function test_admin_can_create_conference_editor()
    {
        $conf = ConferenceName::create(['name' => 'ICIA 2026']);

        $response = $this->actingAs($this->admin)->post('/admin/users', [
            'name' => 'Conference Editor',
            'email' => 'conf@example.com',
            'username' => 'c_editor',
            'password' => 'password',
            'role' => 'editor',
            'type' => 'conference',
            'publication_id' => $conf->id,
            // conference_title will be auto-filled by controller if empty,
            // but let's test if it's sent from textarea
            'conference_title' => 'International Conference on Industrial Applications',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'username' => 'c_editor',
            'conference_title' => 'International Conference on Industrial Applications',
            'type' => 'conference',
        ]);
    }

    public function test_admin_can_create_symposium_editor()
    {
        $symp = SymposiumName::create(['name' => 'Symposium on Agriculture']);

        $response = $this->actingAs($this->admin)->post('/admin/users', [
            'name' => 'Symposium Editor',
            'email' => 'symp@example.com',
            'username' => 's_editor',
            'password' => 'password',
            'role' => 'editor',
            'type' => 'symposium',
            'publication_id' => $symp->id,
            'symposium_title' => 'Annual Symposium on Agriculture',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'username' => 's_editor',
            'symposium_title' => 'Annual Symposium on Agriculture',
            'type' => 'symposium',
        ]);
    }
}
