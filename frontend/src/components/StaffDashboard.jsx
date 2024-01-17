import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LeaveRequestForm from './LeaveRequestForm';

const StaffDashboard = () => {
    const [staffInfo, setStaffInfo] = useState({
      // Include properties like name, email, position, etc.
    });
  
    const [missions, setMissions] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [leaveRequestForm, setLeaveRequestForm] = useState({
      startDate: '',
      endDate: '',
    });
  
    const [changeDetailsForm, setChangeDetailsForm] = useState({
      newFirstName: '',
      newLastName: '',
    });
  
    useEffect(() => {
      // Fetch staff's information
      fetch('/api/staff/info')
        .then((response) => response.json())
        .then((data) => setStaffInfo(data))
        .catch((error) => console.error('Error fetching staff information:', error));
  
      // Fetch staff's missions
      fetch('/api/staff/missions')
        .then((response) => response.json())
        .then((data) => setMissions(data))
        .catch((error) => console.error('Error fetching missions:', error));
  
      // Fetch staff's leave requests
      fetch('/api/staff/leaveRequests')
        .then((response) => response.json())
        .then((data) => setLeaveRequests(data))
        .catch((error) => console.error('Error fetching leave requests:', error));
    }, []);

  const handleLeaveRequestSubmit = async () => {
    try {
      // Validate leave request form fields
      if (!leaveRequestForm.startDate || !leaveRequestForm.endDate) {
        console.error('Please fill in all leave request fields.');
        // Update the missions and leave requests state after successful submission
    setMissions([...missions, /* newly created mission */]);
    setLeaveRequests([...leaveRequests, /* newly created leave request */]);
        return;
        
      }

      // Send leave request to the backend for processing
      const response = await fetch('/api/staff/createLeaveRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveRequestForm),
      });

      if (response.ok) {
        console.log('Leave request created successfully!');
        // Reset the form after successful submission
        setLeaveRequestForm({
          startDate: '',
          endDate: '',
        });
      } else {
        const data = await response.json();
        console.error('Leave request creation failed:', data.message);
      }
    } catch (error) {
      console.error('Error during leave request creation:', error.message);
    }
  };

  const handleChangeDetailsRequest = async () => {
    try {
      // Validate change details request form fields
      if (!changeDetailsForm.newFirstName || !changeDetailsForm.newLastName) {
        console.error('Please fill in all change details request fields.');
        return;
      }

      // Send change details request to the backend for processing
      const response = await fetch('/api/staff/changeDetailsRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changeDetailsForm),
      });

      if (response.ok) {
        console.log('Change details request submitted successfully!');
        // Reset the form after successful submission
        setChangeDetailsForm({
          newFirstName: '',
          newLastName: '',
        });
      } else {
        const data = await response.json();
        console.error('Change details request submission failed:', data.message);
      }
    } catch (error) {
      console.error('Error during change details request submission:', error.message);
    }
  };

  const filterStaffMissions = (mission) => {
    
    return mission.staffId === staffInfo._id;
  };
  const upcomingMissions = missions.filter(
    (mission) => filterStaffMissions(mission) && new Date(mission.startDate) > new Date()
  );

  const pastMissions = missions.filter(
    (mission) => filterStaffMissions(mission) && new Date(mission.endDate) < new Date()
  );

  return (
    <div className="dashboard">
      <h1>Staff Dashboard</h1>
      <p>Welcome, {staffInfo.name}!</p>

      
      <div className="personal-info">
        <h2>Personal Information</h2>
        <p>Name: {staffInfo.name}</p>
        <p>Email: {staffInfo.email}</p>
        <p>Position: {staffInfo.position}</p>
        <button onClick={handleChangeDetailsRequest}>Request Change in Details</button>
      </div>

      <div className="upcoming-missions">
        <h2>Upcoming Missions</h2>
        <ul>
          {upcomingMissions.map((mission) => (
            <li key={mission._id}>
              {mission.title} - {mission.description}
             
            </li>
          ))}
        </ul>
      </div>

      <div className="past-missions">
        <h2>Past Missions</h2>
        <ul>
          {pastMissions.map((mission) => (
            <li key={mission._id}>
              {mission.title} - {mission.description}
              
            </li>
          ))}
        </ul>
      </div>
      
      <div className="leave-requests">
        <h2>Leave Requests</h2>
        <ul>
          {leaveRequests.map((request) => (
            <li key={request._id}>
              {request.startDate} to {request.endDate}
              Status: {request.status}
             
            </li>
          ))}
        </ul>
      </div>

      <div className="leave-request-form">
        <h2>Create Leave Request</h2>
        <LeaveRequestForm handleLeaveRequestSubmit={handleLeaveRequestSubmit} />
      </div>

      <Link to="/leave-request-form">Open Leave Request Form</Link>

      <div className="change-details-form">
        <h2>Change Personal Details Request</h2>
        
      </div>

    </div>
  );
};

export default StaffDashboard;
