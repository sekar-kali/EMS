import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import MenuStaff from './MenuStaff';
import '../styles.css';

const LeaveRequestForm = ({ handleLeaveRequestSubmit }) => {
  const [leaveRequestForm, setLeaveRequestForm] = useState({
    startDate: '',
    endDate: '',
    reason: 'annual',
    description: '',
  });

  const handleLeaveRequest = async () => {
    try {
      // Validate leave request form fields
      if (!leaveRequestForm.startDate || !leaveRequestForm.endDate) {
        console.error('Please fill in all leave request fields.');
        return;
      }

      // Send leave request to the backend for processing
      const response = await fetch('/api/staff/createLeaveRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveRequestForm),
      });

      if (response.ok) {
        console.log('Leave request created successfully!');
        // Reset the form after successful submission
        setLeaveRequestForm({
          startDate: '',
          endDate: '',
          reason: 'annual',
          description: '',
        });
      } else {
        const data = await response.json();
        console.error('Leave request creation failed:', data.message);
      }
    } catch (error) {
      console.error('Error during leave request creation:', error.message);
    }
  };

  return (
    <>
      <Header />
      <MenuStaff />
      <div className="main-container">
        <div className='create-leave-form'>
          <h2>Leave Request Form</h2>
          <form>
            <div className='form-flex'>
              <label>Start Date:</label>
              <input
                type="date"
                value={leaveRequestForm.startDate}
                onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, startDate: e.target.value })}
              />
            </div>
            <div className='form-flex'>
              <label>End Date:</label>
              <input
                type="date"
                value={leaveRequestForm.endDate}
                onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, endDate: e.target.value })}
              />
            </div>
            <div className='form-flex'>
              <label>Reason:</label>
              <select
                value={leaveRequestForm.reason}
                onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, reason: e.target.value })}
              >
                <option value="annual">Annual Leave</option>
                <option value="medical">Medical Leave</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className='form-flex'>
              <label>Description :</label>
              <textarea
                value={leaveRequestForm.description}
                onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, description: e.target.value })}
              />
            </div>
            <button type="button" onClick={handleLeaveRequest}>
              Submit Leave Request
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LeaveRequestForm;
