import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuAdmin from '../../components/MenuAdmin';

const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState({
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
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/staff/info/${email}`);
        if (response.ok) {
          const adminInfoData = await response.json();
          setAdminInfo(adminInfoData);

          // Initialize modifiedDetails with current details
          setModifiedDetails({
            firstName: adminInfoData.firstName,
            lastName: adminInfoData.lastName,
            address: adminInfoData.address,
            password: '',
            confirmPassword: '',
            serviceName: adminInfoData.serviceName,
          });
        } else {
          console.log('Error fetching staff information:', response.statusText);
        }
      } catch (error) {
        console.log('Error fetching staff information:', error.message);
      }
    };

    fetchAdminInfo();
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
          email: adminInfo.email,
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
      console.log('Error updating details:', error.message);
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
      <MenuAdmin />
      <main className='main-container bounce-in'>
        <form className="personal-info">
          <h1>Admin Personal Information</h1>
          <article className='form-flex'>
            <p>
              First Name: {adminInfo.firstName}{' '}
              <input
                type="text"
                name="firstName"
                value={modifiedDetails.firstName}
                onChange={handleInputChange}
              />
            </p>
          </article>
          <article className='form-flex'>
            <p>
              Last Name: {adminInfo.lastName}{' '}
              <input
                type="text"
                name="lastName"
                value={modifiedDetails.lastName}
                onChange={handleInputChange}
              />
            </p>
          </article>
          <article className='form-flex'>
            <p>
              Address: {adminInfo.address}{' '}
              <input
                type="text"
                name="address"
                value={modifiedDetails.address}
                onChange={handleInputChange}
              />
            </p>
          </article>
          <article className='form-flex'>
            <p>
              Password:{' '}
              <input
                type="password"
                name="password"
                value={modifiedDetails.password}
                onChange={handleInputChange}
              />
            </p>
          </article>
          <article className='form-flex'>
            <p>
              Confirm Password:{' '}
              <input
                type="password"
                name="confirmPassword"
                value={modifiedDetails.confirmPassword}
                onChange={handleInputChange}
              />
            </p>
          </article>
          <article className='form-flex'>
            <p>
              Service Name: {adminInfo.serviceName}{' '}
              <input
                type="text"
                name="serviceName"
                value={modifiedDetails.serviceName}
                onChange={handleInputChange}
              />
            </p>
          </article>
          <button onClick={handleModifyDetails}>Request Change in Details</button>
        </form>
      </main>
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default AdminProfile;
