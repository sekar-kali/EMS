import express from 'express';
const authRoutes = express.Router();
import { createPassword, login, signup } from '../controllers/authController.js';

//Post method routes
authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/create-password/:email', createPassword);

export default authRoutes;
