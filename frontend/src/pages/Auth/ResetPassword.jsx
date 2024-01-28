import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import logoImage from '../../logo.png';
import 'react-toastify/dist/ReactToastify.css';
import '../../auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      // Simple password validation using regex
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(password)) {
        throw new Error('Password must be at least 8 characters long and include 1 capital letter, 1 small letter, and 1 special character.');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const token = new URLSearchParams(window.location.search).get('token');

      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!response.ok) {
        throw new Error('Error resetting password');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error resetting password:', error.message);
      setMessage(error.message);
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
      <h1>Reset Password</h1>
      <article className="form-flex">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </article>
      <article className="form-flex">
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </article>
      <button onClick={handleResetPassword}>Reset Password</button>
      <aside>{message}</aside>
      <ToastContainer />
    </section>
    </>
  );
};

export default ResetPassword;
