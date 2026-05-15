<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Department;
use App\Models\Journal;
use App\Models\Issue;
use App\Models\Article;
use App\Models\ConferenceName;
use App\Models\Conference;
use App\Models\ConferenceProceeding;
use App\Models\SymposiumName;
use App\Models\Symposium;
use App\Models\SymposiumProceeding;
use Illuminate\Support\Facades\Hash;

class VerificationSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Journal setup
        $dept = Department::updateOrCreate(['name' => 'Department of Computing']);
        
        $journalEditor = User::updateOrCreate(
            ['username' => 'jeditor'],
            [
                'name' => 'Journal Editor',
                'email' => 'jeditor@example.com',
                'password' => Hash::make('password'),
                'role' => 'editor',
                'type' => 'journal',
                'department_id' => $dept->id,
                'journal_title' => 'Journal of Computing and Information Systems',
            ]
        );

        $journal = Journal::updateOrCreate(
            ['department_id' => $dept->id],
            [
                'editor_id' => $journalEditor->id,
                'journal_title' => 'Journal of Computing and Information Systems',
                'journal_details' => 'A premier journal for computing research.',
                'university_name' => 'Sabaragamuwa University of Sri Lanka',
                'status' => 'approved',
            ]
        );

        $issue = Issue::updateOrCreate(
            ['journal_id' => $journal->id, 'volume' => 1, 'issue' => 1],
            [
                'year' => 2024,
                'is_current_issue' => true,
            ]
        );

        Article::updateOrCreate(
            ['title' => 'AI in Modern Agriculture', 'issue_id' => $issue->id],
            [
                'author' => 'John Doe, Jane Smith*',
                'abstract' => 'This study explores the integration of AI in precision farming.',
                'keywords' => 'AI, Agriculture, Precision Farming',
                'year' => 2024,
                'pdf' => 'articles/test.pdf',
            ]
        );

        // Conference setup
        $confEditor = User::updateOrCreate(
            ['username' => 'ceditor'],
            [
                'name' => 'Conference Editor',
                'email' => 'ceditor@example.com',
                'password' => Hash::make('password'),
                'role' => 'editor',
                'type' => 'conference',
                'conference_title' => 'ICAC 2024',
            ]
        );

        $conference = Conference::updateOrCreate(
            ['conference_title' => 'ICAC 2024'],
            [
                'editor_id' => $confEditor->id,
                'department_id' => $dept->id,
                'conference_details' => 'Annual conference on advanced computing topics.',
                'university_name' => 'Sabaragamuwa University of Sri Lanka',
                'status' => 'approved',
            ]
        );

        $proc = ConferenceProceeding::updateOrCreate(
            ['conference_id' => $conference->id, 'version' => 'Abstract Book 2024'],
            [
                'year' => 2024,
            ]
        );

        Article::updateOrCreate(
            ['title' => 'Blockchain for Secure Voting', 'conference_proceeding_id' => $proc->id],
            [
                'author' => 'Alice Wong, Bob Brown',
                'abstract' => 'A novel approach to electronic voting using distributed ledgers.',
                'keywords' => 'Blockchain, Voting, Security',
                'year' => 2024,
                'pdf' => 'articles/test2.pdf',
            ]
        );
    }
}
