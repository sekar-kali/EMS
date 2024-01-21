import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';
import LeaveRequestForm from './LeaveRequestForm';
import '../../menu.css';
import '../../styles.css';

const StaffDashboard = () => {
  const [staffInfo, setStaffInfo] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    // Fetch staff's information
    const fetchStaffInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/staff/info/:email');
        if (response.ok) {
          const staffInfoData = await response.json();
          setStaffInfo(staffInfoData);
        } else {
          console.error('Error fetching staff information:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching staff information:', error.message);
      }
    };

    fetchStaffInfo();
  }, []);

  return (
    <>
      <Header />
      <MenuStaff/>
      
      <div className="main-container">
        <h1>Staff Dashboard</h1>
        <p>Welcome, {staffInfo.firstName} {staffInfo.lastName}!</p>
      </div>
      
      <Footer />
    </>
  );
};

export default StaffDashboard;
