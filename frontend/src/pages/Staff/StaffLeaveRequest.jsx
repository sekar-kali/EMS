import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';

const StaffLeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Fetch staff's leave requests
    const fetchStaffLeaveRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/staff/leave-requests');
        if (response.ok) {
          const leaveRequestsData = await response.json();
          setLeaveRequests(leaveRequestsData);
          setFilteredLeaveRequests(leaveRequestsData);
        } else {
          console.error('Error fetching staff leave requests:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching staff leave requests:', error.message);
      }
    };

    fetchStaffLeaveRequests();
  }, []);

  // Apply status filter
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredLeaveRequests(leaveRequests);
    } else {
      const filtered = leaveRequests.filter((request) => request.status === statusFilter);
      setFilteredLeaveRequests(filtered);
    }
  }, [statusFilter, leaveRequests]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <>
      <MenuStaff />
      <div className="main-container">
      <div className="leave-request-list">
        <h1>Staff Leave Request List</h1>

        <div className="filter-bar">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select id="statusFilter" onChange={handleStatusFilterChange} value={statusFilter}>
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <ul>
          {filteredLeaveRequests.map((request) => (
            <li key={request._id}>
              {request.startDate} to {request.endDate} - Status: {request.status}
            </li>
          ))}
        </ul>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffLeaveRequestList;
