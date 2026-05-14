<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Department;
use App\Models\Journal;
use App\Models\Issue;
use App\Models\Article;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $dept = Department::create(['name' => 'Department of Computing']);

        $admin = User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $editor = User::create([
            'name' => 'Editor User',
            'username' => 'editor',
            'password' => Hash::make('password'),
            'role' => 'editor',
            'department_id' => $dept->id,
        ]);

        $journal = Journal::create([
            'editor_id' => $editor->id,
            'department_id' => $dept->id,
            'journal_title' => 'International Journal of AI Research',
            'university_name' => 'Sabaragamuwa University of Sri Lanka',
            'journal_details' => 'Leading journal in Artificial Intelligence.',
            'aim_scope' => 'Covers all aspects of AI.',
            'mission' => 'To advance AI research.',
            'status' => 'approved',
        ]);

        $conf = \App\Models\Conference::create([
            'editor_id' => $admin->id,
            'department_id' => $dept->id,
            'conference_title' => 'International Conference on Social Sciences and Languages',
            'university_name' => 'Sabaragamuwa University of Sri Lanka',
            'status' => 'approved',
        ]);

        \App\Models\ConferenceProceeding::create([
            'conference_id' => $conf->id,
            'year' => 2026,
            'version' => 'First Edition',
            'pdf_link' => '#',
        ]);

        $symp = \App\Models\Symposium::create([
            'editor_id' => $admin->id,
            'department_id' => $dept->id,
            'symposium_title' => "Sabaragamuwa Social Sciences & Languages Students' Annual Symposium",
            'university_name' => 'Sabaragamuwa University of Sri Lanka',
            'status' => 'approved',
        ]);

        \App\Models\SymposiumProceeding::create([
            'symposium_id' => $symp->id,
            'year' => 2026,
            'version' => 'Inaugural Issue',
            'pdf_link' => '#',
        ]);

        $issue = Issue::create([
            'journal_id' => $journal->id,
            'volume' => 1,
            'issue' => 1,
            'year' => 2026,
            'is_current_issue' => true,
        ]);

        Article::create([
            'issue_id' => $issue->id,
            'title' => 'Deep Learning in 2026',
            'author' => 'Dr. Jane Smith, Prof. Alan Turing',
            'abstract' => 'An overview of deep learning advancements.',
            'keywords' => 'AI, Deep Learning',
            'year' => 2026,
            'pdf' => '#',
        ]);

        Journal::create([
            'editor_id' => $editor->id,
            'department_id' => $dept->id,
            'journal_title' => 'Pending Journal',
            'university_name' => 'Test Uni',
            'status' => 'pending',
        ]);
    }
}
