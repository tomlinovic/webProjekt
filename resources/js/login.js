document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = document.getElementById(button.dataset.target);
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '👁';
            } else {
                input.type = 'password';
                button.textContent = '◡';
            }
        });
    });

    document.getElementById('login-email').addEventListener('blur', () => {
        const email = document.getElementById('login-email').value.trim();
        const box   = document.getElementById('login-errors');

        if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            box.innerHTML = '<div class="error">Invalid email format.</div>';
        } else {
            box.innerHTML = '';
        }
    });

    document.getElementById('login-btn').addEventListener('click', async (e) => {
        e.preventDefault();

        const email    = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const box      = document.getElementById('login-errors');
        const btn      = document.getElementById('login-btn');

        box.innerHTML = '';
        const errors = [];

        if (!email) {
            errors.push('Email is required.');
        } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.push('Invalid email format.');
        }

        if (!password) {
            errors.push('Password is required.');
        } else if (password.length < 8) {
            errors.push('Password must be at least 8 characters.');
        }

        if (errors.length > 0) {
            box.innerHTML = errors.map(err => `<div class="error">${err}</div>`).join('');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Logging in...';
        document.getElementById('login-form').submit();
    });

});
