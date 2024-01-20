import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuAdmin from '../components/MenuAdmin';

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 
  useEffect(() => {
    // Fetch staff list from the backend
    const fetchStaffList = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          console.log('Authorization Token:', authToken);
      
          const response = await fetch('http://localhost:5000/api/admin/staff-list', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
      
          console.log('Response Status:', response.status);
      
          if (!response.ok) {
            throw new Error('Error fetching staff list');
          }
      
          const data = await response.json();
          console.log('Fetched Data:', data);
      
          setStaffList(data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
      
    fetchStaffList();
  }, []);

  const filteredStaffList = Array.isArray(staffList)
    ? staffList.filter((staff) =>
        staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Header />
      <MenuAdmin />
      <div className='main-container'>
        <h1>Staff List</h1>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <ul>
          {filteredStaffList.map((staff) => (
            <li key={staff._id}>
              <Link to={`/staff/${staff._id}`}>
                {staff.firstName} {staff.lastName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default StaffList;
