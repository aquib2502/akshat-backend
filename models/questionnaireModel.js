// models/questionModel.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Career Guidance",
      "Parenting",
      "Family/Couple Counselling",
      "Depression/Anxiety/Stress",
      "Suicidal Thoughts",
      "Children/Teen/Students Counselling",
    ],
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g., 'yesno', 'number', 'text', 'info'
  },
  options: {
    type: [String],
    default: [],
  },
  // nextRule: Map storing the mapping for adaptive flow: answer => next question id
  nextRule: {
    type: Map,
    of: Number,
    default: function() {
      return { "default": this.questionId + 1 };  // Default next rule points to the next question
    },
  },
});

questionSchema.index({ category: 1, questionId: 1 }, { unique: true });

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
export default Question;
