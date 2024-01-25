import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffPersonalInfo = () => {
  const [staffInfo, setStaffInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    serviceName: '',
  });

  // State to track modified details
  const [modifiedDetails, setModifiedDetails] = useState({
    firstName: '',
    lastName: '',
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
  }, []);

  const handleModifyDetails = () => {
    // Make a POST request to the server
    fetch('http://localhost:5000/api/staff/change-details-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: staffInfo.email,
        newFirstName: modifiedDetails.firstName,
        newLastName: modifiedDetails.lastName,
        newServiceName: modifiedDetails.serviceName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Show success toast
        toast.success('Your details have been modified successfully!');
      })
      .catch((error) => {
        toast.error(`Error updating details: ${error.message}`);
      });
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

export default StaffPersonalInfo;
