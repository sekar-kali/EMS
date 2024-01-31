import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import logoImage from '../../assets/logo.png';
import 'react-toastify/dist/ReactToastify.css';
import '../../auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
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
      console.log('Error sending reset email:', error.message);
      setMessage('Error sending reset email. Please try again.');
    }
  };

  return (
    <>
    <section className="login-container1">
    <aside className="logo">
                      <img src={logoImage} alt="logo-EMS" />
        <p>EMS</p></aside>
    <h1>Welcome to your HR services portal</h1>
    </section>
    <section className="login-container">
      <h1>Forgot Password</h1>
      <article className="form-flex">
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </article>
      <button onClick={handleForgotPassword}>Send Reset Email</button>
      <aside>{message}</aside>
      <ToastContainer />
    </section>
    </>
  );
};

export default ForgotPassword;
