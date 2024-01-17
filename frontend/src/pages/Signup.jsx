import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      // Validate input fields (you may add more validation)
      if (!username || !email || !password) {
        console.log('Please fill in all fields.');
        return;
      }

      // Send a signup request to your backend
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Signup successful, redirect to login or any other page
        console.log('Signup successful:', data.message);
        // Redirect to login page or any other page
      } else {
        // Signup failed, log the error message
        console.error('Signup failed:', data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign up</h2>
      <form>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="button" onClick={handleSignup}>
          Sign up
        </button>
      </form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
