import BookRecommendation from "../models/BookRecommendation.js";

export const getAllProcessedRecommendations = async (req, res) => {
  try {
    const list = await BookRecommendation.find({ status: "Approved" });
    res.status(200).json(list);
  } catch (err) {
    console.error("Error in getAllProcessedRecommendations:", err);
    res.status(500).json({ message: "Error fetching processed recommendations" });
  }
};