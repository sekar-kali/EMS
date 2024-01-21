import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import MissionList from '../pages/Admin/MissionList';
import UserDetailsForm from '../components/UserDetailsForm';
import StaffList from '../pages/Admin/StaffList';
import ModifyStaffForm from '../pages/Admin/ModifyStaffForm';


const AdminRoutes = () => {
  return (
    <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-mission" element={<CreateMission />} />
        <Route path="/admin/missions-list" element={<MissionList />} />
        <Route path="/admin/leave-request" element={<LeaveRequestList />} />
        <Route path="/admin/user-details" element={<UserDetailsForm />} />
        <Route path="/admin/staff-list" element={<StaffList />} />
        <Route path="/admin/create-staff" element={<CreateStaff />} />
        <Route path="/modify-staff/:id" render={({ match }) => <ModifyStaffForm staffId={match.params.id} />} />
    </Routes>
  );
};

export default AdminRoutes;
