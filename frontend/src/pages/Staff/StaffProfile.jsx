// StaffProfile.jsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffProfile = () => {
  const [staffInfo, setStaffInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    serviceName: '',
  });

  const [modifiedDetails, setModifiedDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    password: '',
    confirmPassword: '',
    serviceName: '',
  });

  const email = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch staff's information
    const fetchStaffInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/staff/info/${email}`);
        if (response.ok) {
          const staffInfoData = await response.json();
          setStaffInfo(staffInfoData);

          // Initialize modifiedDetails with current details
          setModifiedDetails({
            firstName: staffInfoData.firstName,
            lastName: staffInfoData.lastName,
            address: staffInfoData.address,
            password: '',
            confirmPassword: '',
            serviceName: staffInfoData.serviceName,
          });
        } else {
          console.error('Error fetching staff information:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching staff information:', error.message);
      }
    };

    fetchStaffInfo();
  }, [email]);

  const handleModifyDetails = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      // Check if password and confirmPassword match
      if (modifiedDetails.password !== modifiedDetails.confirmPassword) {
        toast.error('Password and Confirm Password do not match');
        return;
      }

      // Make a POST request to the server
      const response = await fetch('http://localhost:5000/api/staff/change-details-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          email: staffInfo.email,
          newFirstName: modifiedDetails.firstName,
          newLastName: modifiedDetails.lastName,
          newAddress: modifiedDetails.address,
          newPassword: modifiedDetails.password,
          newServiceName: modifiedDetails.serviceName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        // Show success toast
        toast.success('Your details have been modified successfully!');
      } else {
        const data = await response.json();
        toast.error(`Error updating details: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating details:', error.message);
      toast.error('Error updating details');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the modifiedDetails state when input values change
    setModifiedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <>
      <MenuStaff />
      <div className='main-container bounce-in'>
        <div className="personal-info">
          <h1>Staff Personal Information</h1>
          <div className='form-flex'>
            <p>
              First Name: {staffInfo.firstName}{' '}
              <input
                type="text"
                name="firstName"
                value={modifiedDetails.firstName}
                onChange={handleInputChange}
              />
            </p>
          </div>
          <div className='form-flex'>
            <p>
              Last Name: {staffInfo.lastName}{' '}
              <input
                type="text"
                name="lastName"
                value={modifiedDetails.lastName}
                onChange={handleInputChange}
              />
            </p>
          </div>
          <div className='form-flex'>
            <p>
              Address: {staffInfo.address}{' '}
              <input
                type="text"
                name="address"
                value={modifiedDetails.address}
                onChange={handleInputChange}
              />
            </p>
          </div>
          <div className='form-flex'>
            <p>
              Password:{' '}
              <input
                type="password"
                name="password"
                value={modifiedDetails.password}
                onChange={handleInputChange}
              />
            </p>
          </div>
          <div className='form-flex'>
            <p>
              Confirm Password:{' '}
              <input
                type="password"
                name="confirmPassword"
                value={modifiedDetails.confirmPassword}
                onChange={handleInputChange}
              />
            </p>
          </div>
          <div className='form-flex'>
            <p>
              Service Name: {staffInfo.serviceName}{' '}
              <input
                type="text"
                name="serviceName"
                value={modifiedDetails.serviceName}
                onChange={handleInputChange}
              />
            </p>
          </div>
          <button onClick={handleModifyDetails}>Request Change in Details</button>
        </div>
      </div>
      <Footer />
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default StaffProfile;
