import pool from "../config/db.js";
import crypto from "crypto";

const Otp = {
  // Generate a secure 6-digit OTP
  generate() {
    return crypto.randomInt(100000, 999999).toString();
  },

  // Save OTP — deletes old ones for same email first
  async save(email, otp) {
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await pool.query(
      "DELETE FROM otp_verifications WHERE email = $1",
      [email]
    );

    await pool.query(
      `INSERT INTO otp_verifications (email, otp, expires_at)
       VALUES ($1, $2, $3)`,
      [email, otp, expiresAt]
    );
  },

  // Verify OTP — returns true if valid, marks it verified
  async verify(email, otp) {
    const { rows } = await pool.query(
      `SELECT * FROM otp_verifications
       WHERE email     = $1
         AND otp       = $2
         AND expires_at > NOW()
         AND verified  = false`,
      [email, otp]
    );

    if (rows.length === 0) return false;

    await pool.query(
      "UPDATE otp_verifications SET verified = true WHERE id = $1",
      [rows[0].id]
    );

    return true;
  },

  // Check if email has a verified OTP entry (gate for registration)
  async isVerified(email) {
    const { rows } = await pool.query(
      `SELECT * FROM otp_verifications
       WHERE email = $1 AND verified = true`,
      [email]
    );
    return rows.length > 0;
  },

  // Cleanup — call after registration
  async deleteByEmail(email) {
    await pool.query(
      "DELETE FROM otp_verifications WHERE email = $1",
      [email]
    );
  },
};

export default Otp;