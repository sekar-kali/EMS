import StaffModel from '../models/Staff.js';
import MissionModel from '../models/Mission.js';
import LeaveRequestModel from '../models/LeaveRequest.js';

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

    const missions = await MissionModel.find({ staffId: staff._id });

    res.json(missions);
  } catch (error) {
    console.error('Error fetching staff missions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStaffLeaveRequests = async (req, res) => {
  try {
    const staffEmail = req.query.email;

    const staff = await StaffModel.findOne({ email: staffEmail });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const leaveRequests = await LeaveRequestModel.find({ staffId: staff._id });

    res.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching staff leave requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createLeaveRequest = async (req, res) => {
  try {
    const { email, startDate, endDate, reason, description, documentUrl } = req.body;

    const staff = await StaffModel.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const newLeaveRequest = new LeaveRequestModel({
      staffId: staff._id,
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
    console.error('Error creating leave request:', error);
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

    // Define the upload path (adjust as per your server setup)
    const uploadPath = __dirname + '/path/to/your/upload/folder/' + document.name;

    // Move the uploaded file to the defined path
    await document.mv(uploadPath);

    // Return the file URL or any relevant information
    res.json({ url: `/path/to/your/upload/folder/${document.name}` });
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

