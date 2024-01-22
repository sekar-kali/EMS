import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch staff list from the backend
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

    fetchStaffList();
  }, []);

  const filteredStaffList = staffList.filter(
    (staff) =>
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleModifyClick = (staffId) => {
    // Redirect to the modify form for the selected staff
    navigate(`/modify-staff/${staffId}`);
  };

  return (
    <>
      <MenuAdmin />
      <div className="main-container">
        <h1>Staff List</h1>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
<div className='staff-list'>
        <table>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffList.length > 0 ? (
              filteredStaffList.map((staff) => (
                <tr key={staff._id}>
                  <td>
                    <Link to={`/staff/${staff._id}`}>
                      {staff.firstName} {staff.lastName}
                    </Link>
                  </td>
                  <td>
                    <button onClick={() => handleModifyClick(staff._id)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No matching staff found.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffList;
