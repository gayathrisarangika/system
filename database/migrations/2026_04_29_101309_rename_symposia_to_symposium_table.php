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
        if (Schema::hasTable('symposia') && !Schema::hasTable('symposiums')) {
            Schema::rename('symposia', 'symposiums');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('symposiums') && !Schema::hasTable('symposia')) {
            Schema::rename('symposiums', 'symposia');
        }
    }
};
