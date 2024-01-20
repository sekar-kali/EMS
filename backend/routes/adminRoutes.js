import express from 'express';
const adminRoutes = express.Router();
import { approveLeaveRequest, createMission, createStaff, getAllMissions, getAllStaff, getLeaveRequests, getStaffList, rejectLeaveRequest } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

adminRoutes.post('/create-mission', authMiddleware, createMission);
adminRoutes.get('/mission-list', authMiddleware, getAllMissions);
adminRoutes.get('/allstaff', authMiddleware, getAllStaff);
adminRoutes.get('/staff-list', authMiddleware, getStaffList);
adminRoutes.post('/create-staff', authMiddleware, createStaff);
adminRoutes.get('/leave-request', authMiddleware, getLeaveRequests);
adminRoutes.put('/approve-leave-request', authMiddleware, approveLeaveRequest);
adminRoutes.put('/reject-leave-request', authMiddleware, rejectLeaveRequest);



export default adminRoutes;
