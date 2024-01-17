import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Change from Switch to Routes
import AdminDashboard from '../components/AdminDashboard';
import MissionList from '../components/MissionList';
import UserDetailsForm from '../components/UserDetailsForm';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/missions" element={<MissionList />} />
      <Route path="/admin/user-details" element={<UserDetailsForm />} />
    </Routes>
  );
};

export default AdminRoutes;
