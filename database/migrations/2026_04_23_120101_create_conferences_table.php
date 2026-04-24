<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('editor_id')->constrained('users');
            $table->foreignId('department_id')->constrained('departments');
            $table->string('conference_title');
            $table->string('university_name');
            $table->text('conference_details')->nullable();
            $table->text('aim_scope')->nullable();
            $table->text('mission')->nullable();
            $table->string('university_logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('status')->default('pending'); // pending, approved
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('conferences');
    }
};
