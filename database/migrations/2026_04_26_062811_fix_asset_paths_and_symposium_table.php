<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update Journals
        DB::table('journals')->where('id', 1)->update([
            'cover_image' => '/storage/issue_covers/sljssh-1(1)-cover-page.jpg',
            'university_logo' => '/storage/logos/download.png',
        ]);

        // Update Issues
        DB::table('issues')->where('id', 1)->update([
            'cover_image' => '/storage/issue_covers/sljssh-1(1)-cover-page.jpg',
            'pdf_link' => '/storage/articles/sljssh-1(1)-february-2021.pdf',
        ]);

        // Update Articles
        DB::table('articles')->where('id', 1)->update(['pdf' => '/storage/articles/sljssh-1(1)-february-2021.pdf']);
        DB::table('articles')->where('id', 2)->update(['pdf' => '/storage/articles/sljssh-1(1)-february-2021.pdf']);
        DB::table('articles')->where('id', 3)->update(['pdf' => '/storage/articles/sljssh-1(1)-february-2021.pdf']);

        // Update Conferences
        DB::table('conferences')->where('id', 1)->update([
            'cover_image' => '/storage/proceedings_covers/SASAS-rev-05.png',
            'university_logo' => '/storage/logos/download.png',
        ]);

        // Update Conference Proceedings
        DB::table('conference_proceedings')->where('id', 1)->update([
            'cover_image' => '/storage/proceedings_covers/SASAS-rev-05.png',
            'pdf_link' => '/storage/proceedings_pdfs/10th_SSLSAS_2024_Abstract_Book (1).pdf',
        ]);

        // Update Symposiums
        DB::table('symposiums')->where('id', 1)->update([
            'cover_image' => '/storage/proceedings_covers/SASAS-rev-05.png',
            'university_logo' => '/storage/logos/download.png',
        ]);

        // Update Symposium Proceedings
        DB::table('symposium_proceedings')->where('id', 1)->update([
            'cover_image' => '/storage/proceedings_covers/SASAS-rev-05.png',
            'pdf_link' => '/storage/proceedings_pdfs/10th_SSLSAS_2024_Abstract_Book (1).pdf',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse as these are initial data fixes
    }
};
