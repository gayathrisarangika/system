<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\Conference;
use App\Models\Symposium;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            'departments' => Department::all(),
            'users' => User::with('department')->get(),
        ]);
    }

    public function storeUser(Request $request)
    {
        if (Auth::user()->role !== 'admin') abort(403);

        $data = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|email|unique:users',
            'username' => 'required|unique:users',
            'password' => 'required|min:6',
            'department_id' => 'required|exists:departments,id',
            'role' => 'required|in:admin,editor',
            'journal_title' => 'nullable|string',
        ]);

        $data['password'] = Hash::make($data['password']);

        User::create($data);

        return back();
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

    public function rejectJournal(Journal $journal)
    {
        if (Auth::user()->role !== 'admin') abort(403);
        $journal->update(['status' => 'rejected']);
        return back();
    }

    public function approveConference(Conference $conference)
    {
        if (Auth::user()->role !== 'admin') abort(403);
        $conference->update(['status' => 'approved']);
        return back();
    }

    public function rejectConference(Conference $conference)
    {
        if (Auth::user()->role !== 'admin') abort(403);
        $conference->update(['status' => 'rejected']);
        return back();
    }

    public function approveSymposium(Symposium $symposium)
    {
        if (Auth::user()->role !== 'admin') abort(403);
        $symposium->update(['status' => 'approved']);
        return back();
    }

    public function rejectSymposium(Symposium $symposium)
    {
        if (Auth::user()->role !== 'admin') abort(403);
        $symposium->update(['status' => 'rejected']);
        return back();
    }
}
