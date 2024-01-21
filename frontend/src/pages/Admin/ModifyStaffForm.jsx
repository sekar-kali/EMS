import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import MenuAdmin from '../../components/MenuAdmin';

const ModifyStaffForm = ({ staffId }) => {
  const navigate = useNavigate();

  const [staffDetails, setStaffDetails] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching staff details:', error);
      }
    };

    fetchStaffDetails();
  }, [staffId]);

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
      // Redirect the user to the staff list page
      navigate('/staff-list');
    } catch (error) {
      toast.error('Error updating staff details:', error);
    }
  };

  return (
    <>
    <Header />
    <MenuAdmin />
    <div className='main-container'>
      <div className="personal-info">
      <h2>Modify Staff Details</h2>
      <form>
      <div className='form-flex'>
          <label>First Name:</label>
          <input
            type="text"
            value={staffDetails.firstName}
            onChange={(e) => setStaffDetails({ ...staffDetails, firstName: e.target.value })}
          />
        </div>
        <div className='form-flex'>
          <label>Last Name:</label>
          <input
            type="text"
            value={staffDetails.lastName}
            onChange={(e) => setStaffDetails({ ...staffDetails, lastName: e.target.value })}
          />
        </div>
        
        <button type="button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </form>
      </div>
      </div>
      <Footer />
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default ModifyStaffForm;
