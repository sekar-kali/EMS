import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';
import '../menu.css';
import '../styles.css';

const AdminDashboard = () => {
  const [staffList, setStaffList] = useState([]);
  const [missions, setMissions] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [staffDetails, setStaffDetails] = useState({
    email: '',
    firstName: '',
    lastName: '',
    serviceName: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCreateStaff = async () => {
    try {
      // Validate staff details
      if (!staffDetails.email || !staffDetails.firstName || !staffDetails.lastName || !staffDetails.position) {
        console.error('Please fill in all staff details.');
        return;
      }

      // Send a request to the backend to create a new staff account
      const response = await fetch('/api/admin/createStaff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffDetails),
      });

      if (response.ok) {
        console.log('Staff account created successfully!');
        // Reset the form after successful submission
        setStaffDetails({
          email: '',
          firstName: '',
          lastName: '',
          position: '',
        });
      } else {
        const data = await response.json();
        console.error('Staff account creation failed:', data.message);
      }
    } catch (error) {
      console.error('Error during staff account creation:', error.message);
    }
  };
  
  useEffect(() => {
    // Fetch staff list
    fetch('/api/admin/staffList')
      .then((response) => response.json())
      .then((data) => setStaffList(data))
      .catch((error) => console.error('Error fetching staff list:', error));

    // Fetch missions
    fetch('/api/admin/missions')
      .then((response) => response.json())
      .then((data) => setMissions(data))
      .catch((error) => console.error('Error fetching missions:', error));

    // Fetch leave requests
    fetch('/api/admin/leaveRequests')
      .then((response) => response.json())
      .then((data) => setLeaveRequests(data))
      .catch((error) => console.error('Error fetching leave requests:', error));
  }, []);

  const handleLeaveRequestApproval = (leaveRequestId, status) => {
    // Send request to update leave request status
    fetch(`/api/admin/approveLeaveRequest/${leaveRequestId}/${status}`, {
      method: 'PUT',
    })
      .then((response) => response.json())
      .then((data) => {
        // Update leaveRequests state after approval/rejection
        setLeaveRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === leaveRequestId ? { ...request, status: data.status } : request
          )
        );
      })
      .catch((error) => console.error('Error updating leave request status:', error));
  };


  return (
    <>
      <Header />
      <Menu />

      <div className="dashboard">
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin!</p>

        <div className="staff-list">
          <h2>Staff Members</h2>
          <ul>
            {staffList && staffList.map((staff) => (
              <li key={staff._id}>
                {staff.name} - {staff.position}
              </li>
            ))}
          </ul>
        </div>
      <div className="create-staff-form">
        <h2>Create Staff Account</h2>
        <label>Email:</label>
        <input type="email" name="email" value={staffDetails.email} onChange={handleInputChange} />
        <label>First Name:</label>
        <input type="text" name="firstName" value={staffDetails.firstName} onChange={handleInputChange} />
        <label>Last Name:</label>
        <input type="text" name="lastName" value={staffDetails.lastName} onChange={handleInputChange} />
        <label>Position:</label>
        <input type="text" name="position" value={staffDetails.position} onChange={handleInputChange} />
        <button onClick={handleCreateStaff}>Create Staff Account</button>
      </div>
      <div className="missions">
          <h2>Missions</h2>
          <ul>
            {missions && missions.map((mission) => (
              <li key={mission._id}>
                {mission.title} - {mission.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="leave-requests">
          <h2>Leave Requests</h2>
          <ul>
            {leaveRequests && leaveRequests.map((request) => (
              <li key={request._id}>
                {request.staffName} - {request.startDate} to {request.endDate}
                Status: {request.status}
                {request.status === 'pending' && (
                  <>
                    <button onClick={() => handleLeaveRequestApproval(request._id, 'approved')}>
                      Approve
                    </button>
                    <button onClick={() => handleLeaveRequestApproval(request._id, 'rejected')}>
                      Reject
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;