import mongoose from 'mongoose';
import connectDB from '../consultancy-backend1/config/db.js';  // Adjust the import path based on where your DB connection file is located
import FeedbackQuestion from '../consultancy-backend1/models/feedbackQuestionModel.js';  // Adjust the import path based on your project structure

export const seedFeedbackQuestions = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Array of feedback questions (paste your array here)
    const feedbackQuestions = [
      {
        questionId: 1,
        category: "Career Guidance",
        text: "How would you rate the patient's overall readiness for career advancement?",
        type: "multiple-choice",
        options: ["Very Ready", "Ready", "Somewhat Ready", "Not Ready", "Very Unready"],
        nextRule: {
          "Very Ready": 2,
          "Ready": 2,
          "Somewhat Ready": 3,
          "Not Ready": 4,
          "Very Unready": 5
        }
      },
      {
        questionId: 2,
        category: "Career Guidance",
        text: "How confident is the patient in their ability to achieve their career goals?",
        type: "multiple-choice",
        options: ["Very Confident", "Confident", "Neutral", "Unconfident", "Very Unconfident"],
        nextRule: {
          "Very Confident": 3,
          "Confident": 3,
          "Neutral": 4,
          "Unconfident": 5,
          "Very Unconfident": 6
        }
      },
      {
        questionId: 3,
        category: "Career Guidance",
        text: "How clearly defined are the patient's career goals?",
        type: "multiple-choice",
        options: ["Very Clear", "Clear", "Somewhat Clear", "Unclear", "Not Defined"],
        nextRule: {
          "Very Clear": 7,
          "Clear": 7,
          "Somewhat Clear": 8,
          "Unclear": 9,
          "Not Defined": 10
        }
      },
      {
        questionId: 4,
        category: "Career Guidance",
        text: "How well does the patient understand the skills required to achieve their career goals?",
        type: "multiple-choice",
        options: ["Very Well", "Well", "Somewhat", "Poorly", "Very Poorly"],
        nextRule: {
          "Very Well": 7,
          "Well": 7,
          "Somewhat": 8,
          "Poorly": 9,
          "Very Poorly": 10
        }
      },
      {
        questionId: 5,
        category: "Career Guidance",
        text: "Does the patient demonstrate a willingness to learn new skills?",
        type: "multiple-choice",
        options: ["Very Willing", "Willing", "Neutral", "Unwilling", "Very Unwilling"],
        nextRule: {
          "Very Willing": 7,
          "Willing": 7,
          "Neutral": 8,
          "Unwilling": 9,
          "Very Unwilling": 10
        }
      },
      {
        questionId: 6,
        category: "Career Guidance",
        text: "How open is the patient to feedback and constructive criticism?",
        type: "multiple-choice",
        options: ["Very Open", "Open", "Somewhat Open", "Not Open", "Very Unopen"],
        nextRule: {
          "Very Open": 7,
          "Open": 7,
          "Somewhat Open": 8,
          "Not Open": 9,
          "Very Unopen": 10
        }
      },
      {
        questionId: 7,
        category: "Career Guidance",
        text: "How well does the patient manage their time and workload?",
        type: "multiple-choice",
        options: ["Excellent", "Good", "Average", "Needs Improvement", "Poor"],
        nextRule: {
          "Excellent": 8,
          "Good": 8,
          "Average": 9,
          "Needs Improvement": 10,
          "Poor": 10
        }
      },
      {
        questionId: 8,
        category: "Career Guidance",
        text: "How well does the patient handle stress and pressure in a work environment?",
        type: "multiple-choice",
        options: ["Very Well", "Well", "Somewhat", "Poorly", "Very Poorly"],
        nextRule: {
          "Very Well": 9,
          "Well": 9,
          "Somewhat": 10,
          "Poorly": 10,
          "Very Poorly": 10
        }
      },
      {
        questionId: 9,
        category: "Career Guidance",
        text: "What specific areas should the patient focus on for improvement in the near future?",
        type: "text",
        nextRule: {
          "default":10
        } // Next question ID for follow-up
      },
      {
        questionId: 10,
        category: "Career Guidance",
        text: "Do you have any additional comments or observations about the patient’s career development?",
        type: "text",
        nextRule:{
          "default": null // No next question, end of the feedback process
        } // No next question, end of the feedback process
      }
    ];
    

    
      

    // Remove all existing questions in the database
    await FeedbackQuestion.deleteMany({});

    // Save the new feedback questions into the database
    await FeedbackQuestion.insertMany(feedbackQuestions);

    console.log("Feedback questions seeded successfully.");
    mongoose.connection.close(); // Close the connection after seeding
  } catch (error) {
    console.error("Error seeding feedback questions:", error);
    mongoose.connection.close(); // Ensure the connection is closed even if an error occurs
  }
};

// Call the seed function
seedFeedbackQuestions();
