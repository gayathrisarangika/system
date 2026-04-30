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
        Schema::create('symposiums', function (Blueprint $table) {
            $table->id();
            $table->foreignId('editor_id')->constrained('users');
            $table->foreignId('department_id')->constrained('departments');
            $table->string('symposium_title');
            $table->string('university_name');
            $table->text('symposium_details')->nullable();
            $table->text('aim_scope')->nullable();
            $table->text('mission')->nullable();
            $table->string('university_logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('status')->default('pending'); // pending, approved
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('symposiums');
    }
};
