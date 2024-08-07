import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';  

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', { email, password });
      login(response.data.access, response.data.refresh);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/');
      }, 1000); // Redirect ke "/" setelah 1 detik
    } catch (error) {
      console.error('Login error', error.response.data);
    }
  };

  return (
    <div className="login-container">
      {showSuccess && (
        <div className="success-message">
          Login successfully! Redirecting to test...
        </div>
      )}
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="extra-links">
          <p>Forget your password? <Link to="/password-reset">Reset Password</Link></p>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;