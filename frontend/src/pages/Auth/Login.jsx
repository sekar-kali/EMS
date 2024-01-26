import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import logoImage from '../../logo.png';
import 'react-toastify/dist/ReactToastify.css';
import '../../auth.css';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Validate input fields
      if (!email || !password) {
        toast.error('Please fill in all fields.');
        return;
      }
  
      // Send a login request to the backend
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
        const user = data.email;
        // Store the authentication token in localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user',JSON.stringify(user));
  
        // Show success toast
        toast.success('Login successful!');
  
        // Wait for 2 seconds before navigating
        setTimeout(() => {
          // Redirect to the user dashboard based on the user's role
          if (data.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (data.role === 'staff') {
            navigate('/staff/dashboard');
          }
        }, 2000);
      } else {
        // Login failed, log the error message
        console.error('Login failed:', data.message);
  
        // Show error toast
        toast.error(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      toast.error('Error during login. Please try again.');
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

      <h2>Login</h2>
      <form>
      <div className="form-flex">
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Link className='forget-password' to="/auth/forget-password">Forget Password ?</Link>
        <div className="form-flex">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div> 
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>

      

      <ToastContainer />
    </div>
    </>
  );
};

export default Login;
