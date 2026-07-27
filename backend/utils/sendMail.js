import sgMail from "../config/mailer.js";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER;
    if (!fromEmail) {
      console.error("❌ SendGrid Error: SENDGRID_FROM_EMAIL or EMAIL_USER is not defined in environment variables.");
      return;
    }

    const plainText = text || (html ? html.replace(/<[^>]*>?/gm, "") : "");

    const msg = {
      to,
      from: {
        email: fromEmail,
        name: "NITT LibRecommend",
      },
      subject,
      text: plainText,
      html: html || text,
    };

    const [response] = await sgMail.send(msg);
    console.log(`✅ Email sent to ${to} (Status Code: ${response.statusCode})`);
    return response;
  } catch (err) {
    console.error("❌ SendGrid Email Error:", err?.message || err);
    if (err.response?.body) {
      console.error("Detailed SendGrid Error Response:", JSON.stringify(err.response.body, null, 2));
    }
  }
};

export default sendEmail;