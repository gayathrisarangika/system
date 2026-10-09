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
        $dept1 = Department::firstOrCreate(['name' => 'Department of Computing']);
        $dept2 = Department::firstOrCreate(['name' => 'Department of Economics and Statistics']);
        $dept3 = Department::firstOrCreate(['name' => 'Department of Social Sciences']);
        $dept4 = Department::firstOrCreate(['name' => 'Department of Languages']);
        $dept5 = Department::firstOrCreate(['name' => 'Department of Geography']);

        $admin = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $editor = User::firstOrCreate(
            ['username' => 'editor'],
            [
                'name' => 'Editor User',
                'password' => Hash::make('password'),
                'role' => 'editor',
                'department_id' => $dept1->id,
            ]
        );

        // Ensure 5 approved journals exist for testing paper submission
        $journalsData = [
            [
                'journal_title' => 'Sabaragamuwa Journal of Social Sciences',
                'dept_id' => $dept3->id,
            ],
            [
                'journal_title' => 'Journal of Economics and Development',
                'dept_id' => $dept2->id,
            ],
            [
                'journal_title' => 'Journal of Languages and Culture',
                'dept_id' => $dept4->id,
            ],
            [
                'journal_title' => 'Journal of Computing and Information Technology',
                'dept_id' => $dept1->id,
            ],
            [
                'journal_title' => 'Journal of Geographical Studies',
                'dept_id' => $dept5->id,
            ],
        ];

        foreach ($journalsData as $jData) {
            Journal::firstOrCreate(
                ['journal_title' => $jData['journal_title']],
                [
                    'editor_id' => $editor->id,
                    'department_id' => $jData['dept_id'],
                    'university_name' => 'Sabaragamuwa University of Sri Lanka',
                    'journal_details' => 'Premier research journal by Sabaragamuwa University of Sri Lanka.',
                    'aim_scope' => 'Covers peer-reviewed academic research.',
                    'mission' => 'Advancing academic knowledge and scholarly research.',
                    'status' => 'approved',
                ]
            );
        }

        $conf = \App\Models\Conference::firstOrCreate(
            ['conference_title' => 'International Conference on Social Sciences and Languages'],
            [
                'editor_id' => $admin->id,
                'department_id' => $dept1->id,
                'university_name' => 'Sabaragamuwa University of Sri Lanka',
                'status' => 'approved',
            ]
        );

        \App\Models\ConferenceProceeding::firstOrCreate(
            ['conference_id' => $conf->id, 'year' => 2026],
            [
                'version' => 'First Edition',
                'pdf_link' => '#',
            ]
        );

        $symp = \App\Models\Symposium::firstOrCreate(
            ['symposium_title' => "Sabaragamuwa Social Sciences & Languages Students' Annual Symposium"],
            [
                'editor_id' => $admin->id,
                'department_id' => $dept1->id,
                'university_name' => 'Sabaragamuwa University of Sri Lanka',
                'status' => 'approved',
            ]
        );

        \App\Models\SymposiumProceeding::firstOrCreate(
            ['symposium_id' => $symp->id, 'year' => 2026],
            [
                'version' => 'Inaugural Issue',
                'pdf_link' => '#',
            ]
        );

        $firstJournal = Journal::where('status', 'approved')->first();
        if ($firstJournal) {
            $issue = Issue::firstOrCreate(
                ['journal_id' => $firstJournal->id, 'volume' => 1, 'issue' => 1],
                [
                    'year' => 2026,
                    'is_current_issue' => true,
                ]
            );

            Article::firstOrCreate(
                ['issue_id' => $issue->id, 'title' => 'Deep Learning in 2026'],
                [
                    'author' => 'Dr. Jane Smith, Prof. Alan Turing',
                    'abstract' => 'An overview of deep learning advancements.',
                    'keywords' => 'AI, Deep Learning',
                    'year' => 2026,
                    'pdf' => '#',
                ]
            );
        }

        $this->call(SubmissionSettingsSeeder::class);
    }
}
