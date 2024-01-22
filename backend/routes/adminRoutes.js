import express from 'express';
const adminRoutes = express.Router();
import { approveLeaveRequest, createMission, createStaff, getAllMissions, getAllStaff, getAvailableStaff, getDashboardStats, getLeaveRequests, getStaffList, rejectLeaveRequest } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

//Get method routes
adminRoutes.get('/mission-list', authMiddleware, getAllMissions);
adminRoutes.get('/allstaff', authMiddleware, getAllStaff);
adminRoutes.get('/staff-list', authMiddleware, getStaffList);
adminRoutes.get('/dashboard-stats', getDashboardStats);
adminRoutes.get('/leave-request', authMiddleware, getLeaveRequests);
adminRoutes.get('/api/admin/staff/available', getAvailableStaff);

//Post method routes
adminRoutes.post('/create-mission', authMiddleware, createMission);
adminRoutes.post('/create-staff', authMiddleware, createStaff);

//Put method routes
adminRoutes.put('/approve-leave-request', authMiddleware, approveLeaveRequest);
adminRoutes.put('/reject-leave-request', authMiddleware, rejectLeaveRequest);



export default adminRoutes;
