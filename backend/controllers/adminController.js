import nodemailer from 'nodemailer';
import StaffModel from '../models/Staff.js';
import LeaveRequestModel from '../models/LeaveRequest.js';
import dotenv from 'dotenv';
import MissionModel from '../models/Mission.js';
import mongoose from 'mongoose';

dotenv.config();

export const getDashboardStats = async (req, res) => {
  try {
    // Calculate total staff
    const totalStaff = await StaffModel.countDocuments();

    // Calculate new staff this month
    const currentMonth = new Date().getMonth() + 1;
    const newStaffThisMonth = await StaffModel.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1) },
    });

    // Calculate total missions this month
    const totalMissionsThisMonth = await MissionModel.countDocuments({
      startDate: { $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1) },
    });

    // Calculate staff on leave this month
    const staffOnLeaveThisMonth = await LeaveRequestModel.countDocuments({
      status: 'Approved',
      startDate: { $lte: new Date(new Date().getFullYear(), currentMonth, 0) },
      endDate: { $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1) },
    });

    // Send the calculated statistics as JSON
    res.json({
      totalStaff,
      newStaffThisMonth,
      totalMissionsThisMonth,
      staffOnLeaveThisMonth,
    });
  } catch (error) {
    console.log('Error getting dashboard statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStaff = async (req, res) => {
  try {
    // Assuming to receive staff details from the request body
    const { email, firstName, lastName, serviceName, address } = req.body;

    // Trim inputs to remove leading and trailing whitespaces
    const trimmedEmail = email.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedServiceName = serviceName.trim();
    const trimmedAddress = address.trim();

    // Check if the email is already registered
    const existingUser = await StaffModel.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create a new staff member
    const newStaff = new StaffModel({
      email: trimmedEmail,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      address: trimmedAddress,
      serviceName: trimmedServiceName,
      isStaff: true,
    });

    // Save the new staff member to the database
    await newStaff.save();

    // Send a confirmation email to the new staff member
    const transporter = nodemailer.createTransport({
      // Nodemailer transporter
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const confirmationLink = `${process.env.FRONTEND_URL}/create-password?email=${trimmedEmail}`;

    const mailOptions = {
      from: process.env.MAIL,
      to: trimmedEmail,
      subject: 'Account Password Creation',
      text: `Welcome to our platform! Click the following link to create your password: ${confirmationLink}`,
    };

    await transporter.sendMail(mailOptions);

    // Return success message as JSON
    console.log('Response:', {
      message: 'Staff account created successfully. Confirmation email sent.',
    });
    res.json({ message: 'Staff account created successfully. Confirmation email sent.' });
  } catch (error) {
    console.log('Error creating staff account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    if (!mongoose.isValidObjectId(staffId)) {
      return res.status(400).json({ error: 'Invalid staff ID format' });
    }

    const deletedStaff = await StaffModel.findByIdAndDelete(staffId);

    if (!deletedStaff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.log('Error deleting staff:', error);

    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ error: 'Invalid staff ID format' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getStaffList = async (req, res) => {
  try {
    // Fetch the list of staff members from the database
    const staffList = await StaffModel.find({}, { password: 0 }); // Exclude password from the response

    // Return the staff list as JSON
    res.json(staffList);
  } catch (error) {
    console.log('Error fetching staff list:', error);
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
      console.log('Error fetching staff members:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// Get all leave requests with optional status filter
export const getLeaveRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    // Populate 'staffId' field to get staff details
    const leaveRequests = await LeaveRequestModel.find(filter).populate({
      path: 'staffId',
      select: 'firstName lastName email',
    });

    // Extract and format data to include 'firstName' and 'lastName' in each leave request
    const formattedLeaveRequests = leaveRequests.map(request => ({
      ...request._doc,
      firstName: request.staffId.firstName,
      lastName: request.staffId.lastName,
    }));

    res.json(formattedLeaveRequests);
  } catch (error) {
    console.log('Error fetching leave requests:', error);
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
    pass: process.env.MAIL_PASSWORD
  }
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
    console.log('Error sending approval email:', error);
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
        pass: process.env.MAIL_PASSWORD
      }
    });;

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
    console.log('Error sending rejection email:', error);
    throw error;
  }
};

export const approveLeaveRequest = async (req, res) => {
  try {
    const { leaveRequestId } = req.params;
    const leaveRequest = await LeaveRequestModel.findByIdAndUpdate(leaveRequestId, { status: 'Approved' });

    // Send approval email
    sendApprovalEmail(leaveRequestId);

    res.json({ message: 'Leave request approved successfully' });
  } catch (error) {
    console.log('Error approving leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectLeaveRequest = async (req, res) => {
  try {
    const { leaveRequestId } = req.params;
    const leaveRequest = await LeaveRequestModel.findByIdAndUpdate(leaveRequestId, { status: 'Rejected' });

    // Send rejection email
    sendRejectionEmail(leaveRequestId);

    res.json({ message: 'Leave request rejected successfully' });
  } catch (error) {
    console.log('Error rejecting leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const createMission = async (req, res) => {
  try {
    const { title, description, staffId, startDate, endDate } = req.body;

    // Trim title and description
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date must not be anterior to start date' });
    }

    if (new Date(startDate) < new Date()) {
      return res.status(400).json({ message: 'Start date must not be anterior to today' });
    }

    // Fetch staff information from the database using Mongoose
    const staff = await StaffModel.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Check if the staff is already assigned to another mission during the same time period
    const existingMission = await MissionModel.findOne({
      staffId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    if (existingMission) {
      return res.status(400).json({ message: 'Staff is already assigned to another mission during this time period' });
    }

    // Create a new mission and save it to the database
    const newMission = new MissionModel({
      title: trimmedTitle,
      description: trimmedDescription,
      assignedTo: staff._id,
      startDate,
      endDate,
    });

    await newMission.save();

    // Return success message as JSON
    res.json({ message: 'Mission created successfully' });
  } catch (error) {
    console.log('Error creating mission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAllMissions = async (req, res) => {
  try {
    const missions = await MissionModel.find().populate('assignedTo', '-password');
    res.json(missions);
  } catch (error) {
    console.log('Error fetching missions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAvailableStaff = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Fetch staff members who are not on leave or assigned to a mission for the selected dates
    const availableStaff = await StaffModel.find({
      onLeave: { $ne: true },
      _id: {
        $nin: await getStaffOnMission(startDate, endDate),
      },
    });

    res.json(availableStaff);
  } catch (error) {
    console.log('Error fetching available staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to get staff IDs on a mission during a specific date range
const getStaffOnMission = async (startDate, endDate) => {
  try {
    // Fetch staff members assigned to a mission during the specified date range
    const staffOnMission = await MissionModel.distinct('staffId', {
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Mission overlaps in start and end dates
        { startDate: { $gte: startDate, $lte: endDate } }, // Mission starts during the specified date range
        { endDate: { $gte: startDate, $lte: endDate } }, // Mission ends during the specified date range
      ],
    });

    return staffOnMission;
  } catch (error) {
    console.log('Error fetching staff on mission:', error);
    throw error;
  }
};


export const deleteMission = async (req, res) => {
  try {
    const { missionId } = req.params;

    // Validate if missionId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(missionId)) {
      return res.status(400).json({ message: 'Invalid missionId' });
    }

    // Delete the mission from the database
    const result = await MissionModel.findByIdAndDelete(missionId);

    if (!result) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    res.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    console.log('Error deleting mission:', error);
    res.status(500).json({ message: 'Internal server error' });
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
        pass: process.env.MAIL_PASSWORD
      }
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
    console.log('Error sending email:', error);
    return { ok: false, statusText: 'Internal server error' };
  }
};

// Update staff details

export const updateStaff = async (req, res) => {
  const { staffId } = req.params;
  const { firstName, lastName, role, email, address } = req.body;

  try {
    // Validate if staffId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).json({ message: 'Invalid staffId' });
    }

    // Fetch the staff by ID from the database
    const staff = await StaffModel.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Update staff details
    staff.firstName = firstName;
    staff.lastName = lastName;
    staff.address = address;
    staff.role = role;
    staff.email = email;

    // Save the updated staff details
    await staff.save();

    res.json({ message: 'Staff details updated successfully' });
  } catch (error) {
    console.log('Error updating staff details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const changeAdminDetailsRequest = async (req, res) => {
  try {
    const { email, newFirstName, newLastName, newAddress, newPassword, newServiceName } = req.body;

    const admin = await StaffModel.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Get the current date and time
    const currentDate = new Date().toLocaleString();

    // Create a string to hold the details that are changed
    let changedDetails = '';

    // Update details
    if (newFirstName && newFirstName !== admin.firstName) {
      admin.firstName = newFirstName;
      changedDetails += 'First Name, ';
    }

    if (newLastName && newLastName !== admin.lastName) {
      admin.lastName = newLastName;
      changedDetails += 'Last Name, ';
    }

    if (newAddress && newAddress !== admin.address) {
      admin.address = newAddress;
      changedDetails += 'Address, ';
    }

    if (newServiceName && newServiceName !== admin.serviceName) {
      admin.serviceName = newServiceName;
      changedDetails += 'Service Name, ';
    }

    // Check if a new password is provided
    if (newPassword && newPassword.trim() !== '') {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      changedDetails += 'Password, ';
    }

    await admin.save();

    // Remove the trailing comma and space from changedDetails
    changedDetails = changedDetails.trim().slice(0, -1);

    // Send emails to staff and admin
    sendEmail(process.env.MAIL, 'Details Changed by Admin', `Admin with email ${email} changed their details at ${currentDate}. Details changed: ${changedDetails}.`);
    sendEmail(email, 'Details Changed Successfully', `Your details were changed successfully at ${currentDate}. Details changed: ${changedDetails}. If you didn't make this change, please contact ${process.env.MAIL}.`);

    res.json({ message: 'Change details request submitted successfully' });
  } catch (error) {
    console.log('Error handling change details request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAdminInfo = async (req, res) => {
  try {
    const { email } = req.params;

    const adminInfo = await StaffModel.findOne({ email });

    if (!adminInfo) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(adminInfo);
  } catch (error) {
    console.log('Error fetching admin information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStaffInfoById = async (req, res) => {
  try {
    const { staffId } = req.params;

    if (!mongoose.isValidObjectId(staffId)) {
      return res.status(400).json({ error: 'Invalid staff ID format' });
    }

    const staffInfo = await StaffModel.findById(staffId, { password: 0 }); // Exclude password from the response

    if (!staffInfo) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json(staffInfo);
  } catch (error) {
    console.log('Error fetching staff information by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
