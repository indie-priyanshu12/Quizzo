import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { username: (username || '').trim().toLowerCase(), password };

        console.log('Login payload:', payload);

        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));
            console.log('Login response:', res.status, data);

            if (!res.ok) {
                alert(data.message || 'Login failed');
                return;
            }

            setRedirect(true);
        } catch (err) {
            console.error('Login error', err);
            alert('Login error');
        }
    };

    if (redirect) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="login-container">
            <Link to="/signup">
                <img src="/logo.png" alt="Quizzo Logo" className="login-logo" />
            </Link>

            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Welcome Back!</h2>

                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>

                <button type="submit">Login</button>
                <p className="signup-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;