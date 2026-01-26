import Joi from "joi";

export const bookJoiSchema = Joi.object({
  itemType: Joi.string().valid("Both", "Book", "eBook").default("Both"),

  title: Joi.string().trim().min(1).required().messages({
    "string.empty": "Title is required",
  }),

  author: Joi.string().trim().min(1).required().messages({
    "string.empty": "Author is required",
  }),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .allow(null) // optional field
    .messages({
      "number.base": "Year must be a number",
      "number.integer": "Year must be an integer",
      "number.min": "Year should be after 1900",
      "number.max": "Year cannot be in the future",
    }),

  isbn: Joi.string().trim().min(2).required().messages({
    "string.empty": "ISBN is required",
  }),

  publisher: Joi.string().trim().allow("", null),

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

  currency: Joi.string().valid("EUR", "INR", "USD").default("EUR"),

  price: Joi.number()
    .precision(2)
    .min(0)
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.min": "Price must be >= 0",
      "any.required": "Price is required",
    }),

  category: Joi.string().trim().min(1).required().messages({
    "string.empty": "Category is required",
  }),

  vendor: Joi.string().trim().allow("", null),

  dept: Joi.string().trim().min(1).required().messages({
    "string.empty": "Department is required",
  }),

  notes: Joi.string().trim().allow("", null),
});
