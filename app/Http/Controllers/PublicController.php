<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Journal;
use App\Models\Conference;
use App\Models\Symposium;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        $departments = Department::all();
        return Inertia::render('Home', [
            'departments' => $departments
        ]);
    }

    public function journal(Journal $journal)
    {
        $journal->load(['issues' => function ($query) {
            $query->orderBy('year', 'desc')->take(10);
        }]);

        return Inertia::render('Publications/Journal', [
            'journal' => $journal,
        ]);
    }

    public function conference(Conference $conference)
    {
        $conference->load(['proceedings' => function ($query) {
            $query->orderBy('year', 'desc')->take(10);
        }]);

        return Inertia::render('Publications/Conference', [
            'conference' => $conference,
        ]);
    }

    public function symposium(Symposium $symposium)
    {
        $symposium->load(['proceedings' => function ($query) {
            $query->orderBy('year', 'desc')->take(10);
        }]);

        return Inertia::render('Publications/Symposium', [
            'symposium' => $symposium,
        ]);
    }

    public function editorialBoard(Journal $journal)
    {
        return Inertia::render('Publications/EditorialBoard', [
            'journal' => $journal->load('editorialBoard'),
        ]);
    }

    public function journalArchive(Journal $journal)
    {
        return Inertia::render('Publications/Archive', [
            'journal' => $journal->load('issues.articles'),
        ]);
    }
}
