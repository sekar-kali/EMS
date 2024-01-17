import express from 'express';
const adminRoutes = express.Router();
import { createStaff, getAllStaff } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

adminRoutes.get('/allstaff', authMiddleware, getAllStaff);
adminRoutes.post('/staff', authMiddleware, createStaff);


export default adminRoutes;
