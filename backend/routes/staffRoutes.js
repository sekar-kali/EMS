import express from 'express';
import {
  getStaffMissions,
  getStaffLeaveRequests,
  createLeaveRequest,
  changeDetailsRequest,
  getStaffInfo,
  uploadDocument,
} from '../controllers/staffController.js';

const staffRoutes = express.Router();

staffRoutes.get('/info/:email', getStaffInfo);
staffRoutes.post('/change-details-request', changeDetailsRequest);
staffRoutes.get('/missions', getStaffMissions);
staffRoutes.get('/leave-requests', getStaffLeaveRequests);
staffRoutes.post('/create-leave-request', createLeaveRequest);
staffRoutes.post('/leave-request/upload-document', uploadDocument);
staffRoutes.post('/change-details-request', changeDetailsRequest);

export default staffRoutes;
