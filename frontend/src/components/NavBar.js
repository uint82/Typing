// NavBar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useUserProfile } from '../UserProfileContext';
import { FaKeyboard, FaUser, FaTrophy } from "react-icons/fa";
import './NavBar.css';

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { userProfile, fetchUserProfile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && !userProfile) {
      fetchUserProfile();
    }
  }, [isLoggedIn, userProfile, fetchUserProfile]);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">
          <FaKeyboard size="40px"/>
          <span>Typing Test</span>
        </h1>
      </div>
      <div className="navbar-right">
        <Link to="/" className="navbar-link"><span>Test</span></Link>
        <Link to="/leaderboard" className="navbar-link">
          <FaTrophy />
          <span>Leaderboard</span>
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="navbar-link">
              <FaUser />
              <span>{loading ? 'Loading...' : userProfile?.username}</span>
            </Link>
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
