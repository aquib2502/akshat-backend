import Summary from "../models/summaryModel.js";

// Controller: Save the questionnaire summary
export const saveSummary = async (req, res) => {
  try {
    const { appointmentId, responses, summary } = req.body;

    if (!appointmentId || !responses || !summary) {
      return res.status(400).json({ success: false, message: "Appointment ID, responses, and summary are required." });
    }

    const newSummary = new Summary({
      appointmentId,
      responses,
      summary,
    });

    // Save the summary to the database
    await newSummary.save();

    res.status(200).json({ success: true, message: "Summary saved successfully." });
  } catch (error) {
    console.error("Error saving summary:", error);
    res.status(500).json({ success: false, message: "Failed to save the summary." });
  }
};

// Controller: Fetch the summary by appointment ID (for the expert panel)
export const getSummaryByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required." });
    }

    const summary = await Summary.findOne({ appointmentId }).populate("appointmentId").populate("reviewedBy");

    if (!summary) {
      return res.status(404).json({ success: false, message: "Summary not found for this appointment." });
    }

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ success: false, message: "Failed to fetch summary." });
  }
};
