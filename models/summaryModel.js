import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',  // Reference to the appointment
    required: true,
  },
  responses: {
    type: Object,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  expertReviewed: {
    type: Boolean,
    default: false,  // Initially false, can be updated after expert review
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',  // Optional: if you want to track the expert who reviewed
  },
  reviewDate: {
    type: Date,
  },
}, { timestamps: true });

const Summary = mongoose.models.Summary || mongoose.model('Summary', summarySchema);
export default Summary;
