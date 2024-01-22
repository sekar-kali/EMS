// MenuAdmin.js
import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import logoImage from '../logo.png';

const MenuAdmin = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  

  return (
    <div className={`toggle-sidebar sidebar ${isSidebarOpen ? '' : 'close'}`}>
      <div className={`sidebar ${isSidebarOpen ? '' : 'close'}`}>
        <div className="sidebar-header" onClick={toggleSidebar}>
          <i className={`bx ${isSidebarOpen ? 'bx-chevron-left' : 'bx-menu'}`}></i>
        </div>
        <div className="logo-box">
          <img src={logoImage} alt="logo-EMS" />
          <p className="logo-name">EMS</p>
        </div>

        <ul className="sidebar-list">
        <li>
                <div className="title">
                    <div className="link">
                        <i className='bx bx-grid-alt'></i>
                        <span className="name">Dashboard</span>
                    </div>
                </div>
                <div className="submenu">
                    <Link to={`/admin/dashboard`} className="link submenu-title">Admin Dashboard</Link>
                </div>
            </li>

            <li className="dropdown">
                <div className="title">
                    <div className="link">
                        <i className='bx bx-briefcase'></i>
                        <span className="name">Missions</span>
                    </div>
                    <i className='bx bxs-chevron-down'></i>
                </div>
                <div className="submenu">
                    <span className="link submenu-title">Missions</span>
                  <Link to={`/admin/missions-list`} className='link'>Missions List</Link>
                  <Link to={`/admin/create-mission`} className='link'>Create Mission</Link>
                </div>
            </li>

            <li className="dropdown">
                <div className="title">
                    <div className="link">
                        <i className='bx bx-book-alt'></i>
                        <span className="name">Leave Request</span>
                    </div>
                    <i className='bx bxs-chevron-down'></i>
                </div>
                <div className="submenu">
                <span className="link submenu-title">Leave Request</span>
                <Link to={`/admin/leave-request`} className='link'>Leave Request List</Link>
                </div>
            </li>

            <li>
                <div className="title">
                    <div className="link">
                        <i className='bx bx-line-chart'></i>
                        <span className="name">Staff List</span>
                    </div>
                    <i className='bx bxs-chevron-down'></i>
                </div>
                < div className="submenu">
                    <span className="link submenu-title">Staff List</span>
                    <Link to={`/admin/staff-list`} className='link'>Staff List</Link>
                    <Link to={`/admin/create-staff`} className='link'>Create Staff</Link>
                </div>
            </li>

            <li>
                <div className="title">
                    <div className="link">
                        <i className='bx bx-log-out'></i>
                        <span className="name">Logout</span>
                    </div>
                </div>
                <div className="submenu">
                    <Link to="/auth/logout" className='link'>Logout</Link>
                </div>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuAdmin;
