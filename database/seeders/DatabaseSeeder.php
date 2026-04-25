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
            'university_name' => 'Global Tech University',
            'journal_details' => 'Leading journal in Artificial Intelligence.',
            'aim_scope' => 'Covers all aspects of AI.',
            'mission' => 'To advance AI research.',
            'status' => 'approved',
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
