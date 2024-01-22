import React, { useState } from 'react';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';
import Header from '../../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateStaff = ({ updateStaffList, displayToast }) => {
  const [staffDetails, setStaffDetails] = useState({
    email: '',
    firstName: '',
    lastName: '',
    serviceName: '',
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
      if (!staffDetails.email || !staffDetails.firstName || !staffDetails.lastName || !staffDetails.serviceName) {
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
    <div className="main-container">
    <div className="create-staff-form">
      <h2>Create Staff Account</h2>
      <div className='form-flex'>
      <label>Email:</label>
      <input type="email" name="email" value={staffDetails.email} onChange={handleInputChange} />
      </div>
      <div className='form-flex'>
      <label>First Name:</label>
      <input type="text" name="firstName" value={staffDetails.firstName} onChange={handleInputChange} />
      </div>
      <div className='form-flex'>
      <label>Last Name:</label>
      <input type="text" name="lastName" value={staffDetails.lastName} onChange={handleInputChange} />
      </div>
      <div className='form-flex'>
      <label>Service Name:</label>
      <input type="text" name="serviceName" value={staffDetails.serviceName} onChange={handleInputChange} />
      </div>
      <button onClick={handleCreateStaff} disabled={loading}>
        {loading ? 'Creating Staff Account...' : 'Create Staff Account'}
      </button>
    </div>
    </div>
    <Footer />
    <ToastContainer autoClose={5000} />
    </>
  );
};

export default CreateStaff;
