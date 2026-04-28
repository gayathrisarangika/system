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
        $this->assertEquals('/storage/logos/test.png', $journal->university_logo);

        // Case 2: Prefixed path (legacy with slash)
        $journal->university_logo = '/storage/logos/test.png';
        $this->assertEquals('/storage/logos/test.png', $journal->university_logo);

        // Case 2.1: Prefixed path (legacy without leading slash)
        $journal->university_logo = 'storage/logos/test.png';
        $this->assertEquals('/storage/logos/test.png', $journal->university_logo);

        // Case 3: Full URL
        $journal->university_logo = 'http://example.com/logo.png';
        $this->assertEquals('http://example.com/logo.png', $journal->university_logo);
    }

    public function test_article_pdf_accessor()
    {
        $article = new Article();

        $article->pdf = 'articles/test.pdf';
        $this->assertEquals('/storage/articles/test.pdf', $article->pdf);

        $article->pdf = '/storage/articles/test.pdf';
        $this->assertEquals('/storage/articles/test.pdf', $article->pdf);
    }
}
