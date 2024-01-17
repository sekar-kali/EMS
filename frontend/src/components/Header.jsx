import React from 'react';
import logoImage from '../logo.png';
import "../Header.css"

const Header = () => {
  return (
    <header className="header-container">
      <div className="logo">
                      <img src={logoImage} alt="logo-EMS" />
        </div>
      <p>EMS</p>
    </header>
  );
};

export default Header;
