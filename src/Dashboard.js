import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const API_URL = 'https://jsonplaceholder.typicode.com/users';
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_URL).then(res => setUsers(res.data));
  }, []);

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

  const handleLogout = () => {
    navigate('/login');
  };

  const goToLandingPage = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <NavLink to="/dashboard" className="logo">Dashboard</NavLink>
        <nav>
          <NavLink to="/dashboard/crud" className="nav-link">CRUD</NavLink>
          <NavLink to="/dashboard/report" className="nav-link">Report</NavLink>

          {/* Back to Landing Page */}
          <button className="nav-link nav-button" onClick={goToLandingPage}>
            ← Back to Landing
          </button>

          {/* Logout */}
          <button className="nav-link nav-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
