import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { username: (username || '').trim().toLowerCase(), password };

        try {
            // First, verify user exists and get role
            const checkUserRes = await fetch(`http://localhost:5000/api/users/check/${payload.username}`);
            const userData = await checkUserRes.json();
            
            if (!checkUserRes.ok || !userData) {
                alert('User not found');
                return;
            }

            console.log('Found user data:', userData);

            // Now proceed with login
            const loginRes = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const loginData = await loginRes.json();
            console.log('Login response:', loginData);

            if (!loginRes.ok) {
                alert(loginData.message || 'Login failed');
                return;
            }

            // Use role from MongoDB user data
            const userRole = userData.role;
            console.log('Using MongoDB role:', userRole);

            if (!userRole) {
                console.error('No role found for user:', userData);
                alert('Error: User role not found');
                return;
            }

            setRole(userRole);
            localStorage.setItem('userData', JSON.stringify({
                id: loginData.user.id,
                username: loginData.user.username,
                fullName: loginData.user.fullName,
                role: userRole,
                token: loginData.token
            }));

            setRedirect(true);
        } catch (err) {
            console.error('Login error:', err);
            alert('Login error: ' + (err.message || 'Unknown error'));
        }
    };

    // Simplified redirect using only server-provided role
    if (redirect && role) {
        console.log('Redirecting with role:', role);
        return role === 'instructor' 
            ? <Navigate to="/admindashboard" />
            : <Navigate to="/dashboard" />;
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