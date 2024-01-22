import React, { useState } from 'react';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';
import '../../styles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeaveRequestForm = ({ handleLeaveRequestSubmit }) => {
  const [leaveRequestForm, setLeaveRequestForm] = useState({
    startDate: '',
    endDate: '',
    reason: 'annual',
    description: '',
    document: null,
  });

  const handleLeaveRequest = async () => {
    try {
      // Validate leave request form fields
      if (!leaveRequestForm.startDate || !leaveRequestForm.endDate) {
        toast.error('Please fill in all leave request fields.');
        return;
      }

      // If the reason is medical and a document is not provided, show an error
      if (leaveRequestForm.reason === 'medical' && !leaveRequestForm.document) {
        toast.error('Medical reason requires a document for justification.');
        return;
      }

      // If a document is provided, check the file size and upload it to the server
      let documentUrl = '';
      if (leaveRequestForm.document) {
        const fileSize = leaveRequestForm.document.size / 1024 / 1024; // Convert size to MB
        const maxSize = 2; // Maximum file size in MB

        if (fileSize > maxSize) {
          toast.error('Document size exceeds the limit of 2MB.');
          return;
        }

        const formData = new FormData();
        formData.append('document', leaveRequestForm.document);

        const documentResponse = await fetch('http://localhost:5000/api/leave-request/upload-document', {
          method: 'POST',
          body: formData,
        });

        if (documentResponse.ok) {
          const documentData = await documentResponse.json();
          documentUrl = documentData.url;
        } else {
          toast.error('Error uploading document. Leave request not submitted.');
          return;
        }
      }

      // Send leave request to the backend for processing
      const email = JSON.parse(localStorage.getItem('user'))
      const response = await fetch('http://localhost:5000/api/staff/create-leave-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...leaveRequestForm,email : email, documentUrl }),
      });

      if (response.ok) {
        toast.success('Leave request created successfully!');
        // Reset the form after successful submission
        setLeaveRequestForm({
          startDate: '',
          endDate: '',
          reason: 'annual',
          description: '',
          document: null,
        });
      } else {
        const data = await response.json();
        toast.error('Leave request creation failed:', data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error during leave request creation:', error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    // Check if the file size exceeds the limit
    const maxSize = 2; // Maximum file size in MB
    const fileSize = file.size / 1024 / 1024; // Convert size to MB
  
    if (fileSize > maxSize) {
      toast.error('File size exceeds the limit of 2MB. Please choose a smaller file.');
    } else {
      setLeaveRequestForm({ ...leaveRequestForm, document: file });
    }
  };
  
  return (
    <>
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
            <div className='form-flex'>
              <label>Document (Optional):</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </div>
            <button type="button" onClick={handleLeaveRequest}>
              Submit Leave Request
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer autoClose={5000} />
    </>
  );
};

export default LeaveRequestForm;
