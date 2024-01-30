import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';
import '../../menu.css';
import '../../styles.css';

const StaffDashboard = () => {
  const [staffInfo, setStaffInfo] = useState({
    firstName: '',
    lastName: '',
    email: '', 
  });

  const [totalMissions, setTotalMissions] = useState(0);
  const [approvedLeaveRequests, setApprovedLeaveRequests] = useState(0);

  useEffect(() => {
    // Fetch staff's information
    const authToken = localStorage.getItem('authToken');
    const email = JSON.parse(localStorage.getItem('user'));
    const fetchStaffInfo = async () => {
      try {
        // Use template literal to include the email in the URL
        const response = await fetch(`http://localhost:5000/api/staff/info/${email}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const staffInfoData = await response.json();
          setStaffInfo(staffInfoData);
        } else {
          console.log('Error fetching staff information:', response.statusText);
        }
      } catch (error) {
        console.log('Error fetching staff information:', error.message);
      }
    };

    // Fetch total missions for the current month
    const fetchTotalMissions = async () => {
      
      const response = await fetch('http://localhost:5000/api/staff/missions/total', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        body: JSON.stringify({
          staffEmail: email, 
          
        }),
      });

      if (response.ok) {
        const totalMissionsData = await response.json();
        setTotalMissions(totalMissionsData.total);
      } else {
        console.log('Error fetching total missions:', response.statusText);
      }
    };

    // Fetch total approved leave requests for the current month
    const fetchApprovedLeaveRequests = async () => {
    
      const response = await fetch('http://localhost:5000/api/staff/leave-requests/approved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          staffEmail: email,
          
        }),
      });

      if (response.ok) {
        const approvedLeaveRequestsData = await response.json();
        setApprovedLeaveRequests(approvedLeaveRequestsData.total);
      } else {
        console.log('Error fetching approved leave requests:', response.statusText);
      }
    };

    fetchStaffInfo();
    fetchTotalMissions();
    fetchApprovedLeaveRequests();
  }, []);

  return (
    <>
      <MenuStaff />
      <main className="main-container fade-in">
        <h1>Staff Dashboard</h1>
        
        <section className="dashboard-stats">

          <article className="dashboard-mission-stat">
          <h2>Total Missions for the Current Month</h2>
            <p>{totalMissions}</p>
          </article>
          
          <article className="dashboard-leave-stat">
          <h2>Total Approved Leave Requests for the Current Month</h2>
            <p>{approvedLeaveRequests}</p>
          </article>
        </section>
        <section className="dashboard-welcome">
            <h2 className='bounce-in'>Welcome {staffInfo.firstName} {staffInfo.lastName}</h2>
            <iframe width="360" height="215" src="https://www.youtube-nocookie.com/embed/kcckpWgkhP0?si=C8MV0Dl8CuBJq7V9&amp;start=30" title="YouTube video player" autoPlay allowFullScreen></iframe>
          </section>
      </main>
    </>
  );
};

export default StaffDashboard;
