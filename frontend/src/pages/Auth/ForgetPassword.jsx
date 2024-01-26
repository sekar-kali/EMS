import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import logoImage from '../../logo.png';
import 'react-toastify/dist/ReactToastify.css';
import '../../auth.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgetPassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Error sending reset email');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error sending reset email:', error.message);
      setMessage('Error sending reset email. Please try again.');
    }
  };

  return (
    <>
    <div className="login-container1">
    <div className="logo">
                      <img src={logoImage} alt="logo-EMS" />
        <p>EMS</p></div>
    <h1>Welcome to your HR services portal</h1>
    </div>
    <div className="login-container">
      <h1>Forget Password</h1>
      <div className="form-flex">
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button onClick={handleForgetPassword}>Send Reset Email</button>
      <div>{message}</div>
      <ToastContainer />
    </div>
    </>
  );
};

export default ForgetPassword;
