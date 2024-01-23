import express from 'express';
const adminRoutes = express.Router();
import { approveLeaveRequest, createMission, createStaff, deleteStaff, getAllMissions, getAllStaff, getAvailableStaff, getDashboardStats, getLeaveRequests, getStaffList, rejectLeaveRequest, updateStaff } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

//Get method routes
adminRoutes.get('/missions-list', authMiddleware, getAllMissions);
adminRoutes.get('/allstaff', authMiddleware, getAllStaff);
adminRoutes.get('/staff-list', authMiddleware, getStaffList);
adminRoutes.get('/dashboard-stats', getDashboardStats);
adminRoutes.get('/leave-request', authMiddleware, getLeaveRequests);
adminRoutes.get('/staff/available', getAvailableStaff);

//Post method routes
adminRoutes.post('/create-mission', authMiddleware, createMission);
adminRoutes.post('/create-staff', authMiddleware, createStaff);
adminRoutes.post('/update-staff', authMiddleware, updateStaff);

//Put method routes
adminRoutes.put('/approved-leave-request', authMiddleware, approveLeaveRequest);
adminRoutes.put('/rejected-leave-request', authMiddleware, rejectLeaveRequest);

//Delete method routes
adminRoutes.delete('/delete-staff', authMiddleware, deleteStaff);



export default adminRoutes;
