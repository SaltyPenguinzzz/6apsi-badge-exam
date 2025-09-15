import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // When redirected from email, Supabase sets a recovery session automatically in v2
    // If not present, we can still allow user to try updating and handle error.
  }, []);

  const updatePassword = async () => {
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    alert('Password updated. You can now log in.');
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Reset Password</h2>
        <div className="form-row">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
        </div>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        <div className="form-row">
          <button className="btn-primary" onClick={updatePassword} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;


