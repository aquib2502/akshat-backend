// routes/expertRoutes.js
import express from 'express';
import {loginExpert, registerExpert, getExpertProfile, getExpertSummary, 
    updateAppointmentStatus, confirmAppointment,updateExpertProfile
     } from '../controllers/expertController.js';
import Appointment from '../models/appointmentModel.js';
import { authenticateExpert } from '../middleware/expertMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { getExpertAppointments } from '../controllers/appointmentController.js';
const router = express.Router();

// POST request for signup
router.post("/signup", registerExpert);

// POST request for login
router.post("/login", loginExpert);

// GET request for getting expert profile
router.get("/profile", authenticateExpert, getExpertProfile);

// PUT request for updating expert profile
router.put("/profile", authenticateExpert, updateExpertProfile);

// GET request for getting expert's appointments
router.get("/appointments", authenticateExpert, getExpertAppointments);

// POST request for confirming appointments (with status)
router.post("/confirm", authenticateExpert, confirmAppointment);

// GET request for getting expert summary (optional)
router.get("/summary", authenticateExpert, getExpertSummary);

router.patch('/update-status/:appointmentId', protect, updateAppointmentStatus);

export default router;
