import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './PasswordResetConfirm.css';

function PasswordResetConfirm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { userId, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8000/api/password-reset-confirm/${userId}/${token}/`, {
        new_password: newPassword
      });
      setMessage(response.data.detail);
      setError('');
      setTimeout(() => navigate('/login'), 3000); // Redirect ke login setelah 3 detik
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="password-reset-confirm-container">
      <div className="password-reset-confirm-box">
        <h2>Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-buttons">Reset Password</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="extra-links">
          <p>Remember your password? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetConfirm;