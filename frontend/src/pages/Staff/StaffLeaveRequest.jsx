import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';

const StaffLeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const staffLeaveRequestPerPage = 10;

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const email = JSON.parse(localStorage.getItem('user'));

    const fetchStaffLeaveRequests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/staff/leave-requests/${email}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const leaveRequestsData = await response.json();
          setLeaveRequests(leaveRequestsData || []); // Ensure it's an array, or default to an empty array
          setFilteredLeaveRequests(leaveRequestsData || []); // Ensure it's an array, or default to an empty array
        } else {
          console.log('Error fetching staff leave requests:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching staff leave requests:', error.message);
      }
    };

    fetchStaffLeaveRequests();
  }, []);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredLeaveRequests(leaveRequests);
    } else {
      const filtered = Array.isArray(leaveRequests)
        ? leaveRequests.filter((request) => request.status === statusFilter)
        : [];
      setFilteredLeaveRequests(filtered);
    }
    setCurrentPage(1);
  }, [statusFilter, leaveRequests]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const formatDate = (date) => moment(date).format('DD/MM/YYYY');

// Pagination
const indexOfLastStaffLeaveRequest = currentPage * staffLeaveRequestPerPage;
const indexOfFirstStaffLeaveRequest = indexOfLastStaffLeaveRequest - staffLeaveRequestPerPage;


const currentStaffLeaveRequestList = Array.isArray(filteredLeaveRequests)
  ? filteredLeaveRequests.slice(indexOfFirstStaffLeaveRequest, indexOfLastStaffLeaveRequest)
  : [];

const renderStaffLeaveRequestList = currentStaffLeaveRequestList.map((request, index) => (
  <tr key={request._id}>
    <td>{indexOfFirstStaffLeaveRequest + index + 1}</td>
    <td>{formatDate(request.startDate)}</td>
    <td>{formatDate(request.endDate)}</td>
    <td>{request.status}</td>
  </tr>
));

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <MenuStaff />
      <div className="main-container scale-in">
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

          <div className="leave-request-list">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Leave starting date</th>
                  <th>Leave ending date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{renderStaffLeaveRequestList}</tbody>
            </table>
          </div>

          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredLeaveRequests.length / staffLeaveRequestPerPage) }, (_, index) => (
              <button key={index + 1} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffLeaveRequestList;
