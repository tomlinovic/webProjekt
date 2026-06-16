<x-layout>
<div class="auth-container">
    <h1>Login</h1>

    {{-- Laravel serverske greške (npr. pogrešna lozinka) --}}
    @if ($errors->any())
        <div id="login-errors">
            @foreach ($errors->all() as $error)
                <div class="error">{{ $error }}</div>
            @endforeach
        </div>
    @else
        <div id="login-errors"></div>
    @endif

    <form method="POST" action="/login" id="login-form">
        @csrf

        <input
            type="email"
            id="login-email"
            name="email"
            placeholder="Email"
            value="{{ old('email') }}"
            required
        >

        <div class="password-wrapper">
            <input
                type="password"
                id="login-password"
                name="password"
                placeholder="Password"
                required
            >
            <button type="button" class="toggle-password" data-target="login-password">
                ◡
            </button>
        </div>

        <button type="submit" id="login-btn">Login</button>
    </form>

    <p>No account? <a href="/register">Register</a></p>
</div>

@vite(['resources/css/register.css', 'resources/js/login.js'])
</x-layout>
