import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    itemType: { type: String, default: "Both" },
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number },            
    isbn: { type: String, required: true },
    publisher: { type: String },
    quantity: { type: Number, required: true }, 
    currency: { type: String },
    price: { type: Number, required: true },    
    category: { type: String },
    vendor: { type: String },
    dept: { type: String },
    notes: { type: String },
    status: {
      type: String,
      default: "Requested",
      enum: ["Requested", "Approved", "Rejected"],
    },
  },
  { timestamps: true }
);

const BookRecommendation = mongoose.model("BookRecommendation", bookSchema);

export default BookRecommendation;
