// models/feedbackQuestionModel.js
import mongoose from 'mongoose';

const feedbackQuestionSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Career Guidance', 'Parenting', 'Family/Couple Counselling', 'Depression/Anxiety/Stress', 'Suicidal Thoughts', 'Children/Teen/Students Counselling'],
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g., 'mcq', 'text'
  },
  options: {
    type: [String],
    default: [],
  },
  nextRule: {
    type: Map,
    of: Number,
    default: function () {
      return { 'default': this.questionId + 1 }; // Default next rule points to the next question
    },
  },
}, { timestamps: true });

const FeedbackQuestion = mongoose.models.FeedbackQuestion || mongoose.model('FeedbackQuestion', feedbackQuestionSchema);
export default FeedbackQuestion;
