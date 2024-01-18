import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import AdminRoutes from './routes/AdminRoutes';
import StaffRoutes from './routes/StaffRoutes';
import AuthRoutes from './routes/AuthRoutes';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import MissionList from './components/MissionList';
import UserDetailsForm from './components/UserDetailsForm';
import LeaveRequestForm from './components/LeaveRequestForm';

const PrivateRoute = ({ element: Element, roles, ...rest }) => {
  const authToken = localStorage.getItem('authToken');

  return authToken ? <Element /> : <Navigate to="/auth/login" />;
};

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };
  return (
    <Router>
      <Routes>
        {/* Default route - Redirect to login */}
        <Route path="/" element={<Navigate to="/auth/login" />} />
        
        {/* Auth routes */}
        <Route path="/auth/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/auth/signup" element={<Signup />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={<PrivateRoute roles={["admin"]} element={<AdminDashboard />} />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/missions" element={<MissionList />} />
        <Route path="/admin/user-details" element={<UserDetailsForm />} />

        {/* Staff routes */}
        <Route
          path="/staff/*"
          element={<PrivateRoute roles={["staff"]} element={<StaffDashboard />} />}
        />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/leave-request" element={<LeaveRequestForm />} />
        <Route path="/staff/user-details" element={<UserDetailsForm />} />

        {/* Catch-all route for unknown paths - Redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
};

export default App;