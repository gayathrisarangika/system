<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('editorial_board', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained('journals')->onDelete('cascade');
            $table->string('name');
            $table->string('affiliation')->nullable();
            $table->string('role')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('editorial_board');
    }
};
