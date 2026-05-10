<?php

namespace App\Http\Controllers;

use App\Models\Symposium;
use App\Models\SymposiumProceeding;
use App\Models\SymposiumCommittee;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SymposiumManagementController extends Controller
{
    public function index()
    {
        $symposiums = Symposium::all();
        return Inertia::render('Management/Symposium/List', ['symposiums' => $symposiums]);
    }

    public function create()
    {
        return Inertia::render('Management/Symposium/Form', [
            'pre_filled_title' => Auth::user()->symposium_title
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'symposium_title' => 'required',
            'university_name' => 'required',
            'symposium_details' => 'nullable',
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

        Symposium::create($data);
        return redirect()->route('symposium.index');
    }

    public function edit(Symposium $symposium)
    {
        $this->authorizeEditor($symposium);
        return Inertia::render('Management/Symposium/Form', ['symposium' => $symposium]);
    }

    public function update(Request $request, Symposium $symposium)
    {
        $this->authorizeEditor($symposium);
        $data = $request->validate([
            'symposium_title' => 'required',
            'university_name' => 'required',
            'symposium_details' => 'nullable',
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

        $symposium->update($data);
        return redirect()->route('symposium.index');
    }

    public function manageCommittee(Symposium $symposium)
    {
        $this->authorizeEditor($symposium);
        return Inertia::render('Management/Symposium/Committee', [
            'symposium' => $symposium,
            'members' => $symposium->committee
        ]);
    }

    public function storeCommitteeMember(Request $request, Symposium $symposium)
    {
        $this->authorizeEditor($symposium);
        $data = $request->validate([
            'name' => 'required',
            'affiliation' => 'nullable',
            'role' => 'nullable',
        ]);
        $symposium->committee()->create($data);
        return back();
    }

    public function deleteCommitteeMember(SymposiumCommittee $member)
    {
        $this->authorizeEditor($member->symposium);
        $member->delete();
        return back();
    }

    public function manageAbstractBooks(Symposium $symposium)
    {
        $this->authorizeEditor($symposium);
        return Inertia::render('Management/Symposium/AbstractBooks', [
            'symposium' => $symposium,
            'abstractBooks' => $symposium->proceedings()->orderBy('year', 'desc')->get()
        ]);
    }

    public function storeAbstractBook(Request $request, Symposium $symposium)
    {
        $this->authorizeEditor($symposium);
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

        $symposium->proceedings()->create($data);
        return back();
    }

    public function deleteAbstractBook(SymposiumProceeding $proceeding)
    {
        $this->authorizeEditor($proceeding->symposium);
        $proceeding->delete();
        return back();
    }

    public function manageArticles(SymposiumProceeding $proceeding)
    {
        $this->authorizeEditor($proceeding->symposium);
        return Inertia::render('Management/Symposium/Articles', [
            'abstractBook' => $proceeding,
            'articles' => Article::where('symposium_proceeding_id', $proceeding->id)->get()
        ]);
    }

    public function storeArticle(Request $request, SymposiumProceeding $proceeding)
    {
        $this->authorizeEditor($proceeding->symposium);
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

        $data['symposium_proceeding_id'] = $proceeding->id;
        Article::create($data);
        return back();
    }

    public function updateArticle(Request $request, Article $article)
    {
        $this->authorizeEditor($article->symposiumProceeding->symposium);
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

    private function authorizeEditor(Symposium $symposium)
    {
        if (Auth::user()->role === 'admin') return;

        if ($symposium->id != Auth::user()->publication_id || Auth::user()->type !== 'symposium') {
            abort(403);
        }
    }
}
