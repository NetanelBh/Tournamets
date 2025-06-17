import API from "../../utils/Api";
import { useEffect } from "react";

const Register = () => {
  // TODO: CREATE THIS PAGE TO GET THE FOLLOWING DATA OF THE USER, THEN REMOVE THE USEEFFECT 

  useEffect(() => {
    const fetchData = async () => {
      const user = await API.post('/auth/register', {firstname: "נתנאל",
        lastname: "בן חמו",
        // This username will be displayed in the points table
        username: "N",
        email: "netanel77777@gmail.com",
        password: "12",
      });      
    };
    
    fetchData();
  }, []);
  return (
    <div>Register</div>
  )
}

export default Register