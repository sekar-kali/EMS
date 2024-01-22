import React, { useState, useEffect } from 'react';
import '../../styles.css';
import Header from '../../components/Header';
import MenuAdmin from '../../components/MenuAdmin';
import Footer from '../../components/Footer';


const LeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all leave requests on component mount
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/leave-request');
      const data = await response.json();
      setLeaveRequests(data);
      setFilteredLeaveRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setError('Error fetching leave requests. Please try again.');
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

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter((request) => request.status === status);
    }

    // Apply search filter
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.staffName.toLowerCase().includes(lowercaseQuery) ||
          request.startDate.includes(lowercaseQuery) ||
          request.endDate.includes(lowercaseQuery)
      );
    }

    setFilteredLeaveRequests(filtered);
  };

  const handleApprovalOrRejection = async (leaveRequestId, action) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/${action}-leave-request/${leaveRequestId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        console.log(`Leave request ${action}ed successfully!`);
        // Refresh leave requests after approval or rejection
        fetchLeaveRequests();
      } else {
        const data = await response.json();
        console.error(`Error ${action}ing leave request:`, data.message);
        setError(`Error ${action}ing leave request. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${action}ing leave request:`, error);
      setError(`Error ${action}ing leave request. Please try again.`);
    }
  };

 
  return (
    <div>
      <MenuAdmin />
      <div className="main-container">
        <div className="leave-request-list-container">
          <h1>Leave Requests</h1>

          <div className="filter-bar">
            <div className="status-dropdown">
              <label>Status:</label>
              <select value={filterStatus} onChange={(e) => handleFilterStatusChange(e.target.value)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
          <table>
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Document</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredLeaveRequests) && filteredLeaveRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.staffName}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.documentUrl && (
                      <a href={request.documentUrl} target="_blank" rel="noopener noreferrer">
                        View Document
                      </a>
                    )}
                  </td>
                  <td>
                    {request.status === 'pending' && (
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
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LeaveRequestList;
