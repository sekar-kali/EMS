import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles.css';

const StaffLeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [staffFilteredLeaveRequests, setStaffFilteredLeaveRequests] = useState([]);
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
          console.log(leaveRequestsData);
          setLeaveRequests(leaveRequestsData || []);
          setStaffFilteredLeaveRequests(leaveRequestsData || []);
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
      setStaffFilteredLeaveRequests(leaveRequests);
    } else {
      const filtered = Array.isArray(leaveRequests)
        ? leaveRequests.filter((request) => request.status === statusFilter)
        : [];
      setStaffFilteredLeaveRequests(filtered);
    }
    setCurrentPage(1);
  }, [statusFilter, leaveRequests]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const formatDate = (date) => moment(date).format('DD/MM/YYYY');
  const handleDeleteLeaveRequest = async (leaveRequestId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this leave request ?');
    const authToken = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/staff/delete-leave-request/${leaveRequestId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        // Remove the deleted leave request from the local state
        setLeaveRequests((prevLeaveRequests) => prevLeaveRequests.filter(request => request.leaveRequestId !== leaveRequestId));
        setStaffFilteredLeaveRequests((prevFilteredRequests) => prevFilteredRequests.filter(request => request.leaveRequestId !== leaveRequestId));
        toast.success('Leave request deleted successfully!');
      } else {
        toast.error('Error deleting leave request:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting leave request:', error.message);
    }
  };

  
  // Pagination
  const indexOfLastStaffLeaveRequest = currentPage * staffLeaveRequestPerPage;
  const indexOfFirstStaffLeaveRequest = indexOfLastStaffLeaveRequest - staffLeaveRequestPerPage;

  const currentStaffLeaveRequestList = Array.isArray(staffFilteredLeaveRequests)
    ? staffFilteredLeaveRequests.slice(indexOfFirstStaffLeaveRequest, indexOfLastStaffLeaveRequest)
    : [];

  const renderStaffLeaveRequestList = currentStaffLeaveRequestList.map((request, index) => (
    <tr key={index}>
      <td data-label="Number">{indexOfFirstStaffLeaveRequest + index + 1}</td>
      <td data-label="From">{formatDate(request.startDate)}</td>
      <td data-label="To">{formatDate(request.endDate)}</td>
      <td data-label="Status">{request.status}</td>
      <td>
        {request.status === 'Pending' && (
          <button className="delete" onClick={() => handleDeleteLeaveRequest(request.leaveRequestId)}>Delete</button>
        )}
      </td>
    </tr>
  ));

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <MenuStaff />
      <main className="main-container scale-in">
        <section className="leave-request-list">
          <h1>Leave Request List</h1>

          <article className="filter-bar">
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select id="statusFilter" onChange={handleStatusFilterChange} value={statusFilter}>
              <option value="All">All</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </article>

          <article className="leave-request-list">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Leave starting date</th>
                  <th>Leave ending date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{renderStaffLeaveRequestList}</tbody>
            </table>
        </article>
          <article className="pagination">
            {Array.from({ length: Math.ceil(staffFilteredLeaveRequests.length / staffLeaveRequestPerPage) }, (_, index) => (
              <button key={index + 1} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </article>
        </section>
      </main>
      <ToastContainer />
    </>
  );
};

export default StaffLeaveRequestList;
