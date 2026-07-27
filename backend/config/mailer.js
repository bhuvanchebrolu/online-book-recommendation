import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.warn("⚠️ SENDGRID_API_KEY is missing in backend/.env!");
} else {
  sgMail.setApiKey(apiKey);
  console.log("✅ SendGrid mail service initialized");
}

export default sgMail;