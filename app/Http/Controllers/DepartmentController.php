<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $dept_id = $request->query('id');
        $type = $request->query('type', 'journal');

        $department = Department::findOrFail($dept_id);

        return Inertia::render('DepartmentPortal', [
            'department' => $department,
            'type' => $type,
        ]);
    }
}
