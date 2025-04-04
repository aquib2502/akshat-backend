import FeedbackReport from "../models/feedbackReportModel.js"; // Import the feedback report model
import FeedbackQuestion from "../models/feedbackQuestionModel.js";
import fetchWithRetry from "../utils/fetchwithRetry.js"; // Import the questionnaire model
import Appointment from "../models/appointmentModel.js"; // Import the appointment model

// Controller to get the starting question for feedback
export const getStartingFeedbackQuestion = async (req, res) => {
  try {
    const { appointmentId } = req.query; // Get appointmentId from query params

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required." });
    }

    // Fetch the first feedback question from the database
    const startingQuestion = await FeedbackQuestion.findOne({ questionId: 1 });

    if (!startingQuestion) {
      return res.status(404).json({ success: false, message: "Starting feedback question not found." });
    }

    res.status(200).json({ success: true, question: startingQuestion });
  } catch (error) {
    console.error("Error fetching starting feedback question:", error);
    res.status(500).json({ success: false, message: "Failed to fetch starting feedback question." });
  }
};

// Controller to get the next feedback question based on the expert's answer
    export const getNextFeedbackQuestion = async (req, res) => {
        try {
        const { currentQuestionId, answer } = req.query;
    
        if (!currentQuestionId || !answer) {
            return res.status(400).json({ success: false, message: "Current question ID and answer are required." });
        }
    
        // Use FeedbackQuestion instead of Question
        const currentQuestion = await FeedbackQuestion.findOne({ questionId: Number(currentQuestionId) });
    
        if (!currentQuestion) {
            return res.status(404).json({ success: false, message: "Current feedback question not found." });
        }
    
        // Use Map.get() to get the next question ID
        const nextQuestionId = currentQuestion.nextRule.get(answer);
    
        // Check if nextQuestionId is null or undefined (i.e., end of the feedback process)
        if (nextQuestionId === null || nextQuestionId === undefined) {
            return res.status(200).json({ success: true, message: "End of feedback" }); // Indicate that feedback is done
        }
    
        const nextQuestion = await FeedbackQuestion.findOne({ questionId: nextQuestionId });
    
        if (!nextQuestion) {
            return res.status(404).json({ success: false, message: "Next feedback question not found." });
        }
    
        res.status(200).json({ success: true, question: nextQuestion });
        } catch (error) {
        console.error("Error fetching next feedback question:", error);
        res.status(500).json({ success: false, message: "Failed to fetch next feedback question." });
        }
    };



// Controller to submit feedback responses and process them via Gemini API
export const submitFeedbackReport = async (req, res) => {
  try {
    const { appointmentId, responses } = req.body;

    // Check if the required data exists
    if (!appointmentId || !responses || Object.keys(responses).length === 0) {
      return res.status(400).json({ success: false, message: "Appointment ID and responses are required." });
    }

    // Fetch the appointment based on the appointmentId
    const appointment = await Appointment.findById(appointmentId).populate('user', 'name');  // Populate the user field (only 'name' for simplicity)
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    // Extract userId, name from the populated user field, and mobile from the appointment document
    const userId = appointment.user._id;
    const userName = appointment.user.name;
    const userMobile = appointment.mobile;  // Extract the mobile directly from the appointment document

    // Check if the mobile number is missing
    if (!userMobile) {
      return res.status(400).json({ success: false, message: "Mobile number is missing for the user." });
    }

    // Format the prompt for the Gemini API
    const prompt = `Make a report of the following responses for the pateint in brief :\n${JSON.stringify(responses, null, 2)}`;

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

    // Save the feedback report to the database, including the userId, name, and mobile
    const feedbackReport = await FeedbackReport.create({
      appointmentId,
      userId,  // Link the feedback report to the user
      userName,  // Save the user's name
      userMobile,  // Save the user's mobile number
      responses,
      feedbackSummary: summary,  // Save the summary in the database
    });

    // Update the appointment status to "report sent"
    await Appointment.findByIdAndUpdate(appointmentId, { status: "report sent" });

    res.status(200).json({ success: true, feedbackSummary: summary });
  } catch (error) {
    console.error("Submitted Report Successfully:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate feedback report from responses.",
    });
  }
};

