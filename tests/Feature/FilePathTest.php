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
        $this->assertEquals('/storage/logos/test.png', $journal->university_logo_url);
        
        // Case 3: Full URL (The accessor doesn't handle full URLs specially, it just wraps them in Storage::url if not careful, 
        // but wait, Storage::url('http://...') might return something weird or just the URL. 
        // In our case, the accessor is Storage::disk('public')->url($this->university_logo).
    }

    public function test_article_pdf_accessor()
    {
        $article = new Article();
        
        $article->pdf = 'articles/test.pdf';
        $this->assertEquals('/storage/articles/test.pdf', $article->pdf_url);
    }
}
