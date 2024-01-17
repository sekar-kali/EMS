import React, { useState } from 'react';

const LeaveRequestForm = () => {
  const [leaveRequestForm, setLeaveRequestForm] = useState({
    startDate: '',
    endDate: '',
  });

  const handleLeaveRequestSubmit = () => {
    // Implement leave request submission logic
    console.log('Leave request form submitted:', leaveRequestForm);
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
        
        <button type="button" onClick={handleLeaveRequestSubmit}>
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
