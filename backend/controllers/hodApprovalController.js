import BookRecommendation from "../models/BookRecommendation.js";
import pool from "../config/db.js";
import sendEmail from "../utils/sendMail.js";

// ── Helper: get professor email by user id ───────────────────
const getProfessorInfo = async (userId) => {
  const { rows } = await pool.query(
    "SELECT name, email FROM users WHERE id = $1",
    [userId]
  );
  return rows[0] || null;
};

// ── Helper: build status email HTML ─────────────────────────
const buildStatusEmail = ({ book, status, professorName, hodName, dept }) => {
  const isApproved = status === "Approved";

  const statusColor  = isApproved ? "#16a34a" : "#dc2626";
  const statusBg     = isApproved ? "#f0fdf4" : "#fef2f2";
  const statusBorder = isApproved ? "#bbf7d0" : "#fecaca";
  const statusIcon   = isApproved ? "✅" : "❌";
  const statusText   = isApproved ? "Approved" : "Rejected";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#1a3a5c;padding:28px 36px;text-align:center;">
              <div style="font-size:28px;margin-bottom:8px;">📚</div>
              <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;letter-spacing:0.3px;">
                LibRecommend
              </h1>
              <p style="color:#7aafd4;margin:4px 0 0;font-size:12px;letter-spacing:0.5px;">
                NITT LIBRARY SYSTEM
              </p>
            </td>
          </tr>

          <!-- Status banner -->
          <tr>
            <td style="background:${statusBg};border-bottom:2px solid ${statusBorder};padding:18px 36px;text-align:center;">
              <p style="margin:0;font-size:18px;font-weight:700;color:${statusColor};">
                ${statusIcon} Recommendation ${statusText}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 36px;">
              <p style="color:#374151;font-size:14px;margin:0 0 20px;line-height:1.6;">
                Dear <strong>${professorName}</strong>,
              </p>
              <p style="color:#374151;font-size:14px;margin:0 0 24px;line-height:1.6;">
                Your book recommendation has been reviewed by the HOD of the
                <strong>${dept}</strong> department and has been
                <strong style="color:${statusColor};">${statusText.toLowerCase()}</strong>.
              </p>

              <!-- Book details card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#6b7280;font-size:11px;font-weight:600;margin:0 0 8px;
                               text-transform:uppercase;letter-spacing:0.5px;">Book Details</p>
                    <h2 style="color:#1a3a5c;margin:0 0 4px;font-size:17px;">${book.title}</h2>
                    <p style="color:#6b7280;margin:0 0 16px;font-size:13px;">by ${book.author}</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;color:#9ca3af;font-size:12px;width:120px;">ISBN</td>
                        <td style="padding:4px 0;color:#374151;font-size:13px;font-weight:500;">${book.isbn}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#9ca3af;font-size:12px;">Format</td>
                        <td style="padding:4px 0;color:#374151;font-size:13px;font-weight:500;">${book.format}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#9ca3af;font-size:12px;">Type</td>
                        <td style="padding:4px 0;color:#374151;font-size:13px;font-weight:500;">${book.type}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#9ca3af;font-size:12px;">Quantity</td>
                        <td style="padding:4px 0;color:#374151;font-size:13px;font-weight:500;">${book.quantity}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#9ca3af;font-size:12px;">Price</td>
                        <td style="padding:4px 0;color:#374151;font-size:13px;font-weight:500;">${book.currency} ${book.price}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#9ca3af;font-size:12px;">Level</td>
                        <td style="padding:4px 0;color:#374151;font-size:13px;font-weight:500;">${book.level}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#9ca3af;font-size:12px;">Department</td>
                        <td style="padding:4px 0;color:#374151;font-size:13px;font-weight:500;">${book.dept}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Decision box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:${statusBg};border:1px solid ${statusBorder};
                            border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:${statusColor};font-size:12px;font-weight:700;margin:0 0 6px;
                               text-transform:uppercase;letter-spacing:0.5px;">
                      Decision
                    </p>
                    <p style="color:#374151;font-size:14px;margin:0;font-weight:600;">
                      ${statusIcon} ${statusText} by ${hodName} (HOD, ${dept})
                    </p>
                  </td>
                </tr>
              </table>

              ${isApproved
                ? `<p style="color:#374151;font-size:14px;margin:0;line-height:1.6;">
                     The library team will process your recommendation shortly.
                     Thank you for contributing to the <strong>${dept}</strong> department's resources.
                   </p>`
                : `<p style="color:#374151;font-size:14px;margin:0;line-height:1.6;">
                     If you have any questions regarding this decision, please contact your
                     HOD or the library team directly.
                     You may submit a revised recommendation through the portal.
                   </p>`
              }
            </td>
          </tr>

          <!-- Reviewed by -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 36px;">
              <p style="color:#6b7280;font-size:12px;margin:0;">
                Reviewed by <strong style="color:#1a3a5c;">${hodName}</strong> ·
                ${dept} Department · ${new Date().toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a3a5c;padding:16px 36px;text-align:center;">
              <p style="color:#7aafd4;font-size:11px;margin:0;">
                © ${new Date().getFullYear()} National Institute of Technology, Tiruchirappalli
                <br/>This is an automated message from the NITT Library Recommendation System.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

// ── Update Status ────────────────────────────────────────────
export const updateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ message: "No book IDs provided" });

    if (!["Approved", "Rejected", "Requested"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const dept    = req.user.department;
    const intIds  = ids.map(Number);
    const hodName = req.user.name;

    const result = await BookRecommendation.updateManyStatus({
      ids: intIds,
      status,
      dept,
    });

    res.json({
      message:       "Status updated successfully",
      modifiedCount: result.modifiedCount,
    });

    // Send email to each professor (non-blocking)
    if (status === "Approved" || status === "Rejected") {
      // Fetch all updated books with their recommender info
      const { rows: books } = await pool.query(
        `SELECT br.*, u.name AS prof_name, u.email AS prof_email
         FROM book_recommendations br
         JOIN users u ON br.recommended_by = u.id
         WHERE br.id = ANY($1::int[])`,
        [intIds]
      );

      for (const book of books) {
        if (!book.prof_email) continue;

        sendEmail({
          to:      book.prof_email,
          subject: `📚 Your Recommendation "${book.title}" has been ${status} — NITT LibRecommend`,
          html: buildStatusEmail({
            book,
            status,
            professorName: book.prof_name,
            hodName,
            dept,
          }),
        })
        .then(() =>
          console.log(`✅ Status email sent to ${book.prof_email} for book "${book.title}"`)
        )
        .catch((err) =>
          console.error(`❌ Failed to send email to ${book.prof_email}:`, err.message)
        );
      }
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
};

// ── Get Pending Recommendations ──────────────────────────────
export const getPendingRecommendation = async (req, res) => {
  try {
    const pending = await BookRecommendation.find({
      status: "Requested",
      dept:   req.user.department,
    });
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pending recommendations" });
  }
};

// ── Get Processed Recommendations ───────────────────────────
export const getProcessedRecommendations = async (req, res) => {
  try {
    const books = await BookRecommendation.find({
      dept:   req.user.department,
      status: ["Approved", "Rejected"],
    });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch approved/rejected books" });
  }
};