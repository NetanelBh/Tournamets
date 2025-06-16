import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/Api';

function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.get(`/auth/verify-email/${token}`);
        alert(res.data.message || "מייל אומת בהצלחה, נא להתחבר");
        navigate('/login');
      } catch (error) {
        setMessage(error.response?.data?.error || 'Invalid or expired token.');
      }
    };
    verify();
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmail;