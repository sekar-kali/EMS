import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logoImage from '../../assets/logo.png';
import 'react-toastify/dist/ReactToastify.css';
import '../../auth.css';

const CreatePassword = () => {
  const { email } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate terms and conditions checkbox
    if (!termsChecked) {
      setError('Please accept the terms and conditions.');
      return;
    }

    // Reset previous error messages
    setError('');
    setLoading(true);

    try {
      const response = await sendPasswordToServer(email, password);

      if (response.status === 200) {
        // Password created successfully, redirect to login page
        toast.success('Password created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        // Handle specific error cases if needed
        setError('Error creating password. Please try again.');
      }
    } catch (error) {
      console.log('Error sending password to server:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordToServer = async (email, password) => {
    try {
      const response = await fetch(`http://localhost:5000/api/create-password/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      return response;
    } catch (error) {
      console.log('Error sending password to server:', error);
      return { status: 500 };
    }
  };

  return (
    <>
      <section className="login-container1">
        <aside className="logo">
          <img src={logoImage} alt="logo-EMS" />
          <p>EMS</p>
        </aside>
        <h1>Welcome to your HR services portal</h1>
      </section>
      <section className="login-container">
        <h2>Create Your Password</h2>
        <form onSubmit={handleSubmit}>
        <article className="form-flex">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </article>
          <article className="form-flex">
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </ article>
          <label>
            <input type="checkbox" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} />
            I accept the <Link to="/terms-and-conditions"> terms and conditions</Link>
          </label>
          <br />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Password...' : 'Create Password'}
          </button>
        </form>
      </section>
      <ToastContainer />
    </>
  );
};

export default CreatePassword;

