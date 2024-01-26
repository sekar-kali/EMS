import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner.jsx';
import MenuAdmin from '../../components/MenuAdmin';
import Footer from '../../components/Footer';

const StaffList = () => {
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [staffPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchStaffList = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:5000/api/admin/staff-list?page=${currentPage}&limit=${staffPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error fetching staff list');
      }

      const data = await response.json();
      setStaffList(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, [currentPage]); // Update the staff list when the page changes

  const filteredStaffList = staffList.filter((staff) => {
    const searchValue = searchTerm.toLowerCase();

    if (filterOption === 'name') {
      return (
        staff.firstName.toLowerCase().includes(searchValue) ||
        staff.lastName.toLowerCase().includes(searchValue)
      );
    } else if (filterOption === 'email') {
      return staff.email.toLowerCase().includes(searchValue);
    } else if (filterOption === 'serviceName') {
      return staff.serviceName.toLowerCase().includes(searchValue);
    } else if (filterOption === 'role') {
      return staff.role.toLowerCase().includes(searchValue);
    }

    return false;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const handleModifyClick = (staffId) => {
    navigate(`/update-staff/${staffId}`);
  };

  const handleDeleteClick = async (staffId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this staff member?');
  
    if (confirmDelete) {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/admin/delete-staff/${staffId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Error deleting staff');
        }
  
        // Refresh the staff list after deletion
        fetchStaffList();
      } catch (error) {
        console.log('Error deleting staff:', error);
        console.log(staffId);
      }
    }
  };
  

  // Pagination
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaffList = filteredStaffList.slice(indexOfFirstStaff, indexOfLastStaff);

  const renderStaffList = currentStaffList.map((staff, index) => (
    <tr key={staff._id}>
      <td>{indexOfFirstStaff + index + 1}</td>
      <td>
        {staff.firstName} {staff.lastName}
      </td>
      <td>{staff.email}</td>
      <td>{staff.serviceName}</td>
      <td>{staff.role}</td>
      <td>
        <button className="edit" onClick={() => handleModifyClick(staff._id)}>
          Edit
        </button>
        <button className="delete" onClick={() => handleDeleteClick(staff._id)}>
          Delete
        </button>
      </td>
    </tr>
  ));

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <MenuAdmin />
      <div className="main-container fade-in">
        <div className="search-bar">
          <h1>Staff List</h1>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <select value={filterOption} onChange={handleFilterChange}>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="serviceName">Service Name</option>
            <option value="role">Role</option>
          </select>

          <div className="staff-list">
            {loading === 'abc' ? (
              <Spinner />
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Staff Name</th>
                    <th>Email</th>
                    <th>Service Name</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{renderStaffList}</tbody>
              </table>
            )}
          </div>

          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredStaffList.length / staffPerPage) }, (_, index) => (
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

export default StaffList;
