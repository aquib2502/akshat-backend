import express from 'express';
import { getStartingFeedbackQuestion, getNextFeedbackQuestion, submitFeedbackReport } from '../controllers/feedbackController.js';

const router = express.Router();

// GET endpoint to fetch the starting feedback question for a given appointment
router.get("/start", getStartingFeedbackQuestion);

// GET endpoint to fetch the next feedback question based on current answer
router.get('/:nextQuestionId', getNextFeedbackQuestion);

// POST endpoint to submit the feedback responses
router.post("/submit", submitFeedbackReport);

export default router;
