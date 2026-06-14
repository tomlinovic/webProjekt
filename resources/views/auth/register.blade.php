<x-layout>
    <div class="auth-container">
        <form method="POST" action="/register" id="register-form">
            @csrf

            <input type="text" id="name" name="name" placeholder="Name" required>
            <input type="email" id="email" name="email" placeholder="Email" required>

            <div class="password-wrapper">
                <input type="password" id="password" name="password" placeholder="Password" required>
                <button type="button" class="toggle-password" data-target="password">
                    ◡
                </button>
            </div>

            <div id="password-strength"></div>

            <div class="password-wrapper">
                <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Confirm Password" required>
                <button type="button" class="toggle-password" data-target="password_confirmation">
                    ◡
                </button>
            </div>

            <button type="submit" id="register-btn">Create Account</button>
        </form>

        <div id="errors"></div>
    </div>


@vite(['resources/css/register.css', 'resources/js/register.js'])

</x-layout>
