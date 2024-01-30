import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

dotenv.config();

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Read and initialize data
    // await initData();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const initData = async () => {
  try {
    const dataFolderPath = path.join(fileURLToPath(import.meta.url), '../data');

    // Read staff data from staffs.json
    const staffsDataPath = path.join(dataFolderPath, 'staffs.json');
    const staffsData = await fs.readFile(staffsDataPath, 'utf-8');
    const staffs = JSON.parse(staffsData);

    // Insert staffs into the MongoDB collection
    const StaffModel = mongoose.model('Staff');
    await StaffModel.insertMany(staffs);

    // Read mission data from missions.json
    const missionsDataPath = path.join(dataFolderPath, 'missions.json');
    const missionsData = await fs.readFile(missionsDataPath, 'utf-8');
    const missions = JSON.parse(missionsData);

    // Insert missions into the MongoDB collection
    const MissionModel = mongoose.model('Mission');
    await MissionModel.insertMany(missions);

    // Read leave request data from leaverequests.json
    const leaveRequestsDataPath = path.join(dataFolderPath, 'leaverequests.json');
    const leaveRequestsData = await fs.readFile(leaveRequestsDataPath, 'utf-8');
    const leaveRequests = JSON.parse(leaveRequestsData);

    // Insert leave requests into the MongoDB collection
    const LeaveRequestModel = mongoose.model('LeaveRequest');
    await LeaveRequestModel.insertMany(leaveRequests);

    console.log('Initialized data successfully');
  } catch (error) {
    console.error('Error initializing data:', error.message);
  }
};

export default connectToMongoDB;
