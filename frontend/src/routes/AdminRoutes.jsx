import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Change from Switch to Routes
import AdminDashboard from '../pages/AdminDashboard';
import MissionList from '../pages/MissionList';
import UserDetailsForm from '../components/UserDetailsForm';
import StaffList from '../pages/StaffList';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/missions" element={<MissionList />} />
      <Route path="/admin/user-details" element={<UserDetailsForm />} />
      <Route path="/admin/staff-list" element={<StaffList />} />
    </Routes>
  );
};

export default AdminRoutes;
