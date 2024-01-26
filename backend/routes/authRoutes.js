import express from 'express';
const authRoutes = express.Router();
import { createPassword, login, requestPasswordReset, resetPassword, signup } from '../controllers/authController.js';

//Post method routes
authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/reset-password', resetPassword);
authRoutes.post('/forget-password', requestPasswordReset);
authRoutes.post('/create-password/:email', createPassword);

export default authRoutes;
