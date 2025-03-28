import mongoose from 'mongoose';

const feedbackReportSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',  // Reference to the appointment
    required: true,
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
