import React from 'react';
import '../menu.css';
import { Link } from 'react-router-dom';

const MenuStaff = ({ role }) => {
  return (
    <div className="menu-staff">
      <ul>
        <li><Link to={`/staff/dashboard`}>Dashboard</Link></li>
        <li><Link to={`/staff/missions`}>Missions</Link></li>
        <li><Link to={`/staff/leave-request`}>Leave Request</Link></li>
        <li><Link to="/auth/login">Logout</Link></li>
      </ul>
    </div>
  );
};

export default MenuStaff;

