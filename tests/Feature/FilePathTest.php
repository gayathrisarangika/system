<?php

namespace Tests\Feature;

use App\Models\Journal;
use App\Models\Article;
use App\Models\Issue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FilePathTest extends TestCase
{
    use RefreshDatabase;

    public function test_journal_accessors()
    {
        $journal = new Journal();
        
        // Case 1: Relative path
        $journal->university_logo = 'logos/test.png';
        $this->assertStringContainsString('storage/logos/test.png', $journal->university_logo_url);
    }

    public function test_article_pdf_accessor()
    {
        $article = new Article();
        
        $article->pdf = 'articles/test.pdf';
        $this->assertStringContainsString('storage/articles/test.pdf', $article->pdf_url);
    }
}
