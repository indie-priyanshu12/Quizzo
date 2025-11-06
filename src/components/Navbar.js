import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-brand">
        <img src="/logo.png" alt="Quizzo" className="nav-logo" />
        <span>Quizzo</span>
      </Link>
      
      <div className="nav-links">
        <Link to="/account">My Account</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
