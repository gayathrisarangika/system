<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use App\Models\ConferenceProceeding;
use App\Models\ConferenceCommittee;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConferenceManagementController extends Controller
{
    public function index()
    {
        $conferences = Conference::all();
        return Inertia::render('Management/Conference/List', ['conferences' => $conferences]);
    }

    public function create()
    {
        return Inertia::render('Management/Conference/Form', [
            'pre_filled_title' => Auth::user()->conference_title
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'conference_title' => 'required',
            'university_name' => 'required',
            'conference_details' => 'nullable',
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

        Conference::create($data);
        return redirect()->route('conference.index');
    }

    public function edit(Conference $conference)
    {
        $this->authorizeEditor($conference);
        return Inertia::render('Management/Conference/Form', ['conference' => $conference]);
    }

    public function update(Request $request, Conference $conference)
    {
        $this->authorizeEditor($conference);
        $data = $request->validate([
            'conference_title' => 'required',
            'university_name' => 'required',
            'conference_details' => 'nullable',
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

        $conference->update($data);
        return redirect()->route('conference.index');
    }

    public function manageCommittee(Conference $conference)
    {
        $this->authorizeEditor($conference);
        return Inertia::render('Management/Conference/Committee', [
            'conference' => $conference,
            'members' => $conference->committee
        ]);
    }

    public function storeCommitteeMember(Request $request, Conference $conference)
    {
        $this->authorizeEditor($conference);
        $data = $request->validate([
            'name' => 'required',
            'affiliation' => 'nullable',
            'role' => 'nullable',
        ]);
        $conference->committee()->create($data);
        return back();
    }

    public function manageAbstractBooks(Conference $conference)
    {
        $this->authorizeEditor($conference);
        return Inertia::render('Management/Conference/AbstractBooks', [
            'conference' => $conference,
            'abstractBooks' => $conference->proceedings()->orderBy('year', 'desc')->get()
        ]);
    }

    public function storeAbstractBook(Request $request, Conference $conference)
    {
        $this->authorizeEditor($conference);
        $data = $request->validate([
            'year' => 'required|integer',
            'version' => 'required',
            'pdf_link' => 'required|file|mimes:pdf',
            'cover_image' => 'nullable|image',
        ]);

        if ($request->hasFile('pdf_link')) {
            $data['pdf_link'] = $request->file('pdf_link')->store('proceedings_pdfs', 'public');
        }
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('proceedings_covers', 'public');
        }

        $conference->proceedings()->create($data);
        return back();
    }

    public function deleteAbstractBook(ConferenceProceeding $proceeding)
    {
        $this->authorizeEditor($proceeding->conference);
        $proceeding->delete();
        return back();
    }

    public function manageArticles(ConferenceProceeding $proceeding)
    {
        $this->authorizeEditor($proceeding->conference);
        return Inertia::render('Management/Conference/Articles', [
            'abstractBook' => $proceeding,
            'articles' => Article::where('conference_proceeding_id', $proceeding->id)->get()
        ]);
    }

    public function storeArticle(Request $request, ConferenceProceeding $proceeding)
    {
        $this->authorizeEditor($proceeding->conference);
        $data = $request->validate([
            'title' => 'required',
            'author' => 'required',
            'abstract' => 'required',
            'keywords' => 'nullable',
            'year' => 'required|integer',
            'pdf' => 'required|file|mimes:pdf',
        ]);

        if ($request->hasFile('pdf')) {
            $data['pdf'] = $request->file('pdf')->store('articles', 'public');
        }

        $data['conference_proceeding_id'] = $proceeding->id;
        Article::create($data);
        return back();
    }

    public function updateArticle(Request $request, Article $article)
    {
        $this->authorizeEditor($article->conferenceProceeding->conference);
        $data = $request->validate([
            'title' => 'required',
            'author' => 'required',
            'abstract' => 'required',
            'keywords' => 'nullable',
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

    private function authorizeEditor(Conference $conference)
    {
        if (Auth::user()->role === 'admin') return;

        if ($conference->id != Auth::user()->publication_id || Auth::user()->type !== 'conference') {
            abort(403);
        }
    }
}
