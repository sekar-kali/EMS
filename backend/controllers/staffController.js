import StaffModel from '../models/Staff.js';
import MissionModel from '../models/Mission.js';
import LeaveRequestModel from '../models/LeaveRequest.js';

export const getStaffInfo = async (req, res) => {
    try {
      const { email } = req.params; // Assuming to pass the email as a parameter in the URL
  
      // Fetch staff information from the database based on email
      const staffInfo = await StaffModel.findOne({ email });
  
      if (!staffInfo) {
        return res.status(404).json({ message: 'Staff member not found' });
      }
  
      // Send the staff information as a response
      res.json(staffInfo);
    } catch (error) {
      console.error('Error fetching staff information:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
export const getStaffMissions = async (req, res) => {
  try {
    // Assuming to receive the staff email from the request
    const staffEmail = req.query.email;

    // Fetch staff information from the database using Mongoose
    const staff = await StaffModel.findOne({ email: staffEmail });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Fetch missions associated with the staff member from the database
    const missions = await MissionModel.find({ staffId: staff._id });

    // Return the staff's missions as JSON
    res.json(missions);
  } catch (error) {
    console.error('Error fetching staff missions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStaffLeaveRequests = async (req, res) => {
  try {
    // Assuming to receive the staff email from the request
    const staffEmail = req.query.email; 

    // Fetch staff information from the database using Mongoose
    const staff = await StaffModel.findOne({ email: staffEmail });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Fetch leave requests associated with the staff member from the database
    const leaveRequests = await LeaveRequestModel.find({ staffId: staff._id });

    // Return the staff's leave requests as JSON
    res.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching staff leave requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createLeaveRequest = async (req, res) => {
  try {
    // Assuming to receive the staff email and leave request details from the request
    const { email, startDate, endDate } = req.body; 

    // Fetch staff information from the database using Mongoose
    const staff = await StaffModel.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Create a new leave request and save it to the database
    const newLeaveRequest = new LeaveRequestModel({
      staffId: staff._id,
      startDate,
      endDate,
      status: 'pending',
    });

    await newLeaveRequest.save();

    // Return success message as JSON
    res.json({ message: 'Leave request created successfully' });
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changeDetailsRequest = async (req, res) => {
  try {
    // Assuming to receive the staff email and new details from the request
    const { email, newFirstName, newLastName } = req.body; 

    // Fetch staff information from the database using Mongoose
    const staff = await StaffModel.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Update staff details in the database
    staff.firstName = newFirstName;
    staff.lastName = newLastName;

    await staff.save();

    // Return success message as JSON
    res.json({ message: 'Change details request submitted successfully' });
  } catch (error) {
    console.error('Error handling change details request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
