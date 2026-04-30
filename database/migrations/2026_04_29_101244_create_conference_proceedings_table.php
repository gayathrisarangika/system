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
        Schema::create('conference_proceedings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conference_id')->constrained('conferences')->onDelete('cascade');
            $table->integer('year');
            $table->string('version')->nullable();
            $table->string('pdf_link')->nullable();
            $table->string('cover_image')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('conference_proceedings');
    }
};
