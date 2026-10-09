<?php

namespace App\Services;

use App\Models\Journal;
use App\Models\Submission;
use Illuminate\Support\Facades\DB;

class PaperIdGeneratorService
{
    /**
     * Generate an atomic unique Paper ID in the format: [JOURNAL_CODE]-[YEAR]-[SEQUENTIAL_NUMBER]
     * e.g., ECO-2026-0001
     *
     * @param Journal $journal
     * @return string
     */
    public function generate(Journal $journal): string
    {
        return DB::transaction(function () use ($journal) {
            $setting = $journal->submissionSetting;
            $code = $setting ? strtoupper($setting->code) : 'JRN';
            $year = date('Y');

            $prefix = "{$code}-{$year}-";

            // Find the highest sequential number for this journal code and year
            $latestSubmission = Submission::where('paper_id', 'LIKE', "{$prefix}%")
                ->lockForUpdate()
                ->orderBy('id', 'desc')
                ->first();

            if ($latestSubmission) {
                // Extract last 4 digits
                $parts = explode('-', $latestSubmission->paper_id);
                $lastSeq = (int) end($parts);
                $nextSeq = $lastSeq + 1;
            } else {
                $nextSeq = 1;
            }

            $formattedSeq = str_pad($nextSeq, 4, '0', STR_PAD_LEFT);

            return "{$prefix}{$formattedSeq}";
        });
    }
}
