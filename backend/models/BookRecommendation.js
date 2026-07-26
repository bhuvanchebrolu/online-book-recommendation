import pool from "../config/db.js";

// Maps snake_case DB row → camelCase + nested recommendedBy
const mapRow = (row) => {
  if (!row) return null;
  return {
    id:             row.id,
    itemType:       row.item_type,
    title:          row.title,
    author:         row.author,
    publisher:      row.publisher,
    year:           row.year,
    isbn:           row.isbn,
    format:         row.format,
    type:           row.type,
    edition:        row.edition,
    quantity:       row.quantity,
    currency:       row.currency,
    price:          row.price,
    recommendation: row.recommendation,
    notes:          row.notes,
    level:          row.level,
    courseCode:     row.course_code,
    dept:           row.dept,
    status:         row.status,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
    recommendedBy:  row.user_id
      ? {
          id:         row.user_id,
          name:       row.user_name,
          email:      row.user_email,
          role:       row.user_role,
          department: row.user_department,
        }
      : row.recommended_by,
  };
};

const BASE_SELECT = `
  SELECT
    br.*,
    u.id         AS user_id,
    u.name       AS user_name,
    u.email      AS user_email,
    u.role       AS user_role,
    u.department AS user_department
  FROM book_recommendations br
  LEFT JOIN users u ON br.recommended_by = u.id
`;

const BookRecommendation = {
  async create({ data, recommendedBy, dept }) {
    const {
      itemType, title, author, publisher, year, isbn,
      format, type, edition, quantity, currency, price,
      recommendation, notes, level, courseCode,
    } = data;

    const { rows } = await pool.query(
      `INSERT INTO book_recommendations
        (item_type, title, author, publisher, year, isbn, format, type,
         edition, quantity, currency, price, recommendation, notes,
         level, course_code, dept, recommended_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       RETURNING *`,
      [
        itemType || "Both", title, author, publisher || null,
        year || null, isbn, format, type,
        edition || null, quantity, currency || "INR", price,
        recommendation || null, notes || null,
        level, courseCode || null, dept, recommendedBy,
      ]
    );
    return mapRow(rows[0]);
  },

  // filters: { status, dept, recommendedBy }
  // status can be a string or array of strings
  async find(filters = {}) {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (filters.status) {
      if (Array.isArray(filters.status)) {
        conditions.push(`br.status = ANY($${idx++})`);
        values.push(filters.status);
      } else {
        conditions.push(`br.status = $${idx++}`);
        values.push(filters.status);
      }
    }
    if (filters.dept) {
      conditions.push(`br.dept = $${idx++}`);
      values.push(filters.dept);
    }
    if (filters.recommendedBy) {
      conditions.push(`br.recommended_by = $${idx++}`);
      values.push(filters.recommendedBy);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await pool.query(
      `${BASE_SELECT} ${where} ORDER BY br.created_at DESC`,
      values
    );
    return rows.map(mapRow);
  },

  async updateManyStatus({ ids, status, dept }) {
    const { rowCount } = await pool.query(
      `UPDATE book_recommendations
       SET status = $1
       WHERE id = ANY($2::int[]) AND dept = $3`,
      [status, ids, dept]
    );
    return { modifiedCount: rowCount };
  },

  async deleteMany(ids) {
    const { rowCount } = await pool.query(
      `DELETE FROM book_recommendations WHERE id = ANY($1::int[])`,
      [ids]
    );
    return { deletedCount: rowCount };
  },
};

export default BookRecommendation;