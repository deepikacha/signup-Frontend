document.getElementById('Login').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const responseBody = await response.json();
        if (response.ok) {
            alert(responseBody.message); // "Login successful!"
            localStorage.setItem('token', responseBody.token); // Store token in localStorage 
            window.location.href = '/chat.html';
        } else {
            alert(responseBody.message); // Display error message from backend
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
    }
})
