import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StaffDashboard from './pages/Staff/StaffDashboard';
import MissionList from './pages/Admin/MissionList';
import LeaveRequestForm from './pages/Staff/LeaveRequestForm';
import StaffList from './pages/Admin/StaffList';
import CreateMission from './pages/Admin/CreateMission';
import CreateStaff from './pages/Admin/CreateStaff';
import LeaveRequestList from './pages/Admin/LeaveRequestList';
import Logout from './pages/Auth/Logout';
import StaffPersonalInfo from './pages/Staff/StaffProfile';
import StaffMissionsList from './pages/Staff/StaffMissionsList';
import StaffLeaveRequestList from './pages/Staff/StaffLeaveRequest';
import ModifyStaffForm from './pages/Admin/ModifyStaffForm';
import CreatePasswordPage from './pages/Auth/CreatePassword';
import AdminProfile from './pages/Admin/AdminProfile';
import ResetPassword from './pages/Auth/ResetPassword';
import ForgotPassword from './pages/Auth/ForgotPassword';
import TermsAndConditions from './pages/Auth/TermsAndConditions';

const PrivateRoute = ({ element }) => {
  const authToken = localStorage.getItem('authToken');
  const authTokenExpiration = localStorage.getItem('authTokenExpiration');

  // Checking if the token is present and not expired
  if (authToken && authTokenExpiration && new Date(authTokenExpiration) > new Date()) {
    return element;
  } else {
    // Token is expired or not present, redirect to login
    return <Navigate to="/auth/login" />;
  }
};

// const CenteredContent = ({ children }) => {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       {children}
//     </div>
//   );
// };

const App = () => {

  return (
    <Router>
      <Routes>
        {/* Default route - Redirect to login */}
        <Route path="/" element={<Navigate to="/auth/login" />} />
       
        {/* Auth routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/logout" element={<Logout />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-password/:email" component={CreatePasswordPage} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={<PrivateRoute roles={["admin"]} element={<AdminDashboard />} />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-mission" element={<CreateMission />} />
        <Route path="/admin/missions-list" element={<MissionList />} />
        <Route path="/admin/leave-request-list" element={<LeaveRequestList />} />
        <Route path="/admin/staff-list" element={<StaffList />} />
        <Route path="/admin/create-staff" element={<CreateStaff />} />
        <Route path="/update-staff/:staffId" element={<ModifyStaffForm />} />
        <Route path="/admin/profile" element={<AdminProfile/>} />

        {/* Staff routes */}
        <Route
          path="/staff/*"
          element={<PrivateRoute roles={["staff"]} element={<StaffDashboard />} />}
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