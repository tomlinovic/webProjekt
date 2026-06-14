<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;


class UserController extends Controller
{
    public function showRegister() {
        return view('auth.register');
    }

    public function register(Request $request) {
        $request->validate([
            'name' => 'required|min:3',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        Auth::login($user);

        return redirect('/');
    }

    public function showLogin() {
        return view('auth.login');
    }

    public function login(Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect('/');
        }

        return back()->withErrors([
            'email' => 'Invalid credentials'
        ]);
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function search(Request $request)
    {
        $query = $request->input('q');

        // Ako je email → vrati točno jednog usera
        if (filter_var($query, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $query)->first();

            return response()->json([
                'type' => 'email',
                'user' => $user
            ]);
        }

        // Inače pretraga po name (ne username!)
        $users = User::where('name', 'LIKE', "%{$query}%")->get();

        return response()->json([
            'type' => 'name',
            'users' => $users
        ]);
    }


}
