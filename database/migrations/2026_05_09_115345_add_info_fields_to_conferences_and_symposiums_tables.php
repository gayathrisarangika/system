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
        Schema::table('conferences', function (Blueprint $table) {
            $table->string('issn')->nullable();
            $table->string('online_issn')->nullable();
            $table->text('contact_us')->nullable();
            $table->string('for_authors')->nullable();
            $table->string('for_reviewers')->nullable();
            $table->string('editorial_policies')->nullable();
        });

        Schema::table('symposiums', function (Blueprint $table) {
            $table->string('issn')->nullable();
            $table->string('online_issn')->nullable();
            $table->text('contact_us')->nullable();
            $table->string('for_authors')->nullable();
            $table->string('for_reviewers')->nullable();
            $table->string('editorial_policies')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conferences', function (Blueprint $table) {
            $table->dropColumn(['issn', 'online_issn', 'contact_us', 'for_authors', 'for_reviewers', 'editorial_policies']);
        });

        Schema::table('symposiums', function (Blueprint $table) {
            $table->dropColumn(['issn', 'online_issn', 'contact_us', 'for_authors', 'for_reviewers', 'editorial_policies']);
        });
    }
};
