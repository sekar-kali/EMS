import StaffModel from '../models/Staff.js';
import MissionModel from '../models/Mission.js';
import LeaveRequestModel from '../models/LeaveRequest.js';
import moment from 'moment';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';

dotenv.config();

// Fetch total missions for the current month
export const getTotalMissions = async (req, res) => {
  try {
    const { staffEmail } = req.body;
    const currentMonth = new Date().getMonth() + 1;
    const totalMissions = await MissionModel.countDocuments({
      assignedTo: req.staffId,
      startDate: { $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1) },
    });

    res.json({ total: totalMissions });
  } catch (error) {
    console.error('Error fetching total missions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch total approved leave requests for the current month
export const getTotalApprovedLeaveRequests = async (req, res) => {
  try {
    const { staffEmail } = req.body;
    const currentMonthStart = moment().startOf('month');
    const totalApprovedLeaveRequests = await LeaveRequestModel.countDocuments({
      staff: req.staffId,
      status: 'Approved',
      updatedAt: { $gte: currentMonthStart },
    });

    res.json({ total: totalApprovedLeaveRequests });
  } catch (error) {
    console.error('Error fetching total approved leave requests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getStaffInfo = async (req, res) => {
  try {
    const { email } = req.params;

    const staffInfo = await StaffModel.findOne({ email: email.trim() });

    if (!staffInfo) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json(staffInfo);
  } catch (error) {
    console.error('Error fetching staff information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStaffMissions = async (req, res) => {
  try {
    const staffEmail = req.params.email.trim(); // Trim email

    const staff = await StaffModel.findOne({ email: staffEmail });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const missions = await MissionModel.find({ assignedTo: staff._id });

    res.json(missions);
  } catch (error) {
    console.error('Error fetching staff missions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStaffLeaveRequests = async (req, res) => {
  try {
    const staffEmail = req.params.email.trim(); // Trim email

    // Find the staff member using the email
    const staff = await StaffModel.findOne({ email: staffEmail });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Find leave requests for the staff member
    const leaveRequests = await LeaveRequestModel.find({ staffId: staff._id });

    const leaveRequestInfo = leaveRequests.map((request) => ({
      leaveRequestId: request._id,
      startDate: request.startDate,
      endDate: request.endDate,
      status: request.status,
    }));

    res.json(leaveRequestInfo);
  } catch (error) {
    console.error('Error fetching staff leave requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete staff leave request by ID
export const deleteStaffLeaveRequest = async (req, res) => {
  try {
    const { leaveRequestId } = req.params;

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(leaveRequestId)) {
      return res.status(400).json({ message: 'Invalid leave request ID' });
    }

    const leaveRequest = await LeaveRequestModel.findByIdAndDelete(leaveRequestId);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if the leave request is in "Pending" status
    if (leaveRequest.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot delete leave request with status other than "Pending"' });
    }

    await leaveRequest.remove();
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createLeaveRequest = async (req, res) => {
  try {
    const { email, startDate, endDate, reason, description, documentUrl } = req.body;

    // Fetch staff information including firstName and lastName
    const staff = await StaffModel.findOne({ email: email.trim() }, 'firstName lastName');

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Validate startDate and endDate
    const today = new Date();
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate) || isNaN(parsedEndDate) || parsedStartDate > parsedEndDate || parsedStartDate < today) {
      return res.status(400).json({ message: 'Invalid startDate or endDate' });
    }

    // Check if there is an overlapping leave request for the same period
    const existingLeaveRequest = await LeaveRequestModel.findOne({
      staffId: staff._id,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    if (existingLeaveRequest) {
      return res.status(400).json({ message: 'Leave request for the same period already exists' });
    }

    const newLeaveRequest = new LeaveRequestModel({
      staffId: staff._id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      startDate,
      endDate,
      reason,
      description,
      documentUrl,
      status: 'Pending',
    });

    await newLeaveRequest.save();

    res.json({ message: 'Leave request created successfully' });
  } catch (error) {
    console.log('Error creating leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const document = req.files.document;

    // Check if the document size exceeds the limit (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (document.size > maxSize) {
      return res.status(400).json({ message: 'Document size exceeds the limit of 2MB.' });
    }

    // Check file type (example: allow only PDF, PNG, and JPG files)
    const allowedFileTypes = ['.pdf', '.png', '.jpg'];
    const fileExtension = path.extname(document.name).toLowerCase();
    if (!allowedFileTypes.includes(fileExtension)) {
      return res.status(400).json({ message: 'Invalid file type. Only PDF, PNG, and JPG files are allowed.' });
    }

    // Define the upload path using path.join
    const uploadPath = path.join(__dirname, '..', 'api', 'staff', 'leave-request', 'upload', 'folder', document.name);

    // Move the uploaded file to the defined path
    await document.mv(uploadPath);

    // Update the user's document field in the database (assuming you have a 'documents' field in your model)
    const userId = req.userData.userId; // Assuming you have middleware setting userData
    await StaffModel.findByIdAndUpdate(userId, { $push: { documents: uploadPath } });

    // Return the file URL
    const fileURL = `/api/staff/leave-request/upload/folder/${document.name}`;
    res.json({ url: fileURL });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changeDetailsRequest = async (req, res) => {
  try {
    const { email, newFirstName, newLastName, newAddress, newPassword, newServiceName } = req.body;

    const staff = await StaffModel.findOne({ email: email.trim() });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Get the current date and time
    const currentDate = new Date().toLocaleString();

    // Create a string to hold the details that are changed
    let changedDetails = '';

    // Update details
    if (newFirstName && newFirstName.trim() !== '' && newFirstName !== staff.firstName) {
      staff.firstName = newFirstName.trim();
      changedDetails += 'First Name, ';
    }

    if (newLastName && newLastName.trim() !== '' && newLastName !== staff.lastName) {
      staff.lastName = newLastName.trim();
      changedDetails += 'Last Name, ';
    }

    if (newAddress && newAddress.trim() !== '' && newAddress !== staff.address) {
      staff.address = newAddress.trim();
      changedDetails += 'Address, ';
    }

    if (newServiceName && newServiceName.trim() !== '' && newServiceName !== staff.serviceName) {
      staff.serviceName = newServiceName.trim();
      changedDetails += 'Service Name, ';
    }

    // Check if a new password is provided
    if (newPassword && newPassword.trim() !== '') {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
      staff.password = hashedPassword;
      changedDetails += 'Password, ';
    }

    await staff.save();

    // Remove the trailing comma and space from changedDetails
    changedDetails = changedDetails.trim().slice(0, -1);

    // Send emails to staff and admin
    sendEmail(process.env.MAIL, 'Details Changed by Staff', `Staff with email ${email.trim()} changed their details at ${currentDate}. Details changed: ${changedDetails}.`);
    sendEmail(email.trim(), 'Details Changed Successfully', `Your details were changed successfully at ${currentDate}. Details changed: ${changedDetails}. If you didn't make this change, please contact ${process.env.MAIL}.`);

    res.json({ message: 'Change details request submitted successfully' });
  } catch (error) {
    console.error('Error handling change details request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to send emails
const sendEmail = async (to, subject, text) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.MAIL,
    to: to.trim(),
    subject,
    text,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
