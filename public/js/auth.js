 const API = 'https://ecommerce-project-j8z0.onrender.com/api';

// LOGIN
const login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill all fields');
        return;
    }

    try {
        const response = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save user and token to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error connecting to server');
    }
};

// REGISTER
const register = async () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert('Please fill all fields');
        return;
    }

    try {
        const response = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Account created successfully! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error connecting to server');
    }
};
