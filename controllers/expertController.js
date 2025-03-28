import Expert from '../models/expertModel.js'; // Expert model
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import Summary from '../models/summaryModel.js';
import Appointment from '../models/appointmentModel.js';

// Email Validation Regex
const emailRegex = /^(?!\.)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const mobileRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

// Register expert function
export const registerExpert = async (req, res) => {
    const { name, email, mobile, password, specialization } = req.body;

    try {
        // Validate input
        if (!name || !email || !mobile || !password || !specialization) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Validate Email, Mobile, and Password
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format!" });
        }

        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ success: false, message: "Mobile number must be 10 digits!" });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters with 1 uppercase letter and 1 special character!" });
        }

        // Check if expert already exists
        const expertExists = await Expert.findOne({ email });
        if (expertExists) {
            return res.status(400).json({ success: false, message: 'Expert already exists.' });
        }

        // Create new expert (password will be hashed by the schema pre-save hook)
        const expert = await Expert.create({ name, email, mobile, password, specialization });

        // Generate JWT token
        const token = jwt.sign({ id: expert._id, role: expert.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
        });

        // Send Confirmation Email
        sendConfirmationEmail(expert.email, expert.name);

        // Send Response
        res.status(201).json({
            success: true,
            message: 'Expert registered successfully.',
            expert: {
                id: expert._id,
                name: expert.name,
                email: expert.email,
                mobile: expert.mobile,
                specialization: expert.specialization,
                role: expert.role,
            },
            token,
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Failed to register expert.' });
    }
};


// Send Confirmation Email
const sendConfirmationEmail = (expertEmail, expertName) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: expertEmail,
        subject: "Registration Successful",
        text: `Hello ${expertName},\n\nYour registration was successful!\n\nThank you for joining us!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email Send Error:", error);
        } else {
            console.log("Registration Email Sent:", info.response);
        }
    });
};


// Login expert function
// Login function
export const loginExpert = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const expert = await Expert.findOne({ email })
      if (!expert) {
        return res.status(404).json({ success: false, message: 'Expert not found.' });
      }
  
      console.log("Entered Password: ", password); // Log entered password
      console.log("Stored Hashed Password: ", expert.password); // Log stored hashed password
  
      const isMatch = await bcrypt.compare(password, expert.password);
      console.log("Password Match Status: ", isMatch); // Log comparison result
  
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }
  
      const token = jwt.sign({ id: expert._id, role: expert.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
  
      res.status(200).json({
        success: true,
        message: 'Login successful.',
        expert: {
          id: expert._id,
          name: expert.name,
          email: expert.email,
          specialization: expert.specialization,
          role: expert.role,
        },
        token,
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ success: false, message: 'Failed to log in.' });
    }
  };
  

// Get Expert Profile function


// Get Expert Profile function
// Fetch Expert Profile
// In expertController.js
export const getExpertProfile = async (req, res) => {
  try {
      // Use req.user._id, assuming _id is stored in req.user by your authenticateExpert middleware
      const expert = await Expert.findById(req.user._id);  // Fixing to use req.user._id instead of req.user.id

      if (!expert) {
          return res.status(404).json({ success: false, message: "Expert not found" });
      }

      res.status(200).json({ success: true, expert });
  } catch (error) {
      console.error('Error fetching expert profile:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch expert profile' });
  }
};
// Update Expert Profile
export const updateExpertProfile = async (req, res) => {
  const { name, specialization, address, gender, profilePic } = req.body;
  const expertId = req.user._id;  // Assuming `req.user._id` contains the expert's ID from authentication middleware

  try {
      // Find the expert by their _id
      const expert = await Expert.findById(expertId);
      if (!expert) {
          return res.status(404).json({ success: false, message: 'Expert not found.' });
      }

      // Update fields with the new data from the request body
      expert.name = name || expert.name;
      expert.specialization = specialization || expert.specialization;
      expert.address = address || expert.address;
      expert.gender = gender || expert.gender;
      expert.profilePic = profilePic || expert.profilePic;

      // Save the updated expert data to the database
      const updatedExpert = await expert.save();

      // Return a success response with the updated expert data
      res.status(200).json({
          success: true,
          message: 'Profile updated successfully.',
          expert: {
              _id: updatedExpert._id,
              name: updatedExpert.name,
              email: updatedExpert.email,
              specialization: updatedExpert.specialization,
              address: updatedExpert.address,
              gender: updatedExpert.gender,
              profilePic: updatedExpert.profilePic,
          },
      });
  } catch (error) {
      console.error('Update Expert Profile Error:', error);
      res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};
  // In expertController.js
    export const getExpertSummary = async (req, res) => {
      try {
        const { userName } = req.query;  // Name of the user who booked the appointment
    
        // Fetch all appointments based on user name
        const appointments = await Appointment.find({ "user.name": userName });
    
        if (!appointments || appointments.length === 0) {
          return res.status(404).json({ success: false, message: 'No appointment found for this user.' });
        }
    
        // Fetch all summaries associated with the user
        const summaries = await Summary.find({ "user.name": userName });
    
        if (!summaries || summaries.length === 0) {
          return res.status(404).json({ success: false, message: 'No summaries found for this user.' });
        }
    
        res.status(200).json({ success: true, summaries });
      } catch (error) {
        console.error('Error fetching summaries:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch summaries' });
      }
    };

  export const confirmAppointment = async (req, res) => {
      const { appointmentId, status } = req.body;
    
      if (!appointmentId || !status) {
        return res.status(400).json({ success: false, message: "Appointment ID and status are required" });
      }
    
      try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
          return res.status(404).json({ success: false, message: "Appointment not found" });
        }
    
        // Update status
        appointment.status = status;
        await appointment.save();
    
      //   // If confirmed, send confirmation email
      //   if (status === "confirmed") {
      //     sendConfirmationEmail(appointment.user.email, appointment);
      //   }
    
        res.status(200).json({
          success: true,
          message: `Appointment ${status} successfully`,
          appointment,
        });
      } catch (error) {
        console.error('Error confirming appointment:', error);
        res.status(500).json({ success: false, message: 'Failed to confirm appointment' });
      }
    };
    
    export const updateAppointmentStatus = async (req, res) => {
        const { appointmentId } = req.params;
        const { status } = req.body; // 'confirmed' or 'rejected'
    
        try {
            // Find the appointment by ID
            const appointment = await Appointment.findById(appointmentId);
    
            if (!appointment) {
                return res.status(404).json({ success: false, message: 'Appointment not found' });
            }
    
            // Check if the expert is authorized to update this appointment (check expert's ID)
            if (appointment.expertId.toString() !== req.expert.id) {
                return res.status(403).json({ success: false, message: 'You are not authorized to update this appointment' });
            }
    
            // Validate status
            const validStatuses = ['pending', 'confirmed', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status' });
            }
    
            // Update appointment status
            appointment.status = status;
    
            // If confirmed, trigger email to the user
            if (status === 'confirmed') {
                const user = await User.findById(appointment.userId);
                sendConfirmationEmail(user.email, appointment); // Assuming you have a function for sending confirmation email
            }
    
            await appointment.save();
    
            res.status(200).json({
                success: true,
                message: 'Appointment status updated successfully',
                appointment,
            });
        } catch (error) {
            console.error('Error updating appointment status:', error);
            res.status(500).json({ success: false, message: 'Failed to update appointment status' });
        }
    };
    