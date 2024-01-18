import React from 'react';
import '../menu.css';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div className="menu">
    <ul>
      <li><Link to="#">Missions</Link></li>
      <li>Leave Request</li>
      <li>Staff List</li>
      <li>Logout</li>
    </ul>
    </div>
  );
};

export default Menu;
