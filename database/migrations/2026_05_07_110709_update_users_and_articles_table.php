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
        Schema::table('users', function (Blueprint $table) {
            $table->string('type')->nullable(); // journal, conference, symposium
            $table->unsignedBigInteger('publication_id')->nullable();
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->unsignedBigInteger('issue_id')->nullable()->change();
            $table->foreignId('conference_proceeding_id')->nullable()->constrained('conference_proceedings')->onDelete('cascade');
            $table->foreignId('symposium_proceeding_id')->nullable()->constrained('symposium_proceedings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['type', 'publication_id']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['conference_proceeding_id']);
            $table->dropForeign(['symposium_proceeding_id']);
            $table->dropColumn(['conference_proceeding_id', 'symposium_proceeding_id']);
            $table->unsignedBigInteger('issue_id')->nullable(false)->change();
        });
    }
};
