import React from 'react';
import { Route, Routes } from 'react-router-dom';

import StaffDashboard from '../pages/Staff/StaffDashboard';
import LeaveRequestForm from '../pages/Staff/LeaveRequestForm';
import UserDetailsForm from '../components/UserDetailsForm';
import StaffLeaveRequestList from '../pages/Staff/StaffLeaveRequest';
import StaffMissionsList from '../pages/Staff/StaffMissionsList';
import StaffPersonalInfo from '../pages/Staff/StaffPersonalInfo';

const StaffRoutes = () => {
  return (
    <Routes>
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/create-leave-request" element={<LeaveRequestForm />} />
        <Route path="/staff/leave-request-list" element={<StaffLeaveRequestList />} />
        <Route path="/staff/mission-list" element={<StaffMissionsList />} />
        <Route path="/staff/personal-info" element={<StaffPersonalInfo/>} />
        <Route path="/staff/user-details" element={<UserDetailsForm />} />
    </Routes>
  );
};

export default StaffRoutes;
