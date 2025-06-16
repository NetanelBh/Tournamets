import API from "../../utils/Api";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  useEffect(() => {
    const fetchData = async () => {
      const user = await API.post('/auth/register', {firstname: "נתנאל",
        lastname: "בן חמו",
        username: "N",
        email: "netanel77777@gmail.com",
        password: "12"
      });
    };
    
    fetchData();
  }, []);
  return (
    <div>Register</div>
  )
}

export default Register