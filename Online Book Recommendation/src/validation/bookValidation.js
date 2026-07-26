import * as Yup from "yup";

export const bookValidationSchema = Yup.object().shape({
  itemType: Yup.string()
    .oneOf(["Both", "Book", "eBook"])
    .required("Item type is required"),

  title: Yup.string()
    .trim()
    .required("Title is required"),

  author: Yup.string()
    .trim()
    .required("Author / Editor is required"),

  publisher: Yup.string().nullable(),

  year: Yup.number()
    .typeError("Year must be a number")
    .integer("Year must be an integer")
    .min(1900, "Year should be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .nullable(),

  isbn: Yup.string()
    .trim()
    .required("ISBN is required"),

  format: Yup.string()
    .oneOf(["Print Book", "E-Book"])
    .required("Format is required"),

  type: Yup.string()
    .oneOf(["TextBook", "Reference Book", "General Book"])
    .required("Book type is required"),

  edition: Yup.string().nullable(),

  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .integer("Quantity must be an integer")
    .min(1, "Minimum quantity is 1")
    .required("Quantity is required"),

  currency: Yup.string()
    .oneOf(["INR", "USD", "EUR"])
    .required("Currency is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price must be >= 0")
    .required("Price is required"),

  level: Yup.string()
    .oneOf(["UG", "PG", "PhD"])
    .required("Level is required"),

  courseCode: Yup.string().nullable(),

  recommendation: Yup.string().nullable(),

  notes: Yup.string().nullable(),
});
