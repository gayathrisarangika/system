<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained('journals')->onDelete('cascade');
            $table->integer('volume');
            $table->integer('issue');
            $table->integer('year');
            $table->string('cover_image')->nullable();
            $table->string('pdf_link')->nullable();
            $table->boolean('is_current_issue')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('issues');
    }
};
