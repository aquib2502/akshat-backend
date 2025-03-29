import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';
import nodemailer from 'nodemailer';
import Expert from '../models/expertModel.js';

const MAX_APPOINTMENTS = 5; // Max number of appointments a user can book

// 🟢 Book an Appointment with Max Limit Constraint
export const bookAppointment = async (req, res) => {
    const { type, date, time, name, mobile, mode } = req.body;

    // Validate required fields
    if (!type || !date || !time || !name || !mobile || !mode) {
      return res.status(400).json({
        success: false,
        message: "All fields (type, date, time, name, mobile, mode) are required.",
      });
    }

    try {
      const userId = req.user.id;

      // 🟢 Check if the selected date and time is already booked
      const existingAppointment = await Appointment.findOne({ date, time });
      if (existingAppointment) {
        return res.status(400).json({
          success: false,
          message: "The selected date and time is already booked. Please choose a different time.",
        });
      }

      // 🟢 Count existing appointments by user
      const userAppointments = await Appointment.countDocuments({ user: userId });

      if (userAppointments >= MAX_APPOINTMENTS) {
        return res.status(400).json({
          success: false,
          message: "You have reached the maximum limit of 5 appointments.",
        });
      }

      const isFirstAppointment = userAppointments === 0;

      // 🟢 Create a new appointment
      const appointment = new Appointment({
        user: userId,
        type,
        date,
        time,
        name,
        mobile,
        mode,
        status: "pending", // Default
        paymentStatus: "completed", // Free appointments
      });

      await appointment.save();

      res.status(201).json({
        success: true,
        message: isFirstAppointment
          ? "First appointment booked. Redirect to questionnaire."
          : "Appointment booked successfully.",
        redirectToQuestionnaire: isFirstAppointment,
        appointment,
      });
    } catch (error) {
      console.error("Book Appointment Error:", error);
      res.status(500).json({ success: false, message: "Failed to book appointment." });
    }
};
  
// 🟡 Initiate Payment (Generate Payment Link)
// This section is commented out because we are not using payment integration now.
/*
export const initiateAppointmentPayment = async (req, res) => {
    const { appointmentId } = req.body;

    if (!appointmentId) {
        return res.status(400).json({ success: false, message: 'Appointment ID is required.' });
    }

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found.' });
        }

        if (appointment.paymentStatus === 'completed') {
            return res.status(400).json({ success: false, message: 'Payment already completed.' });
        }

        // Simulated Payment Link (Replace with actual gateway)
        const paymentLink = `https://payment-gateway.com/pay?appointmentId=${appointmentId}&amount=1000`;

        res.status(200).json({
            success: true,
            message: 'Payment link generated successfully.',
            paymentLink,
            appointment
        });
    } catch (error) {
        console.error('Payment Link Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate payment link.' });
    }
};
*/






// Get Appointments for the Authenticated User
export const getUserAppointments = async (req, res) => {
    try {
        // Use req.user (if set by auth middleware) or fallback to req.body.user
        const userId = req.user ? req.user.id : req.body.user;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }

        const appointments = await Appointment.find({ user: userId }).sort({ date: 1 });

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error('Get Appointments Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch appointments.' });
    }
};


  // In appointmentController.js
  export const getExpertAppointments = async (req, res) => {
    try {
        // Fetch all appointments from the database without expert filtering
        const appointments = await Appointment.find({}).sort({ date: 1 });

        // Filter appointments based on their status (pending and confirmed)
        const pendingAppointments = appointments.filter(appointment => appointment.status === 'pending');
        const confirmedAppointments = appointments.filter(appointment => appointment.status === 'confirmed');

        // Send the filtered appointments back as a response
        res.status(200).json({
            success: true,
            appointments: {
                pending: pendingAppointments,
                confirmed: confirmedAppointments
            }
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
    }
};

// In your backend controller (e.g., appointmentController.js)
export const updateAppointmentStatus = async (req, res) => {
  const { appointmentId, status } = req.body;

  if (!appointmentId || !status) {
    return res.status(400).json({ success: false, message: 'Appointment ID and status are required.' });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Update the status of the appointment
    appointment.status = status;
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment status updated successfully.' });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment status.' });
  }
};

  
  
  
