import * as Yup from "yup";

export const bookValidationSchema = Yup.object().shape({
  itemType: Yup.string().required("Item type is required"),

  title: Yup.string()
    .trim()
    .required("Title is required"),

  author: Yup.string()
    .trim()
    .required("Author is required"),

  year: Yup.number()
    .typeError("Year must be a number")
    .integer("Year must be an integer")
    .min(1900, "Year should be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .nullable(), // allows empty string to be treated as null

  isbn: Yup.string()
    .trim()
    .required("ISBN is required"),

  publisher: Yup.string().optional(),

  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .integer("Quantity must be an integer")
    .min(1, "Minimum quantity is 1")
    .required("Quantity is required"),

  currency: Yup.string()
    .oneOf(["EUR", "INR", "USD"])
    .required("Currency is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price must be >= 0")
    .required("Price is required"),

  category: Yup.string().required("Category is required"),

  vendor: Yup.string().optional(),

  dept: Yup.string().required("Department is required"),

  notes: Yup.string().optional(),
});
