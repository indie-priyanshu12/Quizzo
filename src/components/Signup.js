import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'student' // default value
    });
    
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('Form field changed:', name, value); // Debug log
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for the field being changed
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        // Username validation
        if (!formData.username.trim()) {
            formErrors.username = 'Username is required';
            isValid = false;
        } else if (formData.username.length < 3) {
            formErrors.username = 'Username must be at least 3 characters long';
            isValid = false;
        }

        // Name validation
        if (!formData.name.trim()) {
            formErrors.name = 'Full name is required';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            formErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            formErrors.password = 'Password must be at least 6 characters long';
            isValid = false;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            formErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                const requestData = {
                    username: formData.username.trim().toLowerCase(),
                    fullName: formData.name,
                    password: formData.password,
                    role: formData.role
                };
                console.log('Signup request data:', requestData); // Debug log

                const response = await fetch('http://localhost:5000/api/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                const data = await response.json();
                console.log('Signup response:', data);

                if (response.ok) {
                    // Store complete user data including role
                    localStorage.setItem('userData', JSON.stringify({
                        username: requestData.username,
                        fullName: requestData.fullName,
                        role: requestData.role // Ensure role is stored
                    }));
                    alert(`Registration successful as ${requestData.role}! Redirecting to login...`);
                    navigate('/');
                } else {
                    console.error('Server returned error:', data);
                    setErrors({
                        submit: data.message || 'Failed to create account'
                    });
                }
            } catch (error) {
                console.error('Signup error:', error);
                setErrors({
                    submit: 'Failed to create account'
                });
            }
        }
    };

    return (
        <div className="signup-container">
            <img src="/logo.png" alt="Quizzo Logo" className="signup-logo" onClick={() => <Link to="/"></Link>}/>
            
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                    />
                    {errors.username && <span className="error">{errors.username}</span>}
                </div>

                <div>
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>

                <div className="role-selection">
                    <label htmlFor="role">Select Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="role-dropdown"
                    >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                    </select>
                </div>

                <button type="submit">Sign Up</button>
                <p className="login-link">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </form>
        </div>
    );  
};

export default Signup;