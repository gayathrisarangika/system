<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('journals', function (Blueprint $table) {
            $table->dropColumn(['university_logo', 'cover_image', 'for_authors', 'for_reviewers', 'editorial_policies']);
        });

        Schema::table('conferences', function (Blueprint $table) {
            $table->dropColumn(['university_logo', 'cover_image']);
        });

        Schema::table('symposiums', function (Blueprint $table) {
            $table->dropColumn(['university_logo', 'cover_image']);
        });

        Schema::table('issues', function (Blueprint $table) {
            $table->dropColumn(['cover_image', 'pdf_link']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['pdf', 'views', 'downloads']);
        });

        Schema::table('conference_proceedings', function (Blueprint $table) {
            $table->dropColumn(['pdf_link', 'cover_image']);
        });

        Schema::table('symposium_proceedings', function (Blueprint $table) {
            $table->dropColumn(['pdf_link', 'cover_image']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No rollback supported as we are permanently removing these features per user request.
    }
};
