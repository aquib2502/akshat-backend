import express from "express";
import { saveSummary, getSummaryByAppointment } from "../controllers/summaryController.js";

const router = express.Router();

// Route for saving the summary after questionnaire submission
router.post("/save", saveSummary);

// Route for fetching the summary based on the appointment ID (for expert panel)
router.get("/:appointmentId", getSummaryByAppointment);

export default router;
