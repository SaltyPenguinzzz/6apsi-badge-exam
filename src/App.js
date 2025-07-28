import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard'; // ✅ Import your Dashboard component
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />

        {/* Landing Page - Protected */}
        <Route
          path="/landing"
          element={
            isLoggedIn ? (
              <LandingPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ✅ Dashboard Page - Protected */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Root Redirect */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/landing" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
