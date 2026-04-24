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
        $journals = Journal::where('editor_id', Auth::id())->get();
        return Inertia::render('Management/Journal/List', [
            'journals' => $journals
        ]);
    }

    public function create()
    {
        return Inertia::render('Management/Journal/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'journal_title' => 'required',
            'university_name' => 'required',
            'journal_details' => 'nullable',
            'aim_scope' => 'nullable',
            'mission' => 'nullable',
            'cover_image' => 'nullable|image',
            'university_logo' => 'nullable|image',
        ]);

        $data['editor_id'] = Auth::id();
        $data['department_id'] = Auth::user()->department_id;
        $data['status'] = 'pending';

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = '/storage/' . $request->file('cover_image')->store('covers', 'public');
        }

        if ($request->hasFile('university_logo')) {
            $data['university_logo'] = '/storage/' . $request->file('university_logo')->store('logos', 'public');
        }

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
        ]);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = '/storage/' . $request->file('cover_image')->store('covers', 'public');
        }

        if ($request->hasFile('university_logo')) {
            $data['university_logo'] = '/storage/' . $request->file('university_logo')->store('logos', 'public');
        }

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
            'is_current_issue' => 'boolean',
            'cover_image' => 'nullable|image',
            'pdf_link' => 'nullable|file|mimes:pdf',
        ]);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = '/storage/' . $request->file('cover_image')->store('issue_covers', 'public');
        }

        if ($request->hasFile('pdf_link')) {
            $data['pdf_link'] = '/storage/' . $request->file('pdf_link')->store('issue_pdfs', 'public');
        }

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
            'year' => 'required|integer',
            'pdf' => 'required|file|mimes:pdf',
        ]);

        if ($request->hasFile('pdf')) {
            $data['pdf'] = '/storage/' . $request->file('pdf')->store('articles', 'public');
        }

        $issue->articles()->create($data);
        return back();
    }

    private function authorizeEditor(Journal $journal)
    {
        if ($journal->editor_id !== Auth::id()) {
            abort(403);
        }
    }
}
