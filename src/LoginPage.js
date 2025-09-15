import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    navigate('/landing');
  };

  const signUp = async () => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    alert('Check your email to confirm your account.');
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const sendReset = async () => {
    if (!email) {
      setErrorMsg('Enter your email first.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    alert('Password reset email sent. Check your inbox.');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <div className="form-row">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-row password-row">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="button" className="show-password-btn" onClick={togglePassword}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </button>
        </div>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <div className="form-row" style={{ gap: 8 }}>
          <button className="btn-primary" onClick={login} disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/signup')} disabled={loading}>Sign Up</button>
        </div>

        <div className="form-row" style={{ marginTop: 8 }}>
          <button type="button" className="btn-link" onClick={sendReset} disabled={loading}>
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
