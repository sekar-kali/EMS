import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';
import LeaveRequestForm from './LeaveRequestForm';
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
    const fetchStaffInfo = async () => {
      try {
        // Use template literal to include the email in the URL
        const response = await fetch(`http://localhost:5000/api/staff/info/${staffInfo.email}`, {
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
          console.error('Error fetching staff information:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching staff information:', error.message);
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
          staffEmail: staffInfo.email, 
          
        }),
      });

      if (response.ok) {
        const totalMissionsData = await response.json();
        setTotalMissions(totalMissionsData.total);
      } else {
        console.error('Error fetching total missions:', response.statusText);
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
          staffEmail: staffInfo.email,
          
        }),
      });

      if (response.ok) {
        const approvedLeaveRequestsData = await response.json();
        setApprovedLeaveRequests(approvedLeaveRequestsData.total);
      } else {
        console.error('Error fetching approved leave requests:', response.statusText);
      }
    };

    fetchStaffInfo();
    fetchTotalMissions();
    fetchApprovedLeaveRequests();
  }, []);

  return (
    <>
      <MenuStaff />
      <div className="main-container">
        <h1>Staff Dashboard</h1>
        
        <div className="dashboard-stats">

          <div className="dashboard-mission-stat">
          <h2>Total Missions for the Current Month</h2>
            <p>{totalMissions}</p>
          </div>
          
          <div className="dashboard-leave-stat">
          <h2>Total Approved Leave Requests for the Current Month</h2>
            <p>{approvedLeaveRequests}</p>
          </div>
        </div>
        <div className="dashboard-welcome">
            <h2>Welcome {staffInfo.firstName} {staffInfo.lastName} {staffInfo.email}</h2>
          </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffDashboard;
