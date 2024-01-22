import nodemailer from 'nodemailer';
import StaffModel from '../models/Staff.js';
import LeaveRequestModel from '../models/LeaveRequest.js';
import dotenv from 'dotenv';
import MissionModel from '../models/Mission.js';

dotenv.config();  

export const getDashboardStats = async (req, res) => {
  try {
    // Calculate total staff
    const totalStaff = await StaffModel.countDocuments();

    // Calculate new staff this month
    const currentMonth = new Date().getMonth() + 1;
    const newStaffThisMonth = await Staff.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1) },
    });

    // Calculate total missions this month
    const totalMissionsThisMonth = await MissionModel.countDocuments({
      startDate: { $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1) },
    });

    // Calculate staff on leave this month
    const staffOnLeaveThisMonth = await LeaveRequestModel.countDocuments({
      status: 'Approved',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    // Send the calculated statistics as JSON
    res.json({
      totalStaff,
      newStaffThisMonth,
      totalMissionsThisMonth,
      staffOnLeaveThisMonth,
    });
  } catch (error) {
    console.error('Error getting dashboard statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const createStaff = async (req, res) => {
  try {
    // Assuming to receive staff details from the request body
    const { email, firstName, lastName, serviceName } = req.body;

    // Check if the email is already registered
    const existingUser = await StaffModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create a new staff member
    const newStaff = new StaffModel({
      email,
      firstName,
      lastName,
      serviceName,
      isStaff: true,
    });

    // Save the new staff member to the database
    await newStaff.save();

    // Send a confirmation email to the new staff member
    const transporter = nodemailer.createTransport({
      // Configure nodemailer transporter
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const confirmationLink = `${process.env.FRONTEND_URL}/create-password?email=${email}`; // Update with your frontend URL

    const mailOptions = {
      from: process.env.MAIL,
      to: email,
      subject: 'Account Confirmation',
      text: `Welcome to our platform! Click the following link to create your password: ${confirmationLink}`,
    };

    await transporter.sendMail(mailOptions);

    // Return success message as JSON
    console.log('Response:', { message: 'Staff account created successfully. Confirmation email sent.' });
res.json({ message: 'Staff account created successfully. Confirmation email sent.' });
  } catch (error) {
    console.error('Error creating staff account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStaffList = async (req, res) => {
  try {
    // Fetch the list of staff members from the database
    const staffList = await StaffModel.find({}, { password: 0 }); // Exclude password from the response

    // Return the staff list as JSON
    res.json(staffList);
  } catch (error) {
    console.error('Error fetching staff list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllStaff = async (req, res) => {
    try {
      // Fetch all staff members from the database
      const staffMembers = await StaffModel.find();
  
      // Send the list of staff members as a response
      res.json(staffMembers);
    } catch (error) {
      console.error('Error fetching staff members:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// Get all leave requests with optional status filter
export const getLeaveRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const leaveRequests = await LeaveRequestModel.find(filter).populate('staffId', '-password');
    res.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve leave request
export const approveLeaveRequest = async (req, res) => {
  try {
    const { leaveRequestId } = req.params;
    const leaveRequest = await LeaveRequestModel.findByIdAndUpdate(leaveRequestId, { status: 'approved' });
    // Send approval email here (replace with your logic)
    res.json({ message: 'Leave request approved successfully' });
  } catch (error) {
    console.error('Error approving leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reject leave request
export const rejectLeaveRequest = async (req, res) => {
  try {
    const { leaveRequestId } = req.params;
    const leaveRequest = await LeaveRequestModel.findByIdAndUpdate(leaveRequestId, { status: 'rejected' });
    // Send rejection email here (replace with your logic)
    res.json({ message: 'Leave request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createMission = async (req, res) => {
  try {
    // Assuming to receive the mission details from the request body
    const { title, description, staffId, startDate, endDate } = req.body;

    // Fetch staff information from the database using Mongoose
    const staff = await StaffModel.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Check if the staff is already assigned to another mission during the same time period
    const existingMission = await MissionModel.findOne({
      staffId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Mission overlaps in start and end dates
        { startDate: { $gte: startDate, $lte: endDate } }, // Mission starts during the existing mission
        { endDate: { $gte: startDate, $lte: endDate } }, // Mission ends during the existing mission
      ],
    });

    if (existingMission) {
      return res.status(400).json({ message: 'Staff is already assigned to another mission during this time period' });
    }

    // Create a new mission and save it to the database
    const newMission = new MissionModel({
      title,
      description,
      staffId: staff._id,
      startDate,
      endDate,
    });

    await newMission.save();

    // Return success message as JSON
    res.json({ message: 'Mission created successfully' });
  } catch (error) {
    console.error('Error creating mission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllMissions = async (req, res) => {
  try {
    // Fetch all missions from the database, populating staff details for each mission
    const missions = await MissionModel.find().populate('staffId', '-password');

    // Return the list of missions as JSON
    res.json(missions);
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAvailableStaff = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Fetch staff members who are not on leave for the selected dates
    const availableStaff = await StaffModel.find({
      onLeave: { $ne: true }, // Find staff members who are not on leave
    });

    res.json(availableStaff);
  } catch (error) {
    console.error('Error fetching available staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendApprovalEmail = async (leaveRequestId) => {
  try {
    // Fetch leave request details
    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId).populate('staffId');

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Compose email options
    const mailOptions = {
      from: process.env.MAIL,
      to: leaveRequest.staffId.email,
      subject: 'Leave Request Approved',
      text: `Your leave request has been approved.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`Approval email sent for leave request ${leaveRequestId}`);
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
};

export const sendRejectionEmail = async (leaveRequestId) => {
  try {
    // Fetch leave request details
    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId).populate('staffId');

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Compose email options
    const mailOptions = {
      from: process.env.MAIL,
      to: leaveRequest.staffId.email,
      subject: 'Leave Request Rejected',
      text: `Your leave request has been rejected.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`Rejection email sent for leave request ${leaveRequestId}`);
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
};

// Define sendEmail function
export const sendEmail = async (emailOptions) => {
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Compose email options
    const mailOptions = {
      from: process.env.MAIL,
      ...emailOptions,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.response);
    
    return { ok: true, info };
  } catch (error) {
    console.error('Error sending email:', error);
    return { ok: false, statusText: 'Internal server error' };
  }
};