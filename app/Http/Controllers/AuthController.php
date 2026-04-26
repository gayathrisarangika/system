<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showBackendSelector()
    {
        return Inertia::render('Auth/BackendSelector', [
            'departments' => Department::all(),
        ]);
    }

    public function showLogin(Request $request)
    {
        return Inertia::render('Auth/Login', [
            'dept_id' => $request->query('id'),
            'type' => $request->query('type'),
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);

        $dept_id = $request->input('dept_id');
        $type = $request->input('type', 'journal');

        $user = User::where('username', $credentials['username'])->first();

        if ($user && Hash::check($credentials['password'], $user['password'])) {
            if ($user->role === 'admin' || $user->department_id == $dept_id) {
                Auth::login($user);
                $request->session()->regenerate();

                if ($user->role === 'admin') {
                    return redirect()->intended('/admin/dashboard');
                }

                return match ($type) {
                    'conference' => redirect()->intended('/editor/conference/dashboard'),
                    'symposium' => redirect()->intended('/editor/symposium/dashboard'),
                    default => redirect()->intended('/editor/journal/dashboard'),
                };
            }
        }

        return back()->withErrors([
            'username' => 'The provided credentials do not match our records.',
        ]);
    }

    public function showRegister(Request $request)
    {
        return Inertia::render('Auth/Register', [
            'dept_id' => $request->query('id'),
            'type' => $request->query('type'),
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'username' => ['required', 'unique:users'],
            'password' => ['required', 'min:6'],
            'dept_id' => ['required', 'exists:departments,id'],
        ]);

        User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'department_id' => $request->dept_id,
            'role' => 'editor',
        ]);

        return redirect()->route('login', ['id' => $request->dept_id, 'type' => $request->type])
            ->with('success', 'Registration successful. Please login.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
