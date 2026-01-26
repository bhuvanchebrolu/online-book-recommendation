import mongoose from "mongoose";

import BookRecommendation from "../models/BookRecommendation.js";
import { sampleRecommendations } from "./sampleData.js";


const MONGO_URL = "mongodb://localhost:27017/book_recommendations";

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected.");

    // Clear old collection
    await BookRecommendation.deleteMany({});
    console.log("Old records removed.");

    // Insert new records
    await BookRecommendation.insertMany(sampleRecommendations);
    console.log("✔ Inserted sample recommendations successfully!");

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding data:", error.message);
  }
};

seedDB();
