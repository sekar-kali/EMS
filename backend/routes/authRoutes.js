import express from 'express';
const authRoutes = express.Router();
import { login, signup } from '../controllers/authController.js';

//Post method routes
authRoutes.post('/signup', signup);
authRoutes.post('/login', login);

export default authRoutes;
