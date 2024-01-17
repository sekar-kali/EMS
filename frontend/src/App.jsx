// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import AdminRoutes from './routes/AdminRoutes';
import StaffRoutes from './routes/StaffRoutes';
import AuthRoutes from './routes/AuthRoutes';

const PrivateRoute = ({ element: Element, roles, ...rest }) => {
  const authToken = localStorage.getItem('authToken');

  return authToken ? <Element /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          {/* For Staff */}
          <Route
            path="/staff/*"
            element={<PrivateRoute roles={["staff"]} element={<StaffRoutes />} />}
          />

          {/* For Admin */}
          <Route
            path="/admin/*"
            element={<PrivateRoute roles={["admin"]} element={<AdminRoutes />} />}
          />

          {/* For Admin and Staff */}
          <Route
            path="/"
            element={
              <PrivateRoute
                roles={["admin", "staff"]}
                element={
                  <>
                    {/* Use AuthRoutes for login and signup */}
                    <Route path="/auth/*" element={<AuthRoutes />} />
                  </>
                }
              />
            }
          />
        </Routes>
      </Router>
      <Footer />
    </>
  );
};

export default App;
