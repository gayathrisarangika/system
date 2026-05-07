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
        $journals = Journal::all();
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
            'for_authors' => 'nullable|file|mimes:pdf',
            'for_reviewers' => 'nullable|file|mimes:pdf',
            'editorial_policies' => 'nullable|file|mimes:pdf',
            'contact_us' => 'nullable',
            'cover_image' => 'nullable|image',
            'university_logo' => 'nullable|image',
        ]);

        $data['editor_id'] = Auth::id();
        $data['department_id'] = Auth::user()->department_id;
        $data['status'] = 'pending';

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        if ($request->hasFile('university_logo')) {
            $data['university_logo'] = $request->file('university_logo')->store('logos', 'public');
        }

        if ($request->hasFile('for_authors')) {
            $data['for_authors'] = $request->file('for_authors')->store('guidelines', 'public');
        }
        if ($request->hasFile('for_reviewers')) {
            $data['for_reviewers'] = $request->file('for_reviewers')->store('guidelines', 'public');
        }
        if ($request->hasFile('editorial_policies')) {
            $data['editorial_policies'] = $request->file('editorial_policies')->store('policies', 'public');
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
            'issn' => 'nullable',
            'online_issn' => 'nullable',
            'for_authors' => 'nullable|file|mimes:pdf',
            'for_reviewers' => 'nullable|file|mimes:pdf',
            'editorial_policies' => 'nullable|file|mimes:pdf',
            'contact_us' => 'nullable',
            'cover_image' => 'nullable|image',
            'university_logo' => 'nullable|image',
        ]);

        // Remove file fields from data if they are not uploaded as files, 
        // to prevent overwriting existing paths with null.
        $fileFields = ['cover_image', 'university_logo', 'for_authors', 'for_reviewers', 'editorial_policies'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $folder = match($field) {
                    'cover_image' => 'covers',
                    'university_logo' => 'logos',
                    'for_authors', 'for_reviewers' => 'guidelines',
                    'editorial_policies' => 'policies',
                    default => 'uploads'
                };
                $data[$field] = $request->file($field)->store($folder, 'public');
            } else {
                unset($data[$field]);
            }
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
            'published_date' => 'nullable|date',
            'is_current_issue' => 'boolean',
            'cover_image' => 'nullable|image',
            'pdf_link' => 'nullable|file|mimes:pdf',
        ]);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('issue_covers', 'public');
        }

        if ($request->hasFile('pdf_link')) {
            $data['pdf_link'] = $request->file('pdf_link')->store('issue_pdfs', 'public');
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
            'doi' => 'nullable',
            'published_date' => 'nullable|date',
            'pages' => 'nullable',
            'year' => 'required|integer',
            'pdf' => 'required|file|mimes:pdf',
        ]);

        if ($request->hasFile('pdf')) {
            $data['pdf'] = $request->file('pdf')->store('articles', 'public');
        }

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
            'pdf' => 'nullable|file|mimes:pdf',
        ]);

        if ($request->hasFile('pdf')) {
            $data['pdf'] = $request->file('pdf')->store('articles', 'public');
        } else {
            unset($data['pdf']);
        }

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
