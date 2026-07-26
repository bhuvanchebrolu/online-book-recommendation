import BookRecommendation from "../models/BookRecommendation.js";
import sendEmail from "../utils/sendMail.js";
import pool from "../config/db.js";

// ── Helper: find HOD email for a department ──────────────────
const getHodEmail = async (department) => {
  const { rows } = await pool.query(
    `SELECT email, name FROM users
     WHERE role = 'hod' AND department = $1
     LIMIT 1`,
    [department]
  );
  return rows[0] || null;
};

// ── Helper: build a clean email HTML ────────────────────────
const buildRecommendationEmail = ({ data, recommender, dept, hodName }) => `
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

          <!-- Alert bar -->
          <tr>
            <td style="background:#e8f0f9;padding:14px 36px;border-bottom:2px solid #c8d8e8;">
              <p style="margin:0;color:#1a3a5c;font-size:14px;font-weight:600;">
                📬 New Book Recommendation — Action Required
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 36px;">
              <p style="color:#374151;font-size:14px;margin:0 0 20px;">
                Dear ${hodName || "HOD"},
              </p>
              <p style="color:#374151;font-size:14px;margin:0 0 24px;line-height:1.6;">
                A new book recommendation has been submitted by a faculty member in the
                <strong>${dept}</strong> department and requires your review.
              </p>

              <!-- Book details card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <h2 style="color:#1a3a5c;margin:0 0 4px;font-size:17px;">${data.title}</h2>
                    <p style="color:#6b7280;margin:0 0 16px;font-size:13px;">by ${data.author}</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${data.publisher ? `
                      <tr>
                        <td style="padding:5px 0;color:#9ca3af;font-size:12px;width:120px;">Publisher</td>
                        <td style="padding:5px 0;color:#374151;font-size:13px;font-weight:500;">${data.publisher}</td>
                      </tr>` : ""}
                      ${data.year ? `
                      <tr>
                        <td style="padding:5px 0;color:#9ca3af;font-size:12px;">Year</td>
                        <td style="padding:5px 0;color:#374151;font-size:13px;font-weight:500;">${data.year}</td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding:5px 0;color:#9ca3af;font-size:12px;">ISBN</td>
                        <td style="padding:5px 0;color:#374151;font-size:13px;font-weight:500;">${data.isbn}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#9ca3af;font-size:12px;">Format</td>
                        <td style="padding:5px 0;color:#374151;font-size:13px;font-weight:500;">${data.format}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#9ca3af;font-size:12px;">Type</td>
                        <td style="padding:5px 0;color:#374151;font-size:13px;font-weight:500;">${data.type}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#9ca3af;font-size:12px;">Level</td>
                        <td style="padding:5px 0;color:#374151;font-size:13px;font-weight:500;">${data.level}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#9ca3af;font-size:12px;">Quantity</td>
                        <td style="padding:5px 0;color:#374151;font-size:13px;font-weight:500;">${data.quantity}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#9ca3af;font-size:12px;">Price</td>
                        <td style="padding:5px 0;color:#374151;font-size:13px;font-weight:500;">${data.currency} ${data.price}</td>
                      </tr>
                      ${data.courseCode ? `
                      <tr>
                        <td style="padding:5px 0;color:#9ca3af;font-size:12px;">Course Code</td>
                        <td style="padding:5px 0;color:#374151;font-size:13px;font-weight:500;">${data.courseCode}</td>
                      </tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Recommendation reason -->
              ${data.recommendation ? `
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#92400e;font-size:12px;font-weight:600;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">
                      Reason for Recommendation
                    </p>
                    <p style="color:#374151;font-size:13px;margin:0;line-height:1.6;">${data.recommendation}</p>
                  </td>
                </tr>
              </table>` : ""}

              <!-- Notes -->
              ${data.notes ? `
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#166534;font-size:12px;font-weight:600;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">
                      Additional Notes
                    </p>
                    <p style="color:#374151;font-size:13px;margin:0;line-height:1.6;">${data.notes}</p>
                  </td>
                </tr>
              </table>` : ""}

              <!-- Recommended by -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#6b7280;font-size:12px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">
                      Recommended By
                    </p>
                    <p style="color:#1a3a5c;font-size:14px;font-weight:600;margin:0 0 2px;">${recommender.name}</p>
                    <p style="color:#6b7280;font-size:13px;margin:0;">${recommender.email} · ${dept} Department</p>
                  </td>
                </tr>
              </table>

              <p style="color:#374151;font-size:14px;margin:0 0 8px;line-height:1.6;">
                Please login to the portal to <strong>approve or reject</strong> this recommendation.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 36px;text-align:center;">
              <p style="color:#9ca3af;font-size:11px;margin:0;">
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

// ── Create Recommendation ────────────────────────────────────
export const createRecommendation = async (req, res) => {
  try {
    const data = req.body;

    await BookRecommendation.create({
      data,
      recommendedBy: req.user.id,
      dept:          req.user.department,
    });

    res.status(201).json({
      success: true,
      message: "Book recommendation submitted successfully",
    });

    // Find HOD for the professor's department
    const hod = await getHodEmail(req.user.department);

    const toEmail  = hod ? hod.email : "106124029@nitt.edu";
    const hodName  = hod ? hod.name  : "HOD";
    const isFallback = !hod;
    console.log(toEmail);
    // Non-blocking email
    sendEmail({
      to:      toEmail,
      subject: `📚 New Book Recommendation — ${req.user.department} Dept | ${data.title}`,
      html: buildRecommendationEmail({
        data,
        recommender: { name: req.user.name, email: req.user.email },
        dept:        req.user.department,
        hodName,
      }),
    })
    .then(() => {
      if (isFallback) {
        console.warn(
          `⚠️  No HOD found for dept ${req.user.department}. Email sent to fallback: ${toEmail}`
        );
      } else {
        console.log(`✅ Email sent to HOD (${toEmail}) for dept ${req.user.department}`);
      }
    })
    .catch(console.error);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving data" });
  }
};

// ── Get All Recommendations ──────────────────────────────────
export const getAllRecommendations = async (req, res) => {
  try {
    const list = await BookRecommendation.find();
    res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching all recommendations" });
  }
};

// ── Get My Recommendations ───────────────────────────────────
export const getMyRecommendations = async (req, res) => {
  try {
    const list = await BookRecommendation.find({ recommendedBy: req.user.id });
    res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching your recommendations" });
  }
};

// ── Get Department Recommendations ──────────────────────────
export const getDepartmentRecommendations = async (req, res) => {
  try {
    const list = await BookRecommendation.find({ dept: req.user.department });
    res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching department recommendations" });
  }
};

// ── Delete Multiple ──────────────────────────────────────────
export const deleteMultipleRecommendation = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ message: "No IDs provided" });

    const intIds = ids.map(Number);
    const result = await BookRecommendation.deleteMany(intIds);

    return res.status(200).json({
      success:      true,
      deletedCount: result.deletedCount,
      message:      "Selected recommendations deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};