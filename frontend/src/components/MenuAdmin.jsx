// MenuAdmin.jsx
import React, { useState } from 'react';
import '../menu.css';
import { Link } from 'react-router-dom';
import Header from './Header';

const MenuAdmin = ({ role }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  return (
    <>
    <Header />
    <div className="menu-admin">
      <ul>
        <span onClick={() => handleSubMenuToggle('leaveRequest')}><li><Link to={`/admin/dashboard`}>Dashboard</Link></li></span>
        <ul>
        <li>
          <span onClick={() => handleSubMenuToggle('missions')}>
            Missions
          </span>
          <ul className={openSubMenu === 'missions' ? 'sub-menu-open' : 'sub-menu-closed'}>
            <li><Link to={`/admin/missions-list`}>Missions List</Link></li>
            <li><Link to={`/admin/create-mission`}>Create Mission</Link></li>
          </ul>
        </li>

        <li>
          <span onClick={() => handleSubMenuToggle('leaveRequest')}>
            Leave Request
          </span>
          <ul className={openSubMenu === 'leaveRequest' ? 'sub-menu-open' : 'sub-menu-closed'}>
            <li><Link to={`/admin/leave-request`}>Leave Request List</Link></li>
          </ul>
        </li>

        <li>
          <span onClick={() => handleSubMenuToggle('staffList')}>
            Staff List
          </span>
          <ul className={openSubMenu === 'staffList' ? 'sub-menu-open' : 'sub-menu-closed'}>
            <li><Link to={`/admin/staff-list`}>Staff List</Link></li>
            <li><Link to={`/admin/create-staff`}>Create Staff</Link></li>
          </ul>
        </li>
      </ul>
      <li><Link to="/auth/login">Logout</Link></li>
      </ul>
    </div>
    </>
  );
};

export default MenuAdmin;
