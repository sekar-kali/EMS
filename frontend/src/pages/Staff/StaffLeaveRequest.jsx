import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';

const StaffLeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    // Fetch staff's leave requests
    const authToken = localStorage.getItem('authToken');
    const fetchStaffLeaveRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/staff/leave-requests', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
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
    if (statusFilter === 'All') {
      setFilteredLeaveRequests(leaveRequests);
    } else {
      const filtered = leaveRequests.filter((request) => request.status === statusFilter);
      setFilteredLeaveRequests(filtered);
    }
  }, [statusFilter, leaveRequests]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  return (
    <>
      <MenuStaff />
      <div className="main-container">
      <div className="leave-request-list">
        <h1>Leave Request List</h1>

        <div className="filter-bar">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select id="statusFilter" onChange={handleStatusFilterChange} value={statusFilter}>
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className='leave-request-list'>
          <table>
            <thead>
              <tr>
                <th>Leave starting date</th>
                <th>Leave ending date</th>
                <th>Status</th>
                </tr>
              </thead>
            <tbody>
          {filteredLeaveRequests.map((request) => (
            <tr key={request._id}>
              <td>{formatDate(request.startDate)}</td>
               <td>{formatDate(request.endDate)}</td>
               <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
          </table>
          </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffLeaveRequestList;
