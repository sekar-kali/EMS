import express from 'express';
const adminRoutes = express.Router();
import {
  approveLeaveRequest,
  createMission,
  createStaff,
  deleteStaff,
  getAllMissions,
  getAllStaff,
  getAvailableStaff,
  getDashboardStats,
  getLeaveRequests,
  getStaffList,
  rejectLeaveRequest,
  updateStaff
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Get method routes
adminRoutes.get('/missions-list', authMiddleware, getAllMissions);
adminRoutes.get('/allstaff', authMiddleware, getAllStaff);
adminRoutes.get('/staff-list', authMiddleware, getStaffList);
adminRoutes.get('/dashboard-stats', authMiddleware, getDashboardStats);
adminRoutes.get('/leave-request', authMiddleware, getLeaveRequests);
adminRoutes.get('/staff/available', authMiddleware, getAvailableStaff);

// Post method routes
adminRoutes.post('/create-mission', authMiddleware, createMission);
adminRoutes.post('/create-staff', authMiddleware, createStaff);
adminRoutes.put('/update-staff/staffId', authMiddleware, updateStaff);

// Put method routes
adminRoutes.put('/approve-leave-request/:leaveRequestId', authMiddleware, approveLeaveRequest);
adminRoutes.put('/reject-leave-request/:leaveRequestId', authMiddleware, rejectLeaveRequest);

// Delete method routes
adminRoutes.delete('/delete-staff/:staffId', authMiddleware, deleteStaff);

export default adminRoutes;

