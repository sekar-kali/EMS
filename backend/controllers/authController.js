import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import StaffModel from '../models/Staff.js';

const generateToken = (userId) => {
  // Generate a JSON Web Token (JWT)
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_TOKEN });
};

export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName} = req.body;

    // Check if the email is already registered
    const existingUser = await StaffModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new StaffModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT for the new user
    const token = generateToken(newUser._id);

    // Update the user immediately after saving
    await StaffModel.updateOne(
      { _id: newUser._id },
      { $set: { email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName, password: newUser.password }});

    // Return the token and user details as JSON
    res.json({ token, userId: newUser._id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName, password: newUser.password });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await StaffModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT for the user
    const token = generateToken(user._id);

    // Return the token and user details as JSON
    res.json({ token, userId: user._id, email: user.email });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const { userId } = req.userData;

    // Assuming to receive updated details from the request body
    const { newFirstName, newLastName } = req.body;

    // Fetch the user from the database using the userId
    const user = await StaffModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.firstName = newFirstName;
    user.lastName = newLastName;

    // Save the updated user details to the database
    await user.save();

    // Return success message as JSON
    res.json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user with the provided email exists
    const user = await StaffModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique reset token (you may want to store this in the database)
    const resetToken = jwt.sign({ userId: user._id }, process.env.RESET_SECRET, { expiresIn: process.env.JWT_EXPIRES_TOKEN });

    // Send a password reset email with the reset token
    const transporter = nodemailer.createTransport({
      // Configure nodemailer transporter
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.MAIL,
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    // Return success message as JSON
    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the reset token
    const decodedToken = jwt.verify(token, process.env.RESET_SECRET);

    // Fetch the user from the database using the decoded token
    const user = await StaffModel.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;

    await user.save();

    // Return success message as JSON
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};