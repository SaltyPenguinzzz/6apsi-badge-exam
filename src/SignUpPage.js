import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';

function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const signUp = async () => {
    if (!email || !password || !fullName) {
      setErrorMsg('Please fill out name, email, and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    alert('Check your email to confirm your account.');
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign Up</h2>

        <div className="form-row">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-row">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <div className="form-row" style={{ gap: 8 }}>
          <button className="btn-primary" onClick={signUp} disabled={loading}>
            {loading ? 'Signing up...' : 'Create Account'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/login')} disabled={loading}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;


