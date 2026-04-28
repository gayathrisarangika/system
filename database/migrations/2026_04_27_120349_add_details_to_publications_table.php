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
            $table->string('issn')->nullable();
            $table->string('online_issn')->nullable();
        });

        Schema::table('issues', function (Blueprint $table) {
            $table->date('published_date')->nullable();
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->string('doi')->nullable();
            $table->date('published_date')->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('downloads')->default(0);
            $table->string('pages')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('journals', function (Blueprint $table) {
            $table->dropColumn(['issn', 'online_issn']);
        });

        Schema::table('issues', function (Blueprint $table) {
            $table->dropColumn('published_date');
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['doi', 'published_date', 'views', 'downloads', 'pages']);
        });
    }
};
