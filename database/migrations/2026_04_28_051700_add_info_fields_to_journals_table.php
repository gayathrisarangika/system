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
            $table->text('for_authors')->nullable();
            $table->text('for_reviewers')->nullable();
            $table->text('editorial_policies')->nullable();
            $table->text('contact_us')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('journals', function (Blueprint $table) {
            $table->dropColumn(['for_authors', 'for_reviewers', 'editorial_policies', 'contact_us']);
        });
    }
};
