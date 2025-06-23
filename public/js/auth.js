// public/js/auth.js

// This event listener ensures the script runs only after the full HTML document has been loaded.
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const errorMessage = document.getElementById('error-message'); // An element to display errors

  // --- SIGNUP FORM HANDLER ---
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent the default form submission (which reloads the page)

      // Clear previous error messages
      if (errorMessage) errorMessage.textContent = '';

      // Get values from the form inputs
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      // Get the selected role from the radio buttons
      const role = document.querySelector('input[name="role"]:checked').value;

      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Convert the JavaScript object to a JSON string
          body: JSON.stringify({ email, password, role }),
        });

        const data = await res.json();

        // Check if the server responded with an error (e.g., status 400)
        if (!res.ok) {
          throw new Error(data.msg || 'Something went wrong');
        }

        // On success, the server sends back a token.
        // Store the token in localStorage for session persistence.
        localStorage.setItem('token', data.token);

        // Redirect to the dashboard
        window.location.href = '/dashboard.html';

      } catch (err) {
        // Display the error message to the user
        if (errorMessage) errorMessage.textContent = err.message;
        console.error('Signup Error:', err);
      }
    });
  }


  // --- LOGIN FORM HANDLER ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (errorMessage) errorMessage.textContent = '';

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.msg || 'Invalid Credentials');
        }

        // On successful login, store the token and redirect
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard.html';

      } catch (err) {
        if (errorMessage) errorMessage.textContent = err.message;
        console.error('Login Error:', err);
      }
    });
  }
});