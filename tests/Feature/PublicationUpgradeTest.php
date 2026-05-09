<?php

namespace Tests\Feature;

use App\Models\Conference;
use App\Models\Symposium;
use App\Models\User;
use App\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicationUpgradeTest extends TestCase
{
    use RefreshDatabase;

    public function test_conference_new_fields_and_accessors()
    {
        Storage::fake('public');
        $user = User::factory()->create(['username' => 'testuser']);
        $dept = Department::create(['name' => 'Test Dept']);

        $conference = Conference::create([
            'editor_id' => $user->id,
            'department_id' => $dept->id,
            'conference_title' => 'Test Conference',
            'university_name' => 'Test Uni',
            'issn' => '1234-5678',
            'online_issn' => '8765-4321',
            'contact_us' => 'Contact Info',
            'cover_image' => 'covers/test.jpg',
            'university_logo' => 'logos/logo.png',
            'for_authors' => 'guidelines/authors.pdf',
            'for_reviewers' => 'guidelines/reviewers.pdf',
            'editorial_policies' => 'policies/policy.pdf',
        ]);

        $this->assertEquals('1234-5678', $conference->issn);
        $this->assertEquals('Contact Info', $conference->contact_us);

        $this->assertStringContainsString('/storage/covers/test.jpg', $conference->cover_image_url);
        $this->assertStringContainsString('/storage/logos/logo.png', $conference->university_logo_url);
        $this->assertStringContainsString('/storage/guidelines/authors.pdf', $conference->for_authors_url);
        $this->assertStringContainsString('/storage/guidelines/reviewers.pdf', $conference->for_reviewers_url);
        $this->assertStringContainsString('/storage/policies/policy.pdf', $conference->editorial_policies_url);
    }

    public function test_symposium_new_fields_and_accessors()
    {
        Storage::fake('public');
        $user = User::factory()->create(['username' => 'testuser2']);
        $dept = Department::create(['name' => 'Test Dept']);

        $symposium = Symposium::create([
            'editor_id' => $user->id,
            'department_id' => $dept->id,
            'symposium_title' => 'Test Symposium',
            'university_name' => 'Test Uni',
            'issn' => '1111-2222',
            'online_issn' => '3333-4444',
            'contact_us' => 'Symposium Contact',
            'cover_image' => 'covers/symp.jpg',
            'university_logo' => 'logos/symp_logo.png',
            'for_authors' => 'guidelines/symp_authors.pdf',
        ]);

        $this->assertEquals('1111-2222', $symposium->issn);
        $this->assertStringContainsString('/storage/covers/symp.jpg', $symposium->cover_image_url);
        $this->assertStringContainsString('/storage/guidelines/symp_authors.pdf', $symposium->for_authors_url);
    }
}
