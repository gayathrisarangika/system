<?php

use App\Models\User;
use App\Models\Department;
use App\Models\ConferenceName;
use App\Models\SymposiumName;
use App\Models\Journal;
use App\Models\Conference;
use App\Models\Symposium;
use Illuminate\Support\Facades\Hash;

$dept = Department::create(['name' => 'Department of Computing']);
$confName = ConferenceName::create(['name' => 'International Conference on AI']);
$sympName = SymposiumName::create(['name' => 'National Symposium on Robotics']);

$admin = User::create([
    'name' => 'Admin User',
    'username' => 'admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('admin123'),
    'role' => 'admin',
]);

Journal::create([
    'journal_title' => 'International Journal of AI Research',
    'university_name' => 'Sabaragamuwa University of Sri Lanka',
    'department_id' => $dept->id,
    'journal_details' => 'Leading journal in Artificial Intelligence.',
    'status' => 'approved',
    'editor_id' => $admin->id
]);

Conference::create([
    'conference_title' => 'Global AI Conference 2025',
    'university_name' => 'Sabaragamuwa University of Sri Lanka',
    'department_id' => null,
    'conference_details' => 'A global conference on AI.',
    'status' => 'approved',
    'editor_id' => $admin->id
]);

Symposium::create([
    'symposium_title' => 'Robotics Symposium 2025',
    'university_name' => 'Sabaragamuwa University of Sri Lanka',
    'department_id' => null,
    'symposium_details' => 'Symposium for robotics enthusiasts.',
    'status' => 'approved',
    'editor_id' => $admin->id
]);
