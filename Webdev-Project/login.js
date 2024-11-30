async function handleLogin(event) {
    event.preventDefault(); // Prevent page reload on form submission

    // Extract email and password from form inputs
    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();

    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    try {
        // Make a POST request to the login endpoint
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json(); // Parse the JSON response

        if (response.ok) {
            // Save token and email to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', email); // Save the user's email for future use
            alert('Login successful!');
            // Redirect to the dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message); // Show error message
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
    }
}

// Attach the handleLogin function to the form's submit event
document.querySelector('form').addEventListener('submit', handleLogin);
