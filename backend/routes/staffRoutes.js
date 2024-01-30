import express from 'express';
import {
  getStaffMissions,
  getStaffLeaveRequests,
  createLeaveRequest,
  changeDetailsRequest,
  getStaffInfo,
  uploadDocument,
  getTotalApprovedLeaveRequests,
  getTotalMissions,
  deleteStaffLeaveRequest,
} from '../controllers/staffController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const staffRoutes = express.Router();

//Get method routes
staffRoutes.get('/info/:email', getStaffInfo);
staffRoutes.get('/missions/:email', getStaffMissions);
staffRoutes.get('/leave-requests/:email', getStaffLeaveRequests);

//Post method routes
staffRoutes.post('/change-details-request', changeDetailsRequest);
staffRoutes.post('/create-leave-request', createLeaveRequest);
staffRoutes.post('/leave-request/upload-document',authMiddleware,uploadDocument);
staffRoutes.post('/leave-requests/approved',authMiddleware,getTotalApprovedLeaveRequests)
staffRoutes.post('/missions/total',authMiddleware,getTotalMissions)

// Delete method routes
staffRoutes.delete('/delete-leave-request/:leaveRequestId',authMiddleware,deleteStaffLeaveRequest)
export default staffRoutes;
