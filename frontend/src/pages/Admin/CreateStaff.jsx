import React, { useState } from 'react';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateStaff = ({ updateStaffList, displayToast }) => {
  const [staffDetails, setStaffDetails] = useState({
    email: '',
    firstName: '',
    lastName: '',
    serviceName: '',
    address:'',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleCreateStaff = async () => {
    try {
      // Validate staff details
      if (!staffDetails.email || !staffDetails.firstName || !staffDetails.lastName || !staffDetails.serviceName || !staffDetails.address) {
        toast.error('Please fill all staff details.');
        return;
      }

      setLoading(true);

      // Send a request to the backend to create a new staff account
      const authToken = localStorage.getItem('authToken');

      const response = await fetch('http://localhost:5000/api/admin/create-staff', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(staffDetails),
      });

      if (response.ok) {
        toast.success('Staff account created successfully!');
        // Reset the form after successful submission
        setStaffDetails({
          email: '',
          firstName: '',
          lastName: '',
          serviceName: '',
          address: '',
        });

        // Update the staff list by calling the provided function
        updateStaffList();

        // Show success toast
        displayToast('Staff account created successfully!');
      } else {
        const data = await response.json();
        toast.error(`Staff account creation failed: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Error during staff account creation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <MenuAdmin />
    <div className="main-container bounce-in">
    <div className="create-staff-form">
      <h2>Create Staff Account</h2>
      <div className='form-flex'>
      <label htmlFor="email">Email:</label>
      <input type="email"  id="email" name="email" value={staffDetails.email} onChange={handleInputChange} />
      </div>
      <div className='form-flex'>
      <label htmlFor="firstName">First Name:</label>
      <input type="text"  id="firstName" name="firstName" value={staffDetails.firstName} onChange={handleInputChange} />
      </div>
      <div className='form-flex'>
      <label htmlFor="lastName">Last Name:</label>
      <input type="text" id="lastName" value={staffDetails.lastName} onChange={handleInputChange} />
      </div>
      <div className='form-flex'>
      <label htmlFor="address">Address:</label>
      <input type="text" id="address" value={staffDetails.address} onChange={handleInputChange} />
      </div>
      <div className='form-flex'>
      <label htmlFor="serviceName">Service Name:</label>
      <input type="text" id="serviceName" value={staffDetails.serviceName} onChange={handleInputChange} />
      </div>
      <button onClick={handleCreateStaff} disabled={loading}>
        {loading ? 'Creating Staff Account...' : 'Create Staff Account'}
      </button>
    </div>
    </div>
    <ToastContainer autoClose={5000} />
    </>
  );
};

export default CreateStaff;
