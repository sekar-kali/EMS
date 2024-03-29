import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../menu.css';
import logoImage from '../assets/logo.png';

const MenuStaff = () => {
  const [isSidebarClosed, setSidebarClosed] = useState( true);
  const [activeItem, setActiveItem] = useState(null);

  const handleListItemClick = (index) => {
    setActiveItem(index === activeItem ? null : index);
  };

  const handleToggleSidebar = () => {
    setSidebarClosed(!isSidebarClosed);
  };

  const listItems = [
    {
      label: 'Dashboard',
      iconClass: 'bx bx-grid-alt',
      submenu: [{ label: 'Staff Dashboard', to: '/staff/dashboard' }],
    },
    {
      label: 'Missions',
      iconClass: 'bx bx-briefcase',
      submenu: [{ label: 'Missions List', to: '/staff/mission-list' }],
    },
    {
      label: 'Leaves',
      iconClass: 'bx bx-book-alt',
      submenu: [
        { label: 'Leave Request List', to: '/staff/leave-request-list' },
        { label: 'Create Leave Request', to: '/staff/create-leave-request' },
      ],
    },
    {
      label: 'Settings',
      iconClass: 'bx bxs-cog',
      submenu: [{ label: 'Profile', to: '/staff/personal-info' }],
    },
    {
      label: 'Logout',
      iconClass: 'bx bx-log-out',
      submenu: [{ label: 'Logout', to: '/auth/logout' }],
    },
  ];

  return (
    <main className={`toggle-sidebar sidebar ${isSidebarClosed ? 'close' : ''}`}>
      <section className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
        <aside className="sidebar-header" onClick={handleToggleSidebar}>
          <i className={`bx ${isSidebarClosed ? 'bx-menu' : 'bx-chevron-left'}`}></i>
        </aside>
        <aside className="logo-box">
          <img src={logoImage} alt="logo-EMS" />
          <p className="logo-name">EMS</p>
        </aside>
        <ul className="sidebar-list">
          {listItems.map((item, index) => (
            <li key={index} className={index === activeItem ? 'active' : ''}>
              <article className="title" onClick={() => handleListItemClick(index)}>
                <aside className="link">
                  <i className={item.iconClass}></i>
                  <span className="name">{item.label}</span>
                </aside>
                {item.submenu && <i className='bx bxs-chevron-down'></i>}
              </article>
              {item.submenu && (
                <article className={`submenu ${index === activeItem ? 'active' : ''}`}>
                  {item.submenu.map((subItem, subIndex) => (
                    <span key={subIndex} className="link submenu-title">
                      <Link to={subItem.to} className="link">
                        {subItem.label}
                      </Link>
                    </span>
                  ))}
                </article>
              )}
            </li>
          ))}
          <p className='footer'>&copy; 2024 - Employee Management System</p>
        </ul>
      </section> 
    </main>
  );
};

export default MenuStaff;
