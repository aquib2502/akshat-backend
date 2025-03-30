import Question from "../models/questionnaireModel.js";
import Summary from "../models/summaryModel.js";
import dotenv from 'dotenv';
import fetchwithRetry from "../utils/fetchwithRetry.js"; // For retrying API requests
import Appointment from "../models/appointmentModel.js";

dotenv.config();

// Controller to get the first question for a given category
export const getStartingQuestion = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required." });
    }

    const firstQuestion = await Question.findOne({ category, questionId: 1 });

    if (!firstQuestion) {
      return res.status(404).json({ success: false, message: "No questions found for this category." });
    }

    res.status(200).json({ success: true, question: firstQuestion });
  } catch (error) {
    console.error("Error fetching starting question:", error);
    res.status(500).json({ success: false, message: "Failed to fetch starting question." });
  }
};


// Controller to get the next question based on the current answer
export const getNextQuestion = async (req, res) => {
  try {
    const { category, currentQuestionId, answer } = req.query;
    const { nextQuestionId } = req.params; // Get nextQuestionId from route params

    if (!category || !currentQuestionId || !answer) {
      return res.status(400).json({ success: false, message: "Category, currentQuestionId, and answer are required." });
    }

    // Fetch the current question using currentQuestionId
    const currentQuestion = await Question.findOne({ category, questionId: Number(currentQuestionId) });

    if (!currentQuestion) {
      return res.status(404).json({ success: false, message: "Current question not found." });
    }

    // Get the next question ID based on the current answer
    const nextQuestion = await Question.findOne({ category, questionId: Number(nextQuestionId) });

    if (!nextQuestion) {
      return res.status(404).json({ success: false, message: "Next question not found." });
    }

    // Return the next question
    res.status(200).json({ success: true, question: nextQuestion });
  } catch (error) {
    console.error("Error fetching next question:", error);
    res.status(500).json({ success: false, message: "Failed to fetch the next question." });
  }
};


export const submitQuestionnaire = async (req, res) => {
  try {
    const { appointmentId, responses } = req.body;

    if (!appointmentId || !responses || Object.keys(responses).length === 0) {
      return res.status(400).json({ success: false, message: "Appointment ID and responses are required." });
    }

    // Fetch the appointment details from the Appointment model
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    const { name, type, mode } = appointment;

    // Format the prompt for the Gemini API
    const prompt = `Summarize the following questionnaire responses for expert review in paragraph with highlighting key words:\n${JSON.stringify(responses, null, 2)}`;

    // Call the Gemini API with retries
    const geminiResponse = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
        timeout: 10000, // Timeout set to 10 seconds
      }
    );

    // Check if the response is okay
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API Response Error:", errorText);
      throw new Error(`Gemini API Error: ${geminiResponse.statusText}`);
    }

    // Parse the response from Gemini
    const data = await geminiResponse.json();
    console.log("Gemini API Response Data:", data);  // Log the response for debugging

    // Check if the response contains the correct structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Gemini API response does not contain the expected 'content' in candidates.");
      throw new Error("Gemini API response does not contain the expected 'content' in candidates.");
    }

    // If the content is an object, extract the actual string
    const summary = typeof data.candidates[0].content === 'object' ? JSON.stringify(data.candidates[0].content) : data.candidates[0].content;

    // Log the summary
    console.log("Formatted Summary from Gemini:", summary);

    // Save the summary, responses, and appointment details to the database
    await Summary.create({
      appointmentId,
      name,  // Save the name from the appointment
      type,  // Save the type from the appointment
      mode,  // Save the mode from the appointment
      responses,
      summary,  // Save the summary in the database
    });

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error in submitQuestionnaire:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate summary from questionnaire responses.",
    });
  }
};

const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries === 0) {
      throw error; // No more retries left, throw the error
    }
    console.log(`Retrying... attempts remaining: ${retries}`);
    await new Promise(resolve => setTimeout(resolve, delay)); // Exponential backoff
    return fetchWithRetry(url, options, retries - 1, delay * 2); // Retry with doubled delay
  }
};


