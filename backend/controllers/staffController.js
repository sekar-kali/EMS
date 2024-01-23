import StaffModel from '../models/Staff.js';
import MissionModel from '../models/Mission.js';
import LeaveRequestModel from '../models/LeaveRequest.js';

// Fetch total missions for the current month
export const getTotalMissions = async (req, res) => {
  try {
    const { staffEmail } = req.body;
    const currentMonthStart = moment().startOf('month');
    const totalMissions = await MissionModel.countDocuments({
      assignedTo: ObjectId(staffEmail),
      createdAt: { $gte: currentMonthStart },
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
      staff: ObjectId(staffEmail),
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

    const staffInfo = await StaffModel.findOne({ email });

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
    const staffEmail = req.query.email;

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
    const staffEmail = req.query.email;

    // Find the staff member using the email
    const staff = await StaffModel.findOne({ email: staffEmail }).populate('leaveRequests');

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    if (!staff.leaveRequests || staff.leaveRequests.length === 0) {
      return res.status(200).json({ message: 'No leave requests found for the staff' });
    }

    // Extract and format data to include 'firstName' and 'lastName' in each leave request
    const formattedLeaveRequests = staff.leaveRequests.map(request => ({
      ...request.toObject(), 
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
    }));

    res.json(formattedLeaveRequests);
  } catch (error) {
    console.error('Error fetching staff leave requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const createLeaveRequest = async (req, res) => {
  try {
    const { email, startDate, endDate, reason, description, documentUrl } = req.body;

    // Fetch staff information including firstName and lastName
    const staff = await StaffModel.findOne({ email }, 'firstName lastName');

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
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

    // Define the upload path
    const uploadPath = __dirname + '/api/staff/leave-request/upload/folder/' + document.name;

    // Move the uploaded file to the defined path
    await document.mv(uploadPath);

    // Return the file URL
    res.json({ url: `/api/staff/leave-request/upload/folder/${document.name}` });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changeDetailsRequest = async (req, res) => {
  try {
    const { email, newFirstName, newLastName } = req.body;

    const staff = await StaffModel.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    staff.firstName = newFirstName;
    staff.lastName = newLastName;

    await staff.save();

    res.json({ message: 'Change details request submitted successfully' });
  } catch (error) {
    console.error('Error handling change details request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

