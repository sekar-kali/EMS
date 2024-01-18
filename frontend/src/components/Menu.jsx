import React from 'react';
import '../menu.css';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div className="menu">
    <ul>
      <li><Link to="#">Missions</Link></li>
      <li><Link to="#">Leave Request</Link></li>
      <li><Link to="#">Staff List</Link></li>
      <li><Link to="#">Logout</Link></li>
    </ul>
    </div>
  );
};

export default Menu;
