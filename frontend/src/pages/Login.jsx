import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Validate input fields
      if (!email || !password) {
        console.log('Please fill in all fields.');
        return;
      }

      // Send a login request to backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Login successful
        const authToken = data.token;
  
        // Store the authentication token in localStorage
        localStorage.setItem('authToken', authToken);
  
        // Redirect to the user dashboard based on the user's role
        if (data.role === 'admin') {
          // Redirect to the admin dashboard
          navigate.push('/admin/dashboard');
        } else if (data.role === 'staff') {
          // Redirect to the staff dashboard
          navigate.push('/staff/dashboard');
        } else {
          // Handle unknown role or redirect to a default page
          navigate.push('/');
        }
      } else {
        // Login failed, log the error message
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
