import React, { useState } from 'react';
import '../menu.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

const MenuStaff = ({ role }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  return (
    <>
    <Header />
    <div className="menu-staff">
      <ul>
        <span onClick={() => handleSubMenuToggle('dashboard')}><li><Link to={`/staff/dashboard`}>Staff Dashboard</Link></li></span>
        <ul>
        <li>
          <span onClick={() => handleSubMenuToggle('missions')}>
            Missions
          </span>
          <ul className={openSubMenu === 'missions' ? 'sub-menu-open' : 'sub-menu-closed'}>
            <li><Link to={`/staff/mission-list`}>Missions List</Link></li>
          </ul>
        </li>

        <li>
          <span onClick={() => handleSubMenuToggle('leaveRequest')}>
            Leave Request
          </span>
          <ul className={openSubMenu === 'leaveRequest' ? 'sub-menu-open' : 'sub-menu-closed'}>
            <li><Link to={`/staff/leave-request-list`}>Leave Request List</Link></li>
            <li><Link to={`/staff/create-leave-request`}>Create Leave Request</Link></li>
          </ul>
        </li>

        <li>
          <span onClick={() => handleSubMenuToggle('info')}>
           Personal Info
          </span>
          <ul className={openSubMenu === 'info' ? 'sub-menu-open' : 'sub-menu-closed'}>
            <li><Link to={`/staff/personal-info`}>My Info</Link></li>
          </ul>
        </li>
      </ul>
      <li><Link to="/auth/logout">Logout</Link></li>
      </ul>
    </div>
    </>
  );
};

export default MenuStaff;

