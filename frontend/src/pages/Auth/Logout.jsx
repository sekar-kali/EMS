import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import "../../auth.css"


const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      // Clear authentication token
      localStorage.removeItem('authToken');
      
      // Redirect to the login page after 5 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 5000);
    };

    // Call the logout function
    handleLogout();
  }, [navigate]);

  return (
    <section className="logout-container">
        <aside className="logo">
                      <img src={logoImage} alt="logo-EMS" />
        <p>EMS</p></aside>
        <h2>Thanks and See You Again ! Logging Out...</h2>
        <p>
          If you are not redirected, you can <a href="/auth/login">click here</a> to log in.
        </p>
      </section>
  );
};

export default Logout;
