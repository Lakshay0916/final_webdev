async function handleLogin(event) {
    event.preventDefault(); // Prevent the page from reloading when the form is submitted

    // Extract email and password from the form
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
        // Make a POST request to the login endpoint
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // Send email and password as JSON
        });

        const data = await response.json(); // Parse the response

        if (response.ok) {
            // Login successful
            alert(data.message); // Show success message
            // Redirect to another page (like dashboard.html)
            window.location.href = 'dashboard.html';
        } else {
            // Login failed
            alert(data.message); // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

// Attach the handleLogin function to the form's onsubmit event
document.querySelector('form').onsubmit = handleLogin;