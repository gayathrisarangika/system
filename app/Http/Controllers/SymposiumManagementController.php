<?php

namespace App\Http\Controllers;

use App\Models\Symposium;
use App\Models\SymposiumProceeding;
use App\Models\SymposiumCommittee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SymposiumManagementController extends Controller
{
    public function index()
    {
        $symposiums = Symposium::where('editor_id', Auth::id())->get();
        return Inertia::render('Management/Symposium/List', ['symposiums' => $symposiums]);
    }

    public function create()
    {
        return Inertia::render('Management/Symposium/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'symposium_title' => 'required',
            'university_name' => 'required',
            'symposium_details' => 'nullable',
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
        ]);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }
        if ($request->hasFile('university_logo')) {
            $data['university_logo'] = $request->file('university_logo')->store('logos', 'public');
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

    public function manageProceedings(Symposium $symposium)
    {
        $this->authorizeEditor($symposium);
        return Inertia::render('Management/Symposium/Proceedings', [
            'symposium' => $symposium,
            'proceedings' => $symposium->proceedings()->orderBy('year', 'desc')->get()
        ]);
    }

    public function storeProceeding(Request $request, Symposium $symposium)
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

    private function authorizeEditor(Symposium $symposium)
    {
        if ($symposium->editor_id !== Auth::id()) abort(403);
    }
}
