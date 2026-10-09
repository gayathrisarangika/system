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
        Schema::create('journal_submission_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained('journals')->onDelete('cascade');
            $table->string('code', 10)->unique();
            $table->boolean('is_open')->default(false);
            $table->dateTime('opening_datetime')->nullable();
            $table->dateTime('closing_datetime')->nullable();
            $table->timestamps();
        });

        Schema::create('journal_document_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained('journals')->onDelete('cascade');
            $table->string('document_type'); // e.g. manuscript, cover_letter, declaration, supplementary
            $table->string('label');
            $table->boolean('is_required')->default(true);
            $table->string('allowed_mimes')->default('pdf,doc,docx');
            $table->integer('max_size_mb')->default(10);
            $table->timestamps();
        });

        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->string('paper_id')->unique();
            $table->foreignId('journal_id')->constrained('journals')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // submitting author user
            $table->text('title');
            $table->text('abstract');
            $table->text('keywords')->nullable();
            $table->string('status')->default('Submitted');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('submission_authors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('submissions')->onDelete('cascade');
            $table->string('full_name');
            $table->string('email');
            $table->string('affiliation');
            $table->string('designation')->nullable();
            $table->boolean('is_corresponding')->default(false);
            $table->integer('order')->default(1);
            $table->timestamps();
        });

        Schema::create('submission_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('submissions')->onDelete('cascade');
            $table->string('document_type');
            $table->string('original_filename');
            $table->string('file_path');
            $table->bigInteger('file_size');
            $table->string('mime_type')->nullable();
            $table->timestamps();
        });

        Schema::create('submission_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('submissions')->onDelete('cascade');
            $table->string('status');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_status_histories');
        Schema::dropIfExists('submission_files');
        Schema::dropIfExists('submission_authors');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('journal_document_requirements');
        Schema::dropIfExists('journal_submission_settings');
    }
};
