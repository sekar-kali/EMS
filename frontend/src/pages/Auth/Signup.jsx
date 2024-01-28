import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logoImage from '../../logo.png';
import 'react-toastify/dist/ReactToastify.css';
import '../../auth.css';


const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Validate input fields (you may add more validation)
      if (!firstName || !lastName || !email || !password) {
        toast.error('Please fill in all fields.');
        return;
      }

      // Send a signup request to your backend
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Signup successful, show success toast
        toast.success('Signup successful! Redirecting to login...');
  
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000); // 2000 milliseconds (2 seconds)
      } else {
        // Signup failed, show error toast
        toast.error(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      // Error during signup, show error toast
      toast.error(`Error during signup: ${error.message}`);
    }
  };

  return (
    <>
    <ToastContainer />
    <main className="register-container">
    <aside className="logo">
                      <img src={logoImage} alt="logo-EMS" />
        <p>EMS</p></aside>
      <h2>Sign up</h2>
      <form>
        <article className="form-flex">
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </article>
        <article className="form-flex">
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </article>
        <article className="form-flex">
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </article>
        <article className="form-flex">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </article>
        <button type="button" onClick={handleSignup}>
          Sign up
        </button>
      </form>

      <p>
        Already have an account? <Link to="/auth/login">Login</Link>
      </p>
    </main>
    </>
  );
};

export default Signup;
