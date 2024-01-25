// ModifyStaffForm.jsx
import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';
import { useParams } from 'react-router-dom';

const ModifyStaffForm = () => {
  const [loading, setLoading] = useState(true);
  const [staffDetails, setStaffDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });
  const {staffId}=useParams();
  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
       
        if (!staffId) {
          return <div>StaffId is not available.</div>;
        }

        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/admin/staff/${staffId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Error fetching staff details');
        }
        
        const data = await response.json();
        
        setStaffDetails(data);
        setLoading(false);
      } catch (error) {
        console.log('Error:', error);
        setLoading(false);
      }
    };

    fetchStaffDetails();
  
  }, [staffId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails({ ...staffDetails, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/admin/update-staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(staffDetails),
      });

      if (!response.ok) {
        throw new Error('Error updating staff details');
      }

      toast.success('Staff details updated successfully!');
    } catch (error) {
      toast.error('Error updating staff details:', error.message);
    }
  };

  return (
    <>
      <MenuAdmin />
      <div className="main-container">
        {/* {loading ? (
          <Spinner />
        ) : ( */}
          <div className="update-staff-form">
            <h1>Modify Staff</h1>
          <h1>Modify Staff</h1>
          <form>
            <div className='form-flex'>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={staffDetails.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-flex'>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={staffDetails.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-flex'>
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={staffDetails.email}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-flex'>
              <label>Role:</label>
              <select
                name="role"
                value={staffDetails.role}
                onChange={handleInputChange}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="button" onClick={handleSaveChanges}>
              Save Changes
              </button>
            </form>
          </div>
        {/* )} */}
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default ModifyStaffForm;

