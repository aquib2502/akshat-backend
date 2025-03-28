import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import appointmentRoutes from './routes/appointmentRoutes.js';
import questionnaireRoutes from './routes/questionnaireRoutes.js'
import summaryRoutes from './routes/summaryRoutes.js'
import expertRoutes from './routes/expertRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'

dotenv.config();

connectDB();

const app = express();

app.use(
    cors({
      origin: ["https://www.consultancy.code4bharat.com", "http://localhost:3000", "http://localhost:3001"], // Allow both origins
      credentials: true, // Allow cookies
    })
  );
  

app.use(express.json())
app.use(cookieParser())

app.get("/", (req,res) => {
    res.send("API is running...")
});

app.use('/api/auth', authRoutes);

app.use('/api/appointments', appointmentRoutes)

app.use("/api/questionnaire", questionnaireRoutes);

app.use('/api/summary', summaryRoutes);

app.use("/api/expert", expertRoutes);

app.use("/api/feedback", feedbackRoutes);

const PORT =process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));