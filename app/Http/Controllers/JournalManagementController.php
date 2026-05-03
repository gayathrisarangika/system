<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\Issue;
use App\Models\Article;
use App\Models\EditorialBoard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JournalManagementController extends Controller
{
    public function index()
    {
        $journals = Journal::where('department_id', Auth::user()->department_id)->get();
        return Inertia::render('Management/Journal/List', [
            'journals' => $journals
        ]);
    }

    public function create()
    {
        return Inertia::render('Management/Journal/Form', [
            'pre_filled_title' => Auth::user()->journal_title
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'journal_title' => 'required',
            'university_name' => 'required',
            'journal_details' => 'nullable',
            'aim_scope' => 'nullable',
            'mission' => 'nullable',
            'issn' => 'nullable',
            'online_issn' => 'nullable',
            'contact_us' => 'nullable',
        ]);

        $data['editor_id'] = Auth::id();
        $data['department_id'] = Auth::user()->department_id;
        $data['status'] = 'pending';

        Journal::create($data);

        return redirect()->route('journal.index');
    }

    public function edit(Journal $journal)
    {
        $this->authorizeEditor($journal);
        return Inertia::render('Management/Journal/Form', ['journal' => $journal]);
    }

    public function update(Request $request, Journal $journal)
    {
        $this->authorizeEditor($journal);
        
        $data = $request->validate([
            'journal_title' => 'required',
            'university_name' => 'required',
            'journal_details' => 'nullable',
            'aim_scope' => 'nullable',
            'mission' => 'nullable',
            'issn' => 'nullable',
            'online_issn' => 'nullable',
            'contact_us' => 'nullable',
        ]);

        $journal->update($data);

        return redirect()->route('journal.index');
    }

    public function manageBoard(Journal $journal)
    {
        $this->authorizeEditor($journal);
        return Inertia::render('Management/Journal/EditorialBoard', [
            'journal' => $journal,
            'members' => $journal->editorialBoard
        ]);
    }

    public function storeBoardMember(Request $request, Journal $journal)
    {
        $this->authorizeEditor($journal);
        $data = $request->validate([
            'name' => 'required',
            'affiliation' => 'nullable',
            'role' => 'nullable',
        ]);
        $journal->editorialBoard()->create($data);
        return back();
    }

    public function deleteBoardMember(EditorialBoard $member)
    {
        $this->authorizeEditor($member->journal);
        $member->delete();
        return back();
    }

    public function manageIssues(Journal $journal)
    {
        $this->authorizeEditor($journal);
        return Inertia::render('Management/Journal/Issues', [
            'journal' => $journal,
            'issues' => $journal->issues()->orderBy('year', 'desc')->get()
        ]);
    }

    public function storeIssue(Request $request, Journal $journal)
    {
        $this->authorizeEditor($journal);
        $data = $request->validate([
            'volume' => 'required|integer',
            'issue' => 'required|integer',
            'year' => 'required|integer',
            'published_date' => 'nullable|date',
            'is_current_issue' => 'boolean',
        ]);

        $journal->issues()->create($data);
        return back();
    }

    public function manageArticles(Issue $issue)
    {
        $this->authorizeEditor($issue->journal);
        return Inertia::render('Management/Journal/Articles', [
            'issue' => $issue,
            'articles' => $issue->articles
        ]);
    }

    public function storeArticle(Request $request, Issue $issue)
    {
        $this->authorizeEditor($issue->journal);
        $data = $request->validate([
            'title' => 'required',
            'author' => 'required',
            'abstract' => 'required',
            'keywords' => 'nullable',
            'doi' => 'nullable',
            'published_date' => 'nullable|date',
            'pages' => 'nullable',
            'year' => 'required|integer',
        ]);

        $issue->articles()->create($data);
        return back();
    }

    public function updateArticle(Request $request, Article $article)
    {
        $this->authorizeEditor($article->issue->journal);
        $data = $request->validate([
            'title' => 'required',
            'author' => 'required',
            'abstract' => 'required',
            'keywords' => 'nullable',
            'doi' => 'nullable',
            'published_date' => 'nullable|date',
            'pages' => 'nullable',
            'year' => 'required|integer',
        ]);

        $article->update($data);
        return back();
    }

    private function authorizeEditor(Journal $journal)
    {
        if (Auth::user()->role === 'admin') return;

        if ($journal->department_id !== Auth::user()->department_id) {
            abort(403);
        }
    }
}
