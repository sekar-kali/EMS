import React, { useState } from 'react';
import Footer from '../components/Footer';
import MenuAdmin from '../components/MenuAdmin';
import Header from '../components/Header';

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

  const handleCreateStaff = async () => {
    try {
      // Validate staff details
      if (!staffDetails.email || !staffDetails.firstName || !staffDetails.lastName || !staffDetails.serviceName) {
        console.error('Please fill in all staff details.');
        return;
      }

      // Send a request to the backend to create a new staff account
      const authToken = localStorage.getItem('authToken');

      const response = await fetch('/api/admin/create-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(staffDetails),
      });

      if (response.ok) {
        console.log('Staff account created successfully!');
        // Reset the form after successful submission
        setStaffDetails({
          email: '',
          firstName: '',
          lastName: '',
          position: '',
        });

        // Update the staff list by calling the provided function
        updateStaffList();

        // Show success toast
        displayToast('Staff account created successfully!');
      } else {
        const data = await response.json();
        console.error('Staff account creation failed:', data.message);
      }
    } catch (error) {
      console.error('Error during staff account creation:', error.message);
    }
  };

  return (
    <>
    <Header />
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
      <label>Position:</label>
      <input type="text" name="serviceName" value={staffDetails.serviceName} onChange={handleInputChange} />
      </div>
      <button onClick={handleCreateStaff}>Create Staff Account</button>
    </div>
    </div>
    <Footer />
    </>
  );
};

export default CreateStaff;
