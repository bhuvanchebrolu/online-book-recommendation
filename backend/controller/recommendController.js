import BookRecommendation from "../models/BookRecommendation.js";
import sendEmail from "../utils/sendMail.js";

export const createRecommendation = async (req, res) => {
  try {
    const data = req.body;

    const newRecommendation = new BookRecommendation(data);
    await newRecommendation.save();

    // Send response immediately
    res.status(201).json({ message: "Book recommendation submitted" });

    // Send email to HOD (non-blocking)
    sendEmail({
      to: "chysunitha@gmail.com",
      subject: "New Book Recommendation Submitted ",
      text: `
A new book recommendation has been submitted.

Title: ${data.title || "N/A"}
Author: ${data.author || "N/A"}
Recommended By: ${data.recommendedBy || "Bhuvan"}

Please review it in the admin panel.
      `,
      html: `
        <h3> New Book Recommendation</h3>
        <p><strong>Title:</strong> ${data.title || "N/A"}</p>
        <p><strong>Author:</strong> ${data.author || "N/A"}</p>
        <p><strong>Recommended By:</strong> ${
          data.recommendedBy || "Bhuvan"
        }</p>
        <p>Please review it in the admin panel.</p>
      `,
    }).catch((emailErr) => {
      console.error("Email sending failed:", emailErr);
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving data" });
  }
};

export const getRecommendation = async (req, res) => {
  try {
    const list = await BookRecommendation.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
};

export const deleteMultipleRecommendation = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const result= await BookRecommendation.deleteMany({_id:{$in:ids}});

    return res.status(200).json({
        success:true,
        deletedCount:result.deletedCount,
        message:"Selected Recommendations deleted successfully"
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({message:"Server error"});
  }
};
