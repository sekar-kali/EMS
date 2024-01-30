import React, { useState } from 'react';
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

  const handleLeaveRequest = async (e) => {
    try {
      e.preventDefault();
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

      // If a document is provided, checking the file size and upload it to the server
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
        formData.append('startDate', leaveRequestForm.startDate);
        formData.append('endDate', leaveRequestForm.endDate);
        formData.append('reason', leaveRequestForm.reason);
        formData.append('description', leaveRequestForm.description);

        const authToken = localStorage.getItem('authToken');

        const documentResponse = await fetch('http://localhost:5000/api/staff/leave-request/upload-document', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
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
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/staff/create-leave-request', {
        method: 'POST',
        body: JSON.stringify({ ...leaveRequestForm,email : email, documentUrl }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
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
    setLeaveRequestForm({ ...leaveRequestForm, document: file });
  };

  return (
    <>
      <MenuStaff />
      <main className="main-container bounce-in">
        <section className='create-leave-form'>
          <h2>Leave Request Form</h2>
          <form onSubmit={handleLeaveRequest} encType="multipart/form-data">
            <article className='form-flex'>
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={leaveRequestForm.startDate}
                onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, startDate: e.target.value })}
              />
            </article>
            <article className='form-flex'>
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={leaveRequestForm.endDate}
                onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, endDate: e.target.value })}
              />
            </article>
            <article className='form-flex'>
              <label htmlFor="reason">Reason:</label>
              <select
                value={leaveRequestForm.reason}
                id="reason"
                onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, reason: e.target.value })}
              >
                <option value="annual">Annual Leave</option>
                <option value="medical">Medical Leave</option>
                <option value="others">Others</option>
              </select>
            </article>
            <article className='form-flex'>
              <label htmlFor="description">Description :</label>
              <textarea
                value={leaveRequestForm.description}
                id="description"
                onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, description: e.target.value })}
              />
            </article>
            <article className='form-flex'>
              <label htmlFor="document">Document (Optional):</label>
              <input type="file" id="document" accept=".pdf,.png,.jpg" onChange={handleFileChange} />
            </article>
            <button type="button" onClick={handleLeaveRequest}>
              Submit Leave Request
            </button>
          </form>
        </section>
      </main>
      <ToastContainer autoClose={5000} />
    </>
  );
};

export default LeaveRequestForm;