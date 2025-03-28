import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/questionnaireModel.js'; // adjust the path if necessary

dotenv.config();

const questions = [
  {
    questionId: 1,
    category: "Career Guidance",
    text: "What is your preferred career field?",
    type: "multiple_choice",
    options: ["Technology", "Health", "Finance", "Education", "Arts", "Other"],
    nextRule: { "Technology": 3, Health: 3, Finance: 3, Education: 3, Arts: 3, Other: 3 },
  },
  {
    questionId: 2,
    category: "Career Guidance",
    text: "What is your highest level of education?",
    type: "multiple_choice",
    options: ["High School", "Undergraduate", "Postgraduate", "Other"],
    nextRule: { "High School": 4, "Undergraduate": 4, "Postgraduate": 4, "Other": 4 },
  },
  {
    questionId: 3,
    category: "Career Guidance",
    text: "Which of the following interests you the most?",
    type: "multiple_choice",
    options: ["Technology", "Health", "Finance", "Education", "Arts", "Other"],
    nextRule: { Technology: 5, Health: 5, Finance: 5, Education: 5, Arts: 5, Other: 5 },
  },
  {
    questionId: 4,
    category: "Career Guidance",
    text: "Do you have any prior work experience in your chosen field?",
    type: "yesno",
    options: ["Yes", "No"],
    nextRule: { Yes: 5, No: 6 },
  },
  {
    questionId: 5,
    category: "Career Guidance",
    text: "How many years of experience do you have in your chosen field?",
    type: "multiple_choice",
    options: ["Less than 1 year", "1-3 years", "3-5 years", "5+ years"],
    nextRule: { "Less than 1 year": 7, "1-3 years": 7, "3-5 years": 7, "5+ years": 7 },
  },
  {
    questionId: 6,
    category: "Career Guidance",
    text: "Would you like to pursue additional education or training to advance your career?",
    type: "yesno",
    options: ["Yes", "No"],
    nextRule: { Yes: 7, No: 8 },
  },
  {
    questionId: 7,
    category: "Career Guidance",
    text: "What type of additional education or training would you consider?",
    type: "multiple_choice",
    options: ["Certification", "Degree", "Workshops", "Online Courses", "Other"],
    nextRule: { Certification: 9, Degree: 9, Workshops: 9, "Online Courses": 9, Other: 9 },
  },
  {
    questionId: 8,
    category: "Career Guidance",
    text: "What challenges do you face in your career growth?",
    type: "multiple_choice",
    options: ["Lack of opportunities", "Skill gap", "Lack of mentorship", "Work-life balance", "Other"],
    nextRule: { "Lack of opportunities": 10, "Skill gap": 10, "Lack of mentorship": 10, "Work-life balance": 10, Other: 10 },
  },
  {
    questionId: 9,
    category: "Career Guidance",
    text: "What type of work environment do you thrive in?",
    type: "multiple_choice",
    options: ["Corporate", "Start-up", "Freelance", "Non-profit", "Other"],
    nextRule: { Corporate: 11, "Start-up": 11, Freelance: 11, "Non-profit": 11, Other: 11 },
  },
  {
    questionId: 10,
    category: "Career Guidance",
    text: "Do you prefer working alone or in a team?",
    type: "multiple_choice",
    options: ["Alone", "In a Team"],
    nextRule: { Alone: 12, "In a Team": 12 },
  },
  {
    questionId: 11,
    category: "Career Guidance",
    text: "What motivates you the most in your career?",
    type: "multiple_choice",
    options: ["Recognition", "Growth opportunities", "Work-life balance", "Salary", "Other"],
    nextRule: { Recognition: 13, "Growth opportunities": 13, "Work-life balance": 13, Salary: 13, Other: 13 },
  },
  {
    questionId: 12,
    category: "Career Guidance",
    text: "Would you consider changing industries for better career prospects?",
    type: "yesno",
    options: ["Yes", "No"],
    nextRule: { Yes: 13, No: 14 },
  },
  {
    questionId: 13,
    category: "Career Guidance",
    text: "Which industry would you like to transition to?",
    type: "multiple_choice",
    options: ["Technology", "Health", "Finance", "Education", "Other"],
    nextRule: { Technology: 15, Health: 15, Finance: 15, Education: 15, Other: 15 },
  },
  {
    questionId: 14,
    category: "Career Guidance",
    text: "What skills do you want to develop for your career?",
    type: "multiple_choice",
    options: ["Leadership", "Communication", "Technical Skills", "Problem Solving", "Other"],
    nextRule: { Leadership: 16, Communication: 16, "Technical Skills": 16, "Problem Solving": 16, Other: 16 },
  },
  {
    questionId: 15,
    category: "Career Guidance",
    text: "Would you be interested in mentoring others in your field?",
    type: "yesno",
    options: ["Yes", "No"],
    nextRule: { Yes: 17, No: 18 },
  },
  {
    questionId: 16,
    category: "Career Guidance",
    text: "Would you like to take on more leadership roles in your career?",
    type: "yesno",
    options: ["Yes", "No"],
    nextRule: { Yes: 18, No: 18 },
  },
  {
    questionId: 17,
    category: "Career Guidance",
    text: "What type of leadership roles would you like to pursue?",
    type: "multiple_choice",
    options: ["Team Leader", "Manager", "Director", "Executive", "Other"],
    nextRule: { "Team Leader": 19, Manager: 19, Director: 19, Executive: 19, Other: 19 },
  },
  {
    questionId: 18,
    category: "Career Guidance",
    text: "What are your future career aspirations?",
    type: "multiple_choice",
    options: ["Become an Expert", "Start My Own Business", "Climb the Corporate Ladder", "Other"],
    nextRule: { "Become an Expert": 20, "Start My Own Business": 20, "Climb the Corporate Ladder": 20, Other: 20 },
  },
  {
    questionId: 19,
    category: "Career Guidance",
    text: "What level of responsibility do you prefer in your career?",
    type: "multiple_choice",
    options: ["Low", "Medium", "High"],
    nextRule: { Low: 20, Medium: 20, High: 20 },
  },
  {
    questionId: 20,
    category: "Career Guidance",
    text: "What work-life balance do you seek?",
    type: "multiple_choice",
    options: ["Very Balanced", "Moderate", "Not Important"],
    nextRule: { "Very Balanced": 21, Moderate: 21, "Not Important": 21 },
  },
  {
    questionId: 21,
    category: "Career Guidance",
    text: "How much do you value job stability?",
    type: "multiple_choice",
    options: ["Very Important", "Moderately Important", "Not Important"],
    nextRule: { "Very Important": 22, "Moderately Important": 22, "Not Important": 22 },
  },
  {
    questionId: 22,
    category: "Career Guidance",
    text: "Are you willing to relocate for better career opportunities?",
    type: "yesno",
    options: ["Yes", "No"],
    nextRule: { Yes: 23, No: 24 },
  },
  {
    questionId: 23,
    category: "Career Guidance",
    text: "What regions would you consider relocating to?",
    type: "multiple_choice",
    options: ["North America", "Europe", "Asia", "Other"],
    nextRule: { "North America": 25, Europe: 25, Asia: 25, Other: 25 },
  },
  {
    questionId: 24,
    category: "Career Guidance",
    text: "Are you interested in remote work opportunities?",
    type: "yesno",
    options: ["Yes", "No"],
    nextRule: { Yes: 25, No: 26 },
  },
  {
    questionId: 25,
    category: "Career Guidance",
    text: "What benefits are most important to you in a job?",
    type: "multiple_choice",
    options: ["Health Insurance", "Retirement Plans", "Paid Time Off", "Other"],
    nextRule: { "Health Insurance": 27, "Retirement Plans": 27, "Paid Time Off": 27, Other: 27 },
  },
  {
    questionId: 26,
    category: "Career Guidance",
    text: "What is your ideal company culture?",
    type: "multiple_choice",
    options: ["Collaborative", "Competitive", "Innovative", "Traditional", "Other"],
    nextRule: { Collaborative: 28, Competitive: 28, Innovative: 28, Traditional: 28, Other: 28 },
  },
  {
    questionId: 27,
    category: "Career Guidance",
    text: "How do you prefer to receive feedback at work?",
    type: "multiple_choice",
    options: ["Frequent feedback", "Occasional feedback", "As needed", "No preference"],
    nextRule: { "Frequent feedback": 29, "Occasional feedback": 29, "As needed": 29, "No preference": 29 },
  },
  {
    questionId: 28,
    category: "Career Guidance",
    text: "Do you prefer structured tasks or more flexibility in your work?",
    type: "multiple_choice",
    options: ["Structured tasks", "Flexibility", "A mix of both"],
    nextRule: { "Structured tasks": 30, Flexibility: 30, "A mix of both": 30 },
  },
  {
    questionId: 29,
    category: "Career Guidance",
    text: "How important is work environment for your job satisfaction?",
    type: "multiple_choice",
    options: ["Very important", "Somewhat important", "Not important"],
    nextRule: { "Very important": 30, "Somewhat important": 30, "Not important": 30 },
  },
  {
    questionId: 30,
    category: "Career Guidance",
    text: "Are you satisfied with your current career progression?",
    type: "yesno",
    options: ["Yes", "No"],
    nextRule: { Yes: null, No: null }, // End of the questionnaire
  },
];

const seedQuestions = async () => {
  try {
    // Connect to MongoDB using your connection string from .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing questions
    await Question.deleteMany({});
    console.log("Existing questions cleared.");

    // Insert the questions
    const inserted = await Question.insertMany(questions);
    console.log("Questions seeded successfully.");
    console.log("Inserted questions:", inserted);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding questions:", error);
    await mongoose.connection.close();
  }
};

seedQuestions();
