<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use App\Models\ConferenceProceeding;
use App\Models\ConferenceCommittee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConferenceManagementController extends Controller
{
    public function index()
    {
        $conferences = Conference::where('editor_id', Auth::id())->get();
        return Inertia::render('Management/Conference/List', ['conferences' => $conferences]);
    }

    public function create()
    {
        return Inertia::render('Management/Conference/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'conference_title' => 'required',
            'university_name' => 'required',
            'conference_details' => 'nullable',
            'aim_scope' => 'nullable',
            'mission' => 'nullable',
            'cover_image' => 'nullable|image',
            'university_logo' => 'nullable|image',
        ]);

        $data['editor_id'] = Auth::id();
        $data['department_id'] = Auth::user()->department_id;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }
        if ($request->hasFile('university_logo')) {
            $data['university_logo'] = $request->file('university_logo')->store('logos', 'public');
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
        ]);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }
        if ($request->hasFile('university_logo')) {
            $data['university_logo'] = $request->file('university_logo')->store('logos', 'public');
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

    public function manageProceedings(Conference $conference)
    {
        $this->authorizeEditor($conference);
        return Inertia::render('Management/Conference/Proceedings', [
            'conference' => $conference,
            'proceedings' => $conference->proceedings()->orderBy('year', 'desc')->get()
        ]);
    }

    public function storeProceeding(Request $request, Conference $conference)
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

    private function authorizeEditor(Conference $conference)
    {
        if ($conference->editor_id !== Auth::id()) abort(403);
    }
}
