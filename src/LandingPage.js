import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage({ onLogout }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="landing-container">
      {/* ☰ Menu Button */}
      <button className="menu-button" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar Panel */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button onClick={goToDashboard}>Dashboard</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="landing-box">
        <h1>Welcome to the Landing Page</h1>
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
}

export default LandingPage;
