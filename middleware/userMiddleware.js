import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add a console log to inspect the decoded token
        console.log('Decoded Token:', decoded);

        // Fetch user from database
        req.user = await User.findById(decoded.id).select('-password');

        // Check if user exists, if not, send error
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found. Please log in again.' });
        }

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};
