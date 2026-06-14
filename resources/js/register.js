document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll('.toggle-password').forEach(button => {

        button.addEventListener('click', () => {

            const targetId = button.dataset.target;

            const input = document.getElementById(targetId);

            if (input.type === 'password') {

                input.type = 'text';

                button.textContent = '👁';

            } else {

                input.type = 'password';

                button.textContent = '◡';
            }
        });
    });

    const passwordInput =
        document.getElementById('password');

    const strengthBox =
        document.getElementById('password-strength');

    passwordInput.addEventListener('input', () => {

        const pass = passwordInput.value;

        let score = 0;

        if (pass.length >= 8) score++;

        if (/[A-Z]/.test(pass)) score++;

        if (/[0-9]/.test(pass)) score++;

        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (pass.length === 0) {

            strengthBox.textContent = '';

            strengthBox.className = '';

            return;
        }

        if (score <= 1) {

            strengthBox.textContent = 'Weak password';

            strengthBox.className = 'password-weak';

        } else if (score <= 3) {

            strengthBox.textContent = 'Good password';

            strengthBox.className = 'password-good';

        } else {

            strengthBox.textContent = 'Great password';

            strengthBox.className = 'password-great';
        }
    });

    document.getElementById('register-btn')
        .addEventListener('click', async (e) => {

        e.preventDefault();

        const errors = [];

        const name =
            document.getElementById('name').value.trim();

        const email =
            document.getElementById('email').value.trim();

        const pass =
            document.getElementById('password').value;

        const pass2 =
            document.getElementById('password_confirmation').value;

        if (name.length < 3) {

            errors.push(
                "Name must be at least 3 characters."
            );
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {

            errors.push(
                "Email format is invalid."
            );
        }

        if (pass.length < 8) {

            errors.push(
                "Password must be at least 8 characters."
            );
        }

        if (pass !== pass2) {

            errors.push(
                "Passwords do not match."
            );
        }

        const box = document.getElementById('errors');

        box.innerHTML = '';

        if (errors.length > 0) {

            box.innerHTML = errors.map(error => `
                <div class="error">
                    ${error}
                </div>
            `).join('');

            return;
        }

        const res = await fetch(
            `/check-email?email=${encodeURIComponent(email)}`
        );

        const data = await res.json();

        if (data.exists) {

            box.innerHTML = `
                <div class="error">
                    Email is already taken.
                </div>
            `;

            return;
        }

        document.getElementById('register-form').submit();
    });

});