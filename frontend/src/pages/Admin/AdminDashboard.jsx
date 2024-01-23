import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';

const AdminDashboard = () => {
  // State to store dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalStaff: 0,
    newStaffThisMonth: 0,
    totalMissionsThisMonth: 0,
    staffOnLeaveThisMonth: 0,
  });

  useEffect(() => {
    // Fetch dashboard statistics from the backend
    const fetchDashboardStats = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching dashboard statistics');
        }

        const data = await response.json();
        setDashboardStats(data);
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <>
      <MenuAdmin />
      <div className="main-container">
        <h1>Admin Dashboard</h1>
        
        <div className="dashboard-stats">
          <div className="dashboard-total-staff-stat">
            <h2>Total Staff</h2>
            <p>{dashboardStats.totalStaff}</p>
          </div>
          
          <div className="dashboard-staff-month-stat">
            <h2>New Staff This Month</h2>
            <p>{dashboardStats.newStaffThisMonth}</p>
          </div>
          
          <div className="dashboard-mission-stat">
            <h2>Total Missions This Month</h2>
            <p>{dashboardStats.totalMissionsThisMonth}</p>
          </div>
          
          <div className="dashboard-leave-stat">
            <h2>Staff On Leave This Month</h2>
            <p>{dashboardStats.staffOnLeaveThisMonth}</p>
          </div>
        </div>
        <div className="dashboard-welcome">
            <h2>Welcome ADMIN</h2>
          </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
