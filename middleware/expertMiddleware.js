// In expertMiddleware.js

import jwt from 'jsonwebtoken';
import Expert from '../models/expertModel.js';

export const authenticateExpert = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Get token from the Authorization header

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded token to ensure it contains the expected data (e.g., expert _id)
    console.log("Decoded Token:", decoded);

    // Ensure the payload contains the _id and attach it to req.user
    req.user = { _id: decoded.id };  // Make sure you're setting _id as part of req.user

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};