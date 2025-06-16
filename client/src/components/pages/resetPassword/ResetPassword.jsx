import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from "../../utils/Api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      setStatus({ type: 'success', message: res.data.message });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || 'Reset failed' });
    }
  };

  return (
    <div>
      <h1>Reset Your Password</h1>
      {status && <p style={{ color: status.type === 'error' ? 'red' : 'green' }}>{status.message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;