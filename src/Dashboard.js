import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import CrudPage from './CrudPage';
import ReportPage from './ReportPage';
import './App.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <NavLink to="/" className="logo">
          Dashboard
        </NavLink>
        <nav>
          <NavLink to="/crud" className="nav-link">CRUD</NavLink>
          <NavLink to="/report" className="nav-link">Report</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        <Routes>
          <Route path="/crud" element={<CrudPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route 
            path="/" 
            element={
              <div className="welcome-container">
                <h2 className="welcome">Welcome to the Dashboard</h2>
              </div>
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
