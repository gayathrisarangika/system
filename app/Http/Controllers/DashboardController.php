<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\Conference;
use App\Models\Symposium;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function admin()
    {
        if (Auth::user()->role !== 'admin') abort(403);

        return Inertia::render('Dashboard/Admin', [
            'pendingJournals' => Journal::where('status', 'pending')->with('department')->get(),
            'pendingConferences' => Conference::where('status', 'pending')->with('department')->get(),
            'pendingSymposiums' => Symposium::where('status', 'pending')->with('department')->get(),
        ]);
    }

    public function editor(Request $request)
    {
        $type = $request->segment(2); // journal, conference, or symposium
        
        return Inertia::render('Dashboard/Editor', [
            'type' => $type,
            'user' => Auth::user()->load('department'),
        ]);
    }

    public function approveJournal(Journal $journal)
    {
        if (Auth::user()->role !== 'admin') abort(403);
        $journal->update(['status' => 'approved']);
        return back();
    }

    public function approveConference(Conference $conference)
    {
        if (Auth::user()->role !== 'admin') abort(403);
        $conference->update(['status' => 'approved']);
        return back();
    }

    public function approveSymposium(Symposium $symposium)
    {
        if (Auth::user()->role !== 'admin') abort(403);
        $symposium->update(['status' => 'approved']);
        return back();
    }
}
