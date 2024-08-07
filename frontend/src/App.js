
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import PasswordReset from './routes/PasswordReset';
import PasswordResetConfirm from './routes/PasswordResetConfirm';
import Profile from './routes/Profile';
import Leaderboard from './routes/Leaderboard';
import { AuthProvider } from './AuthContext';
import { UserProfileProvider } from './UserProfileContext';
import { LeaderboardProvider } from './LeaderboardContext';
import { HistoryProvider } from './HistoryContext';


function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
       <LeaderboardProvider>
        <HistoryProvider>
          <Router>
            <div className="App">
              <Navbar />
                <Routes>
                <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/password-reset" element={<PasswordReset />} />
                  <Route path="/password-reset-confirm/:userId/:token" element={<PasswordResetConfirm />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  {/* Add more routes as needed */}
                </Routes>
                <Footer />
              </div>
            </Router>
          </HistoryProvider>
        </LeaderboardProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;