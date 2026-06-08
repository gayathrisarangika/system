<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Department;
use App\Models\ConferenceName;
use App\Models\SymposiumName;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MasterDataManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_store_department()
    {
        $admin = User::factory()->create(['role' => 'admin', 'username' => 'admin_test']);

        $response = $this->actingAs($admin)->post('/admin/departments', [
            'name' => 'New Department'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('departments', ['name' => 'New Department']);
    }

    public function test_admin_can_store_conference_name()
    {
        $admin = User::factory()->create(['role' => 'admin', 'username' => 'admin_test_conf']);

        $response = $this->actingAs($admin)->post('/admin/conference-names', [
            'name' => 'New Conference'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('conference_names', ['name' => 'New Conference']);
    }

    public function test_admin_can_store_symposium_name()
    {
        $admin = User::factory()->create(['role' => 'admin', 'username' => 'admin_test_symp']);

        $response = $this->actingAs($admin)->post('/admin/symposium-names', [
            'name' => 'New Symposium'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('symposium_names', ['name' => 'New Symposium']);
    }

    public function test_non_admin_cannot_store_master_data()
    {
        $editor = User::factory()->create(['role' => 'editor', 'username' => 'editor_test']);

        $response = $this->actingAs($editor)->post('/admin/departments', [
            'name' => 'Illegal Department'
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('departments', ['name' => 'Illegal Department']);
    }
}
