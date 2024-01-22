import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
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
        const response = await fetch(`/api/admin/staff/available?startDate=${startDate}&endDate=${endDate}`);
        if (response.ok) {
          const staffData = await response.json();
          setStaffList(staffData);
        } else {
          console.error('Error fetching available staff:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching available staff:', error.message);
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
      const response = await fetch('http://localhost:5000/api/admin/create-mission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(missionData),
      });
  
      if (response.ok) {
        toast.success('Mission created successfully!', { position: toast.POSITION.TOP_RIGHT });
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
      console.error('Error during mission creation:', error.message);
      toast.error('Error during mission creation');
    }
  };

  return (
    <>
      <MenuAdmin />
      <div className="main-container">
      <div className="create-mission-form">
      <h2>Create Mission</h2>
      <div className='form-flex'>
      <label>Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className='form-flex'>
      <label>Description:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className='form-flex'>
      <label>Start Date:</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className='form-flex'>
      <label>End Date:</label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div className='form-flex'>
      <label>Select Staff:</label>
      <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
        <option value="" disabled>Select Staff</option>
        {staffList.map((staff) => (
          <option key={staff._id} value={staff._id}>
            {staff.firstName} {staff.lastName}
          </option>
        ))}
      </select>
      </div>
      <button onClick={handleCreateMission}>Create Mission</button>
    </div>
    </div>
    <Footer />
    <ToastContainer autoClose={5000} />
    </>
  );
};

export default CreateMission;

