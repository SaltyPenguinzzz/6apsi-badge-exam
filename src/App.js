import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import CrudPage from './CrudPage';
import ReportPage from './ReportPage';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const API_URL = 'https://jsonplaceholder.typicode.com/users';

  useEffect(() => {
    axios.get(API_URL).then(res => setUsers(res.data));
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const addUser = async (name) => {
    const res = await axios.post(API_URL, { name });
    const newUser = { id: Date.now(), name: res.data.name };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = async (id, newName) => {
    const res = await axios.put(`${API_URL}/${id}`, { name: newName });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, name: res.data.name } : u));
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/landing" element={
          isLoggedIn ? <LandingPage onLogout={handleLogout} /> : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard" element={
          isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
        }>
          <Route index element={
            <div className="welcome-container">
              <h2 className="welcome">Welcome to the Dashboard</h2>
            </div>
          } />
          <Route path="crud" element={
            <CrudPage
              users={users}
              addUser={addUser}
              updateUser={updateUser}
              deleteUser={deleteUser}
            />
          } />
          <Route path="report" element={<ReportPage users={users} />} />
        </Route>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/landing" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
