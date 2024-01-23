import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuAdmin from '../../components/MenuAdmin';
import Footer from '../../components/Footer';

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('name'); // Default filter option
  const navigate = useNavigate();

  const fetchStaffList = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      const response = await fetch('http://localhost:5000/api/admin/staff-list', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching staff list');
      }

      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

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
    // Show a confirmation dialog before deleting
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
        console.error('Error deleting staff:', error);
      }
    }
  };


  return (
    <>
      <MenuAdmin />
      <div className="main-container">
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
          <table>
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Email</th>
                <th>Service Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffList.length > 0 ? (
                filteredStaffList.map((staff) => (
                  <tr key={staff._id}>
                    <td>
                        {staff.firstName} {staff.lastName}
                    </td>
                    <td>
                        {staff.email}
                    </td>
                    <td>
                        {staff.serviceName}
                    </td>
                    <td>
                        {staff.role}
                    </td>
                    <td>
                      <button className="edit" onClick={() => handleModifyClick(staff._id)}>Edit</button>
                      <button className="delete" onClick={() => handleDeleteClick(staff._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No matching staff found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffList;
