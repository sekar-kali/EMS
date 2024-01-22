import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StaffDashboard from './pages/Staff/StaffDashboard';
import MissionList from './pages/Admin/MissionList';
import LeaveRequestForm from './pages/Staff/LeaveRequestForm';
import StaffList from './pages/Admin/StaffList';
import CreateMission from './pages/Admin/CreateMission';
import CreateStaff from './pages/Admin/CreateStaff';
import LeaveRequestList from './pages/Admin/LeaveRequestList';
import Logout from './pages/Auth/Logout';
import StaffPersonalInfo from './pages/Staff/StaffPersonalInfo';
import StaffMissionsList from './pages/Staff/StaffMissionsList';
import StaffLeaveRequestList from './pages/Staff/StaffLeaveRequest';
import ModifyStaffForm from './pages/Admin/ModifyStaffForm';

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  return authToken ? children : <Navigate to="/auth/login" />;
};

const CenteredContent = ({ children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {children}
    </div>
  );
};

const App = () => {

  return (
    <Router>
      <Routes>
        {/* Default route - Redirect to login */}
        <Route path="/" element={<Navigate to="/auth/login" />} />
       
        {/* Auth routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/logout" element={<Logout />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={<PrivateRoute roles={["admin"]} element={<CenteredContent><AdminDashboard /></CenteredContent>} />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-mission" element={<CreateMission />} />
        <Route path="/admin/missions-list" element={<MissionList />} />
        <Route path="/admin/leave-request" element={<LeaveRequestList />} />
        <Route path="/admin/staff-list" element={<StaffList />} />
        <Route path="/admin/create-staff" element={<CreateStaff />} />
        <Route path="/modify-staff/:id" render={({ match }) => <ModifyStaffForm staffId={match.params.id} />} />

        {/* Staff routes */}
        <Route
          path="/staff/*"
          element={<PrivateRoute roles={["staff"]} element={<CenteredContent><StaffDashboard /></CenteredContent>} />}
        />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/create-leave-request" element={<LeaveRequestForm />} />
        <Route path="/staff/leave-request-list" element={<StaffLeaveRequestList />} />
        <Route path="/staff/mission-list" element={<StaffMissionsList />} />
        <Route path="/staff/personal-info" element={<StaffPersonalInfo/>} />

        {/* Catch-all route for unknown paths - Redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
};

export default App;