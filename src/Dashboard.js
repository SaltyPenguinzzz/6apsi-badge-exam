import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
