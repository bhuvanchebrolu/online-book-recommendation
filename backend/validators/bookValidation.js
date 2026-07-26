import Joi from "joi";

export const bookJoiSchema = Joi.object({
  itemType: Joi.string()
    .valid("Both", "Book", "eBook")
    .default("Both")
    .messages({
      "any.only": "Item type must be Book, eBook, or Both",
    }),

  title: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
    }),

  author: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      "string.empty": "Author / Editor is required",
      "any.required": "Author / Editor is required",
    }),

  publisher: Joi.string()
    .trim()
    .allow("", null)
    .messages({
      "string.base": "Publisher must be a string",
    }),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .allow(null)
    .messages({
      "number.base": "Year must be a number",
      "number.integer": "Year must be an integer",
      "number.min": "Year should be after 1900",
      "number.max": "Year cannot be in the future",
    }),

  isbn: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      "string.empty": "ISBN number is required",
      "any.required": "ISBN number is required",
    }),

  format: Joi.string()
    .valid("Print Book", "E-Book")
    .required()
    .messages({
      "any.only": "Format must be Print Book or E-Book",
      "any.required": "Book format is required",
    }),

  type: Joi.string()
    .valid("TextBook", "Reference Book", "General Book")
    .required()
    .messages({
      "any.only":
        "Type must be TextBook, Reference Book, or General Book",
      "any.required": "Book type is required",
    }),

  edition: Joi.string()
    .trim()
    .allow("", null)
    .messages({
      "string.base": "Edition must be a string",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),

  currency: Joi.string()
    .valid("INR", "USD", "EUR")
    .default("INR")
    .messages({
      "any.only": "Currency must be INR, USD, or EUR",
    }),

  price: Joi.number()
    .precision(2)
    .min(0)
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.min": "Price must be greater than or equal to 0",
      "any.required": "Price is required",
    }),

  recommendation: Joi.string()
    .trim()
    .allow("", null)
    .messages({
      "string.base": "Recommendation must be a string",
    }),

  notes: Joi.string()
    .trim()
    .allow("", null)
    .messages({
      "string.base": "Notes must be a string",
    }),

  level: Joi.string()
    .valid("UG", "PG", "PhD")
    .required()
    .messages({
      "any.only": "Level must be UG, PG, or PhD",
      "any.required": "Course level is required",
    }),

  courseCode: Joi.string()
    .trim()
    .allow("", null)
    .messages({
      "string.base": "Course code must be a string",
    }),

  // ❌ DO NOT accept from frontend
  // dept → from req.user.department
  // recommendedBy → from req.user.id
});
