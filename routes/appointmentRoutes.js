import express from 'express';
import {
    bookAppointment,
    getUserAppointments,
     getExpertAppointments, updateAppointmentStatus
    
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authenticateExpert } from '../middleware/expertMiddleware.js';
// import { getExpertProfile } from '../controllers/expertController.js';

const router = express.Router();

// 🟢 Book Appointment & Generate Payment Link
router.post('/book', protect, bookAppointment);

// 🟡 Initiate Payment for Existing Appointment
// router.post('/initiate-payment', protect, initiateAppointmentPayment);

// ✅ Confirm Appointment After Payment
// router.post('/confirm', protect, confirmAppointment);

// 🔍 Get User's Appointments
router.get('/user', protect, getUserAppointments);



// ❌ Cancel Appointment
// router.delete('/cancel/:appointmentId', protect, cancelAppointment);

// Route to update appointment status (accept/reject)
router.post('/updateStatus/', updateAppointmentStatus);


router.get('/expert', authenticateExpert, getExpertAppointments);

// router.get('/confirm', authenticateExpert, confirmAppointment)


// 📝 Submit Feedback
// router.post('/feedback', protect, submitFeedback);

export default router;
