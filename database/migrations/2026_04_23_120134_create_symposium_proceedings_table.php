<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('symposium_proceedings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('symposium_id')->constrained('symposiums')->onDelete('cascade');
            $table->integer('year');
            $table->string('version')->nullable();
            $table->string('pdf_link')->nullable();
            $table->string('cover_image')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('symposium_proceedings');
    }
};
