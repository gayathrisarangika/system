<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Journal;
use App\Models\Conference;
use App\Models\Symposium;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        return Inertia::render('Home', [
            'journals' => Journal::where('status', 'approved')->get(),
            'conferences' => Conference::where('status', 'approved')->get(),
            'symposiums' => Symposium::where('status', 'approved')->get(),
        ]);
    }

    public function journal(Journal $journal)
    {
        $this->authorizeView($journal);

        $journal->load(['issues' => function ($query) {
            $query->orderBy('year', 'desc')->take(10);
        }]);

        return Inertia::render('Publications/Journal', [
            'journal' => $journal,
        ]);
    }

    public function conference(Conference $conference)
    {
        $this->authorizeView($conference);

        $conference->load(['proceedings' => function ($query) {
            $query->orderBy('year', 'desc')->take(10);
        }]);

        return Inertia::render('Publications/Conference', [
            'conference' => $conference,
        ]);
    }

    public function symposium(Symposium $symposium)
    {
        $this->authorizeView($symposium);

        $symposium->load(['proceedings' => function ($query) {
            $query->orderBy('year', 'desc')->take(10);
        }]);

        return Inertia::render('Publications/Symposium', [
            'symposium' => $symposium,
        ]);
    }

    public function editorialBoard(Journal $journal)
    {
        $this->authorizeView($journal);

        return Inertia::render('Publications/EditorialBoard', [
            'journal' => $journal->load('editorialBoard'),
        ]);
    }

    public function journalCurrent(Journal $journal)
    {
        $this->authorizeView($journal);

        $latestIssue = $journal->issues()->orderBy('year', 'desc')->orderBy('volume', 'desc')->orderBy('issue', 'desc')->first();

        return Inertia::render('Publications/Archive', [
            'journal' => $journal->load(['issues' => function($q) use ($latestIssue) {
                if ($latestIssue) {
                    $q->where('id', $latestIssue->id)->with('articles');
                } else {
                    $q->with('articles');
                }
            }]),
            'is_current' => true,
        ]);
    }

    public function journalArchive(Journal $journal)
    {
        $this->authorizeView($journal);

        return Inertia::render('Publications/Archive', [
            'journal' => $journal->load('issues.articles'),
            'is_current' => false,
        ]);
    }

    public function journalContact(Journal $journal)
    {
        $this->authorizeView($journal);

        return Inertia::render('Publications/ContactUs', [
            'journal' => $journal,
        ]);
    }

    public function article(Article $article)
    {
        $article->load('issue.journal');
        $this->authorizeView($article->issue->journal);

        $article->increment('views');

        return Inertia::render('Publications/Article', [
            'article' => $article,
            'journal' => $article->issue->journal,
        ]);
    }

    public function downloadArticle(Article $article)
    {
        $this->authorizeView($article->issue->journal);
        $article->increment('downloads');
        return response()->download(storage_path('app/public/' . $article->pdf));
    }

    public function downloadIssue(\App\Models\Issue $issue)
    {
        $this->authorizeView($issue->journal);
        return response()->download(storage_path('app/public/' . $issue->pdf_link));
    }

    private function authorizeView($model)
    {
        if ($model->status === 'approved') {
            return;
        }

        if (Auth::check()) {
            $user = Auth::user();
            if ($user->role === 'admin' || $user->id === $model->editor_id) {
                return;
            }
        }

        abort(403, 'This publication is not yet approved.');
    }
}
