// staffRoutes.js

import express from 'express';
import {
  getStaffMissions,
  getStaffLeaveRequests,
  createLeaveRequest,
  changeDetailsRequest,
  getStaffInfo,
} from '../controllers/staffController.js';

const staffRoutes = express.Router();

staffRoutes.get('/info/:email', getStaffInfo);
staffRoutes.get('/missions', getStaffMissions);
staffRoutes.get('/leaveRequests', getStaffLeaveRequests);
staffRoutes.post('/createLeaveRequest', createLeaveRequest);
staffRoutes.post('/changeDetailsRequest', changeDetailsRequest);

export default staffRoutes;
