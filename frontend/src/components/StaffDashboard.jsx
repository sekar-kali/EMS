import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';
import LeaveRequestForm from './LeaveRequestForm';
import '../menu.css';
import '../styles.css';

const StaffDashboard = () => {
  const [staffInfo, setStaffInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    serviceName: '',
  });

  useEffect(() => {
    // Fetch staff's information
    fetch('/api/staff/info')
      .then((response) => response.json())
      .then((data) => setStaffInfo(data))
      .catch((error) => console.error('Error fetching staff information:', error));
  }, []);

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
    // Fetch staff's missions and leave requests
    const fetchStaffData = async () => {
      try {
        const missionsResponse = await fetch('/api/staff/missions');
        const leaveRequestsResponse = await fetch('/api/staff/leaveRequests');

        if (!missionsResponse.ok || !leaveRequestsResponse.ok) {
          console.error('Error fetching missions or leave requests');
          return;
        }

        const missionsData = await missionsResponse.json();
        const leaveRequestsData = await leaveRequestsResponse.json();

        setMissions(missionsData);
        setLeaveRequests(leaveRequestsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStaffData();
  }, []);

  const handleLeaveRequestSubmit = async () => {
    try {
      // Validate leave request form fields
      if (!leaveRequestForm.startDate || !leaveRequestForm.endDate) {
        console.error('Please fill in all leave request fields.');
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

  const filterStaffMissions = (mission) => mission.staffId === staffInfo._id;

  const upcomingMissions = Array.isArray(missions)
    ? missions.filter((mission) => filterStaffMissions(mission) && new Date(mission.startDate) > new Date())
    : [];

  const pastMissions = Array.isArray(missions)
    ? missions.filter((mission) => filterStaffMissions(mission) && new Date(mission.endDate) < new Date())
    : [];

  const leaveRequestItems = Array.isArray(leaveRequests)
    ? leaveRequests.map((request) => (
        <li key={request._id}>
          {request.startDate} to {request.endDate}
          Status: {request.status}
        </li>
      ))
    : null;

  return (
    <>
      <Header />
      <Menu />
      
      <div className="dashboard">
        <h1>Staff Dashboard</h1>
        <p>Welcome, {staffInfo.firstName}!</p>

        <div className="personal-info">
          <h2>Personal Information</h2>
          <p>First Name: {staffInfo.firstName}</p>
          <p>Last Name: {staffInfo.lastName}</p>
          <p>Email: {staffInfo.email}</p>
          <p>Service Name: {staffInfo.serviceName}</p>
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
          <ul>{leaveRequestItems}</ul>
        </div>

        <div className="leave-request-form">
          <h2>Create Leave Request</h2>
          <LeaveRequestForm
            leaveRequestForm={leaveRequestForm}
            setLeaveRequestForm={setLeaveRequestForm}
            handleLeaveRequestSubmit={handleLeaveRequestSubmit}
          />
        </div>

        <Link to="/leave-request-form">Open Leave Request Form</Link>

        <div className="change-details-form">
          <h2>Change Personal Details Request</h2>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default StaffDashboard;
