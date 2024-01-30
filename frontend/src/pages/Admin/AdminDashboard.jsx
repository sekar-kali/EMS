import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';
import '../../styles.css';

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
        console.log('Error fetching dashboard statistics:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <>
      <MenuAdmin />
      <main className="main-container fade-in">
        <h1>Admin Dashboard</h1>

        <section className="dashboard-stats">
          <article className="dashboard-total-staff-stat">
            <h2>Total Staff</h2>
            <p>{dashboardStats.totalStaff}</p>
          </article>

          <article className="dashboard-staff-month-stat">
            <h2>New Staff This Month</h2>
            <p>{dashboardStats.newStaffThisMonth}</p>
          </article>

          <article className="dashboard-mission-stat">
            <h2>Total Missions This Month</h2>
            <p>{dashboardStats.totalMissionsThisMonth}</p>
          </article>

          <article className="dashboard-leave-stat">
            <h2>Staff On Leave This Month</h2>
            <p>{dashboardStats.staffOnLeaveThisMonth}</p>
          </article>
        </section>
        <article className="dashboard-welcome">
          <h2 className='bounce-in'>Welcome ADMIN</h2>
        </article>
      </main>
    </>
  );
};

export default AdminDashboard;
