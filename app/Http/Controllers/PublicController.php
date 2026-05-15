<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Journal;
use App\Models\Conference;
use App\Models\Symposium;
use App\Models\Article;
use App\Models\Issue;
use App\Models\ConferenceProceeding;
use App\Models\SymposiumProceeding;
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
            'recent_issues' => Issue::whereHas('journal', function($q) {
                    $q->where('status', 'approved');
                })->latest()->take(10)->with('journal')->get(),
            'recent_conference_proceedings' => ConferenceProceeding::whereHas('conference', function($q) {
                    $q->where('status', 'approved');
                })->latest()->take(10)->with('conference')->get(),
            'recent_symposium_proceedings' => SymposiumProceeding::whereHas('symposium', function($q) {
                    $q->where('status', 'approved');
                })->latest()->take(10)->with('symposium')->get(),
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

    public function conferenceCommittee(Conference $conference)
    {
        $this->authorizeView($conference);
        return Inertia::render('Publications/EditorialBoard', [
            'conference' => $conference->load('committee'),
        ]);
    }

    public function symposiumCommittee(Symposium $symposium)
    {
        $this->authorizeView($symposium);
        return Inertia::render('Publications/EditorialBoard', [
            'symposium' => $symposium->load('committee'),
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

    public function conferenceCurrent(Conference $conference)
    {
        $this->authorizeView($conference);
        $latestProceeding = $conference->proceedings()->orderBy('year', 'desc')->first();

        return Inertia::render('Publications/Archive', [
            'conference' => $conference->load(['proceedings' => function($q) use ($latestProceeding) {
                if ($latestProceeding) {
                    $q->where('id', $latestProceeding->id)->with('articles');
                } else {
                    $q->with('articles');
                }
            }]),
            'is_current' => true,
        ]);
    }

    public function symposiumCurrent(Symposium $symposium)
    {
        $this->authorizeView($symposium);
        $latestProceeding = $symposium->proceedings()->orderBy('year', 'desc')->first();

        return Inertia::render('Publications/Archive', [
            'symposium' => $symposium->load(['proceedings' => function($q) use ($latestProceeding) {
                if ($latestProceeding) {
                    $q->where('id', $latestProceeding->id)->with('articles');
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

    public function conferenceArchive(Conference $conference)
    {
        $this->authorizeView($conference);
        return Inertia::render('Publications/Archive', [
            'conference' => $conference->load('proceedings.articles'),
            'is_current' => false,
        ]);
    }

    public function symposiumArchive(Symposium $symposium)
    {
        $this->authorizeView($symposium);
        return Inertia::render('Publications/Archive', [
            'symposium' => $symposium->load('proceedings.articles'),
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

    public function conferenceContact(Conference $conference)
    {
        $this->authorizeView($conference);
        return Inertia::render('Publications/ContactUs', [
            'conference' => $conference,
        ]);
    }

    public function symposiumContact(Symposium $symposium)
    {
        $this->authorizeView($symposium);
        return Inertia::render('Publications/ContactUs', [
            'symposium' => $symposium,
        ]);
    }

    public function article(Article $article)
    {
        $publication = null;
        if ($article->issue_id) {
            $article->load('issue.journal');
            $publication = $article->issue->journal;
        } elseif ($article->conference_proceeding_id) {
            $article->load('conferenceProceeding.conference');
            $publication = $article->conferenceProceeding->conference;
        } elseif ($article->symposium_proceeding_id) {
            $article->load('symposiumProceeding.symposium');
            $publication = $article->symposiumProceeding->symposium;
        }

        if ($publication) {
            $this->authorizeView($publication);
        }

        $article->increment('views');

        return Inertia::render('Publications/Article', [
            'article' => $article,
            'journal' => $article->issue_id ? $publication : null,
            'conference' => $article->conference_proceeding_id ? $publication : null,
            'symposium' => $article->symposium_proceeding_id ? $publication : null,
        ]);
    }

    public function downloadArticle(Article $article)
    {
        $publication = null;
        if ($article->issue_id) {
            $publication = $article->issue->journal;
        } elseif ($article->conference_proceeding_id) {
            $publication = $article->conferenceProceeding->conference;
        } elseif ($article->symposium_proceeding_id) {
            $publication = $article->symposiumProceeding->symposium;
        }

        if ($publication) {
            $this->authorizeView($publication);
        }

        $article->increment('downloads');
        return response()->download(storage_path('app/public/' . $article->pdf));
    }

    public function downloadIssue(Issue $issue)
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
