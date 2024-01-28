import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Spinner from '../../components/Spinner.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles.css';
import MenuAdmin from '../../components/MenuAdmin';
import Footer from '../../components/Footer';

const LeaveRequestList = () => {
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [leaveRequestPerPage] = useState(10);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const authToken = localStorage.getItem('authToken');

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/leave-request', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data);
        setFilteredLeaveRequests(data);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterStatusChange = (status) => {
    setFilterStatus(status);
    filterLeaveRequests(status, searchQuery);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterLeaveRequests(filterStatus, query);
  };

  const filterLeaveRequests = (status, query) => {
    let filtered = leaveRequests;

    if (status !== 'All') {
      filtered = filtered.filter((request) => request.status === status);
    }

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter((request) => {
        const firstNameIncludes = request.firstName && request.firstName.toLowerCase().includes(lowercaseQuery);
        const lastNameIncludes = request.lastName && request.lastName.toLowerCase().includes(lowercaseQuery);
        const startDateIncludes = request.startDate && moment(request.startDate).format('DD/MM/YYYY').includes(lowercaseQuery);
        const endDateIncludes = request.endDate && moment(request.endDate).format('DD/MM/YYYY').includes(lowercaseQuery);

        return firstNameIncludes || lastNameIncludes || startDateIncludes || endDateIncludes;
      });
    }

    setFilteredLeaveRequests(filtered);
  };

  const handleApproveLeaveRequest = async (leaveRequestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve-leave-request/${leaveRequestId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        toast.success('Leave request approved successfully!');
        fetchLeaveRequests();
      } else {
        const data = await response.json();
        toast.error('Error approving leave request:', data.message);
      }
    } catch (error) {
      console.error('Error approving leave request:', error);
    }
  };

  const handleRejectLeaveRequest = async (leaveRequestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/reject-leave-request/${leaveRequestId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        toast.success('Leave request rejected successfully!');
        fetchLeaveRequests();
      } else {
        const data = await response.json();
        toast.error('Error rejecting leave request:', data.message);
      }
    } catch (error) {
      console.error('Error rejecting leave request:', error);
    }
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const indexOfLastLeaveRequest = currentPage * leaveRequestPerPage;
  const indexOfFirstLeaveRequest = indexOfLastLeaveRequest - leaveRequestPerPage;
  const currentLeaveRequestList = filteredLeaveRequests.slice(indexOfFirstLeaveRequest, indexOfLastLeaveRequest);

  const renderLeaveRequestList = currentLeaveRequestList.map((request, index) => (
    <tr key={request._id}>
      <td data-label="Number">{indexOfFirstLeaveRequest + index + 1}</td>
      <td data-label="Staff Name">{request.firstName} {request.lastName}</td>
      <td data-label="From">{formatDate(request.startDate)}</td>
      <td data-label="To">{formatDate(request.endDate)}</td>
      <td data-label="Status">{request.status}</td>
      <td data-label="Document">
        {request.documentUrl && (
          <a href={request.documentUrl} target="_blank" rel="noopener noreferrer">
            View Document
          </a>
        )}
      </td>
      <td>
        {request.status === 'Pending' && (
          <>
            <button className="approve-btn" onClick={() => handleApproveLeaveRequest(request._id)}>
              Approve
            </button>
            <button className="reject-btn" onClick={() => handleRejectLeaveRequest(request._id)}>
              Reject
            </button>
          </>
        )}
      </td>
    </tr>
  ));

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <MenuAdmin />
      <div className="main-container">
        <div className="leave-request-list-container scale-in">
          <h1>Leave Requests</h1>

          <div className="filter-bar">
            <div className="status-dropdown">
              <label>Status:</label>
              <select value={filterStatus} onChange={(e) => handleFilterStatusChange(e.target.value)}>
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by staff name, start date, or end date"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className='leave-request-list'>
          {loading ? (
              <Spinner />
            ) : (
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Staff Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Document</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {renderLeaveRequestList}
              </tbody>
            </table>
            )}
          </div>
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredLeaveRequests.length / leaveRequestPerPage) }, (_, index) => (
              <button key={index + 1} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LeaveRequestList;