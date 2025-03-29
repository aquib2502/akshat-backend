import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      "Career Guidance",
      "Parenting",
      "Family/Couple Counselling",
      "Depression/Anxiety/Stress",
      "Suicidal Thoughts",
      "Children/ Teen/ Students Counselling"
    ]
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,  // e.g., "10:00 AM"
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mode:{
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'report sent'], // Ensure that 'confirmed' is included here
    default: 'pending', // Default value
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  feedback: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
export default Appointment;
