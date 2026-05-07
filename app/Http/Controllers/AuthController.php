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
        return Inertia::render('Auth/BackendSelector');
    }

    public function showDepartmentSelection(Request $request)
    {
        $type = $request->query('type', 'journal');
        
        return Inertia::render('Auth/DepartmentSelection', [
            'departments' => Department::all(),
            'journals' => \App\Models\Journal::where('status', 'approved')->get(),
            'conferences' => \App\Models\Conference::where('status', 'approved')->get(),
            'symposiums' => \App\Models\Symposium::where('status', 'approved')->get(),
            'type' => $type
        ]);
    }

    public function showLogin(Request $request)
    {
        return Inertia::render('Auth/Login', [
            'pub_id' => $request->query('pub_id'),
            'type' => $request->query('type'),
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);

        $pub_id = $request->input('pub_id'); // Previously dept_id/id
        $type = $request->input('type', 'journal');

        $user = User::where('username', $credentials['username'])->first();

        if ($user && Hash::check($credentials['password'], $user['password'])) {
            // Check if user has access to this specific publication and type
            $hasAccess = ($user->role === 'admin') || 
                         ($user->type === $type && $user->publication_id == $pub_id);

            if ($hasAccess) {
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

    public function showForgotPassword()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
