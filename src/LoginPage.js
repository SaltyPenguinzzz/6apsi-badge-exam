import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    onLogin();              // Call parent login handler
    navigate('/landing');   // ✅ Correct route path (not filename)
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <div className="form-row">
          <input
            type="text"
            placeholder="Enter any username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="form-row password-row">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter any password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="button" className="show-password-btn" onClick={togglePassword}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </button>
        </div>

        <button className="btn-primary" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
