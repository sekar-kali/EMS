import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../menu.css';
import '../styles.css';
import MenuAdmin from '../components/MenuAdmin';
import jwt from 'jsonwebtoken';

const AdminDashboard = () => {

  return (
    <>
      <Header />
      <MenuAdmin/>
      <div div className="main-container">
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin !</p>
        </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;