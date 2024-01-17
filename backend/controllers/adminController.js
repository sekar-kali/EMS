import StaffModel from '../models/Staff.js';
import LeaveRequestModel from '../models/LeaveRequest.js';
import MissionModel from '../models/Mission.js';
import nodemailer from 'nodemailer';

export const createStaff = async (req, res) => {
  try {
    // Assuming to receive staff details from the request body
    const { email, firstName, lastName, position } = req.body;

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
      position,
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

    const confirmationLink = `${process.env.FRONTEND_URL}/create-password?email=${email}`;

    const mailOptions = {
      from: process.env.MAIL,
      to: email,
      subject: 'Account Confirmation',
      text: `Welcome to our platform! Click the following link to create your password: ${confirmationLink}`,
    };

    await transporter.sendMail(mailOptions);

    // Return success message as JSON
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
  
export const approveLeaveRequest = async (req, res) => {
  try {
    // Assuming to receive the leave request ID from the request
    const { leaveRequestId } = req.body;

    // Fetch the leave request from the database using Mongoose
    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update the leave request status to 'approved' and save it to the database
    leaveRequest.status = 'approved';
    await leaveRequest.save();

    // Return success message as JSON
    res.json({ message: 'Leave request approved successfully' });
  } catch (error) {
    console.error('Error approving leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectLeaveRequest = async (req, res) => {
  try {
    // Assuming to receive the leave request ID from the request
    const { leaveRequestId } = req.body;

    // Fetch the leave request from the database using Mongoose
    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update the leave request status to 'rejected' and save it to the database
    leaveRequest.status = 'rejected';
    await leaveRequest.save();

    // Return success message as JSON
    res.json({ message: 'Leave request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createMission = async (req, res) => {
  try {
    // Assuming to receive the mission details from the request
    const { title, description, staffId, startDate, endDate } = req.body;

    // Fetch staff information from the database using Mongoose
    const staff = await StaffModel.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
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
