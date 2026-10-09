<?php

namespace Database\Seeders;

use App\Models\Journal;
use App\Models\JournalSubmissionSetting;
use App\Models\JournalDocumentRequirement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubmissionSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $journals = Journal::where('status', 'approved')->get();

        $defaultCodes = ['ECO', 'SOC', 'LAN', 'COM', 'GEO', 'JSS', 'MGT', 'HUM'];
        $codeIndex = 0;

        foreach ($journals as $journal) {
            if (!$journal->submissionSetting) {
                // Generate short code from title or fallback to default list
                $words = explode(' ', preg_replace('/[^a-zA-Z0-9\s]/', '', $journal->journal_title));
                $codeCandidate = '';
                foreach ($words as $w) {
                    if (strlen($w) > 3 && !in_array(strtolower($w), ['journal', 'international', 'research', 'of', 'and', 'the'])) {
                        $codeCandidate .= strtoupper(substr($w, 0, 3));
                        break;
                    }
                }

                if (empty($codeCandidate)) {
                    $codeCandidate = $defaultCodes[$codeIndex % count($defaultCodes)];
                    $codeIndex++;
                }

                // Ensure unique code
                $finalCode = substr($codeCandidate, 0, 5);
                while (JournalSubmissionSetting::where('code', $finalCode)->exists()) {
                    $finalCode = substr($codeCandidate, 0, 3) . rand(10, 99);
                }

                JournalSubmissionSetting::create([
                    'journal_id' => $journal->id,
                    'code' => $finalCode,
                    'is_open' => true,
                    'opening_datetime' => now()->subDays(10),
                    'closing_datetime' => now()->addMonths(6),
                ]);
            }

            // Seed default document requirements if none exist
            if ($journal->documentRequirements()->count() === 0) {
                $requirements = [
                    [
                        'document_type' => 'manuscript',
                        'label' => 'Main Manuscript',
                        'is_required' => true,
                        'allowed_mimes' => 'pdf,doc,docx',
                        'max_size_mb' => 15,
                    ],
                    [
                        'document_type' => 'cover_letter',
                        'label' => 'Cover Letter',
                        'is_required' => true,
                        'allowed_mimes' => 'pdf,doc,docx',
                        'max_size_mb' => 5,
                    ],
                    [
                        'document_type' => 'declaration',
                        'label' => 'Declaration Form',
                        'is_required' => true,
                        'allowed_mimes' => 'pdf,doc,docx',
                        'max_size_mb' => 5,
                    ],
                    [
                        'document_type' => 'supplementary',
                        'label' => 'Supplementary Material',
                        'is_required' => false,
                        'allowed_mimes' => 'pdf,doc,docx,zip,rar',
                        'max_size_mb' => 20,
                    ],
                ];

                foreach ($requirements as $req) {
                    $journal->documentRequirements()->create($req);
                }
            }
        }
    }
}
