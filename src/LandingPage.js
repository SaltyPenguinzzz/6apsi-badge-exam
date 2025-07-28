import { useNavigate } from 'react-router-dom';
import './App.css';

function LandingPage({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();         // Optional: clear auth state
    navigate('/login'); // Redirect back to login
  };

  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1>Welcome to the Landing Page</h1>
        <p>You have successfully logged in.</p>

        <div className="landing-buttons">
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
