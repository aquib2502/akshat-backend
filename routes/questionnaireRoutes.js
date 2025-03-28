import express from "express";
import { 
  getStartingQuestion, 
  getNextQuestion, 
  submitQuestionnaire 
} from "../controllers/questionnaireController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET endpoint to fetch the starting question for a category
router.get("/start", protect, getStartingQuestion);

// GET endpoint to fetch a question by its ID (optionally filtering by category)
router.get('/:nextQuestionId', getNextQuestion);

// POST endpoint to submit the questionnaire responses
router.post("/submit", protect, submitQuestionnaire);

export default router;
