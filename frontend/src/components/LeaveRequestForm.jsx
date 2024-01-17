// LeaveRequestForm.jsx
import React, { useState } from 'react';

const LeaveRequestForm = ({ handleLeaveRequestSubmit }) => {
  const [leaveRequestForm, setLeaveRequestForm] = useState({
    startDate: '',
    endDate: '',
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
    <div className="form">
      <h2>Leave Request Form</h2>
      <form>
        <label>Start Date:</label>
        <input
          type="date"
          value={leaveRequestForm.startDate}
          onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, startDate: e.target.value })}
        />

        <label>End Date:</label>
        <input
          type="date"
          value={leaveRequestForm.endDate}
          onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, endDate: e.target.value })}
        />
        
        <button type="button" onClick={handleLeaveRequest}>
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
