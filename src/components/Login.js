import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log('Login attempted with:', email);
        setRedirect(true);
    };

    if (redirect) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="login-container">
            <img src="/logo.png" alt="Quizzo Logo" className="login-logo" />
            
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Welcome Back!</h2>
                
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
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