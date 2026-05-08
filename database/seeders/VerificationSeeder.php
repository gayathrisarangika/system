<?php

use App\Models\User;
use App\Models\Department;
use App\Models\ConferenceName;
use App\Models\SymposiumName;
use Illuminate\Support\Facades\Hash;

Department::create(['name' => 'Department of Computing']);
ConferenceName::create(['name' => 'International Conference on AI']);
SymposiumName::create(['name' => 'National Symposium on Robotics']);

User::create([
    'name' => 'Admin User',
    'username' => 'admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('admin123'),
    'role' => 'admin',
]);
