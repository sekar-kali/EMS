import React, { useState } from 'react';
import '../menu.css';
import { Link} from 'react-router-dom';
import logoImage from '../logo.png';

const MenuStaff = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? '' : menu);
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
            <div className="title" onClick={() => handleSubMenuToggle('dashboard')}>
              <div className="link">
                <i className='bx bx-grid-alt'></i>
                <span className="name">Dashboard</span>
              </div>
              <i className={`bx bxs-chevron-down ${openSubMenu === 'dashboard' ? 'rotate' : ''}`}></i>
            </div>
            <div className="submenu">
              <Link to={`/staff/dashboard`} className="link submenu-title">Staff Dashboard</Link>
              </div>
          </li>

            <li className="dropdown">
                <div className="title">
                    <div className="link">
                        <i className='bx bx-collection'></i>
                        <span className="name">Missions</span>
                    </div>
                    <i className='bx bxs-chevron-down'></i>
                </div>
                <div className="submenu">
                    <span className="link submenu-title">Missions</span>
                    <Link to={`/staff/mission-list`} className='link'>Missions List</Link>
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
                <Link to={`/staff/leave-request-list`} className='link'>Leave Request List</Link>
                <Link to={`/staff/create-leave-request`} className='link'>Create Leave Request</Link>
                </div>
            </li>

            <li>
                <div className="title">
                    <div className="link">
                        <i className='bx bxs-user-detail'></i>
                        <span className="name">Personal Info</span>
                    </div>
                    <i className='bx bxs-chevron-down'></i>
                </div>
                < div className="submenu">
                    <span className="link submenu-title">Personal Info</span>
                    <Link to={`/staff/personal-info`} className='link'>My Info</Link>
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

export default MenuStaff;

