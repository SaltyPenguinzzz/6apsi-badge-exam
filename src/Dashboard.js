import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const API_URL = 'https://jsonplaceholder.typicode.com/users';
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setUsers(res.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const addUser = async (name) => {
    try {
      const res = await axios.post(API_URL, { name });
      const newUser = { id: Date.now(), name: res.data.name };
      setUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const updateUser = async (id, newName) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { name: newName });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, name: res.data.name } : u));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const goToLandingPage = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        ☰
      </button>

      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={toggleSidebar} aria-label="Close sidebar">
          &times;
        </button>
        <NavLink to="/dashboard" className="logo">
          Dashboard
        </NavLink>
        <nav className="main-nav">
          <NavLink to="/dashboard/crud" className="nav-link" onClick={() => setIsSidebarOpen(false)}>
            CRUD Operations
          </NavLink>
          <NavLink to="/dashboard/report" className="nav-link" onClick={() => setIsSidebarOpen(false)}>
            Reports & Analytics
          </NavLink>
        </nav>

        <div className="bottom-nav">
          <button className="nav-link nav-button back-to-landing" onClick={goToLandingPage}>
            Back to Landing
          </button>
          <button className="nav-link nav-button logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
