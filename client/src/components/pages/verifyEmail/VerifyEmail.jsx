import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/Api';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.get(`/auth/verify/${token}`);
        if(!res.data.status) {
          alert("המייל אומת כבר בעבר, נא להתחבר")
        } else {
          alert("מייל אומת בהצלחה, נא להתחבר");
        }
        // Navigate to login page
        navigate('/');      
      } catch (error) {
        alert("אירעה שגיאה באימות המייל, אנא נסה שנית")
      }
    };
    
    verify();
  }, [token]);

  return (
    <div>
      <h1>עמוד אימות המייל</h1>
    </div>
  );
}

export default VerifyEmail;