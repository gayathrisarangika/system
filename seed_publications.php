<?php
use App\Models\User;
use App\Models\Department;
use App\Models\Conference;
use App\Models\Symposium;
use App\Models\ConferenceProceeding;
use App\Models\Article;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = User::first() ?: User::factory()->create(['username' => 'admin', 'role' => 'admin']);
$dept = Department::first() ?: Department::create(['name' => 'Faculty of Social Sciences and Languages']);

$conf = Conference::create([
    'editor_id' => $user->id,
    'department_id' => $dept->id,
    'conference_title' => 'International Conference on Social Sciences 2026',
    'university_name' => 'Sabaragamuwa University of Sri Lanka',
    'conference_details' => 'This is a test conference details.',
    'aim_scope' => 'Test Aim & Scope',
    'mission' => 'Test Mission',
    'status' => 'approved',
    'issn' => '2026-0001',
    'online_issn' => '2026-0002',
    'contact_us' => 'Contact the conference team at conf@susl.lk'
]);

$proc = $conf->proceedings()->create([
    'year' => 2026,
    'version' => 'First Edition',
    'pdf_link' => 'proceedings/test.pdf'
]);

$proc->articles()->create([
    'title' => 'Sample Conference Paper',
    'author' => 'John Doe, Jane Smith',
    'abstract' => 'This is a sample abstract for a conference paper.',
    'keywords' => 'Social, Science, Test',
    'year' => 2026,
    'pdf' => 'articles/paper1.pdf'
]);

$symp = Symposium::create([
    'editor_id' => $user->id,
    'department_id' => $dept->id,
    'symposium_title' => 'Annual Undergraduate Symposium 2026',
    'university_name' => 'Sabaragamuwa University of Sri Lanka',
    'symposium_details' => 'Details for the symposium.',
    'status' => 'approved',
    'issn' => '2026-0003'
]);

echo "Seeded conference and symposium.\n";
