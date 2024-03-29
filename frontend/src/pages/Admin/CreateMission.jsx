import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateMission = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    // Fetch staff members who are not on leave for the selected dates
    const fetchAvailableStaff = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
          const response = await fetch(
                `http://localhost:5000/api/admin/staff/available?startDate=${startDate}&endDate=${endDate}`,
  {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }
);
        if (response.ok) {
          const staffData = await response.json();
          setStaffList(staffData);
          console.log(staffData);
        } else {
          console.log('Error fetching available staff:', response.statusText);
        }
      } catch (error) {
        console.log('Error fetching available staff:', error.message);
      }
    };

    fetchAvailableStaff();
  }, [startDate, endDate]);

  const handleCreateMission = async () => {
    try {
      // Check if all required fields are filled
      if (!title || !description || !startDate || !endDate || !selectedStaff) {
        toast.error('Please fill in all mission details.');
        return;
      }
  
      // Create a mission object with the required details
      const missionData = {
        title,
        description,
        startDate,
        endDate,
        staffId: selectedStaff,
      };
  
      // Send a request to the backend to create a new mission
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/api/admin/create-mission', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(missionData),
      });
  
      if (response.ok) {
        toast.success('Mission created successfully!',);
        // Reset the form after successful submission
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setSelectedStaff('');
      } else {
        const data = await response.json();
        toast.error(`Mission creation failed: ${data.message}`);
      }
    } catch (error) {
      console.log('Error during mission creation:', error.message);
      toast.error('Error during mission creation');
    }
  };

  return (
    <>
      <MenuAdmin />
      <main className="main-container bounce-in">
      <section className="create-mission-form">
      <h2>Create Mission</h2>
      <article className='form-flex'>
      <label>Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </article>
      <article className='form-flex'>
      <label>Description:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </article>
      <article className='form-flex'>
      <label>Start Date:</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </article>
      <article className='form-flex'>
      <label>End Date:</label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </article>
      <article className='form-flex'>
      <label>Select Staff:</label>
      <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
        <option value="" disabled>Select Staff</option>
        {staffList.map((staff) => (
          <option key={staff._id} value={staff._id}>
            {staff.firstName} {staff.lastName}
          </option>
        ))}
      </select>
      </article>
      <button onClick={handleCreateMission}>Create Mission</button>
    </section>
    </main>
    <ToastContainer autoClose={5000} />
    </>
  );
};

export default CreateMission;

