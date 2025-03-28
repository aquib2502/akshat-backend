import mongoose from 'mongoose';

const feedbackReportSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Link to the user who made the appointment
    required: true,
  },
  userName: {
    type: String,
    required: true,  // Save the user's name
  },
  userMobile: {
    type: String,
    required: true,  // Save the user's mobile number
  },
  responses: {
    type: Object,
    required: true,  // Store the responses for the feedback questionnaire
  },
  feedbackSummary: {
    type: String,
    required: true,  // The processed summary from Gemini
  },
  expertReviewed: {
    type: Boolean,
    default: false,  // Initially false, can be updated after expert review
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',  // Optional: to track the expert who reviewed the report
  },
  reviewDate: {
    type: Date,
  },
}, { timestamps: true });

const FeedbackReport = mongoose.models.FeedbackReport || mongoose.model('FeedbackReport', feedbackReportSchema);
export default FeedbackReport;