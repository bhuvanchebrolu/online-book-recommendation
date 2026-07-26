import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const User = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  // Email/password registration
  async create({ name, email, password, role, department }) {
    const hashed = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, role, department)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, hashed, role, department]
    );
    return rows[0];
  },

  // DAuth / admin upsert (no password)
  async upsert({ name, email, role, department }) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, role, department)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
         SET name       = EXCLUDED.name,
             role       = EXCLUDED.role,
             department = EXCLUDED.department
       RETURNING *`,
      [name, email, role, department]
    );
    return rows[0];
  },

  async updateRole(id, role) {
    const { rows } = await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2
       RETURNING id, name, email, role, department`,
      [role, id]
    );
    return rows[0] || null;
  },

  // Compare plain password against bcrypt hash
  async verifyPassword(plainText, hashed) {
    return bcrypt.compare(plainText, hashed);
  },
};

export default User;