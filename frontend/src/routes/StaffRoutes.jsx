import React from 'react';
import { Route, Routes } from 'react-router-dom';

import StaffDashboard from '../components/StaffDashboard';
import LeaveRequestForm from '../components/LeaveRequestForm';
import UserDetailsForm from '../components/UserDetailsForm';

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/staff/dashboard" element={<StaffDashboard />} />
      <Route path="/staff/leave-request" element={<LeaveRequestForm />} />
      <Route path="/staff/user-details" element={<UserDetailsForm />} />
    </Routes>
  );
};

export default StaffRoutes;
