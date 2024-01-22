import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Logout from '../pages/Auth/Logout';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default AuthRoutes;
