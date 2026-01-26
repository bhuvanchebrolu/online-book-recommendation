import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import Note from "./Note";
import "./BookRecommendationForm.css";
import { bookValidationSchema } from "../../validation/bookValidation";
import { useMessage } from "../../context/MessageContext";

export default function BookRecommendationForm() {
  const initialValues = {
    itemType: "Both",
    title: "",
    author: "",
    year: "",
    isbn: "",
    publisher: "",
    quantity: "",
    currency: "EUR",
    price: "",
    category: "",
    vendor: "",
    dept: "",
    notes: "",
  };
  const {showMessage}=useMessage();
  const handleSubmit = async (values, { resetForm }) => {
    // Convert numeric fields to numbers before sending to backend
    const payload = {
      ...values,
      quantity: Number(values.quantity),
      price: Number(values.price),
      year: values.year ? Number(values.year) : undefined, // optional field
    };

    try {
      await axios.post("http://localhost:8080/api/recommend", payload);
      alert("Recommendation submitted successfully!");
      showMessage("Reccommendation submitted successfully","success");
      resetForm();
    } catch (err) {
      console.log("SERVER ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Submission failed");
      showMessage("Submission failed","error");
    }
  };

  return (
    <div className="form-container">
      <h2>Online Book Recommendation Form</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={bookValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ resetForm }) => (
          <Form className="book-form">
            <div>
              {/* Item Type */}
              <div className="form-group">
                <label>Item Type:</label>
                <Field as="select" name="itemType">
                  <option>Both</option>
                  <option>Book</option>
                  <option>eBook</option>
                </Field>
                <ErrorMessage name="itemType" component="div" className="error" />
              </div>

              {/* Title */}
              <div className="form-group">
                <label>
                  Title<span className="req">*</span>
                </label>
                <Field name="title" />
                <ErrorMessage name="title" component="div" className="error" />
              </div>

              {/* Author */}
              <div className="form-group">
                <label>
                  Author<span className="req">*</span>
                </label>
                <Field name="author" />
                <ErrorMessage name="author" component="div" className="error" />
              </div>

              {/* Year */}
              <div className="form-group">
                <label>Publication Year</label>
                <Field name="year" />
                <ErrorMessage name="year" component="div" className="error" />
              </div>

              {/* ISBN */}
              <div className="form-group">
                <label>
                  ISBN<span className="req">*</span>
                </label>
                <Field name="isbn" />
                <ErrorMessage name="isbn" component="div" className="error" />
              </div>

              {/* Publisher */}
              <div className="form-group">
                <label>Publisher</label>
                <Field name="publisher" />
              </div>

              {/* Row - Quantity, Currency, Price */}
              <div className="row">
                <div className="form-group small">
                  <label>
                    Quantity<span className="req">*</span>
                  </label>
                  <Field name="quantity" />
                  <ErrorMessage name="quantity" component="div" className="error" />
                </div>

                <div className="form-group small">
                  <label>Currency</label>
                  <Field as="select" name="currency">
                    <option>EUR</option>
                    <option>INR</option>
                    <option>USD</option>
                  </Field>
                </div>

                <div className="form-group small">
                  <label>
                    Price<span className="req">*</span>
                  </label>
                  <Field name="price" />
                  <ErrorMessage name="price" component="div" className="error" />
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Collection Category</label>
                <Field as="select" name="category">
                  <option value="">--Select Category--</option>
                  <option>General</option>
                  <option>Textbook</option>
                  <option>Reference</option>
                </Field>
                <ErrorMessage name="category" component="div" className="error" />
              </div>

              {/* Vendor */}
              <div className="form-group">
                <label>Vendor (Optional)</label>
                <Field as="select" name="vendor">
                  <option value="">--Select Vendor--</option>
                  <option>Vendor 1</option>
                  <option>Vendor 2</option>
                </Field>
              </div>

              {/* Dept */}
              <div className="form-group">
                <label>Dept/Centre/School</label>
                <Field as="select" name="dept">
                  <option value="">--Select Dept--</option>
                  <option>Computer Science</option>
                  <option>Electrical</option>
                  <option>Mechanical</option>
                </Field>
                <ErrorMessage name="dept" component="div" className="error" />
              </div>

              {/* Notes */}
              <div className="form-group">
                <label>Notes</label>
                <Field as="textarea" name="notes" rows="10" />
              </div>
            </div>

            <Note />

            <div>
              <button type="submit" className="submit-btn">
                Submit your suggestion
              </button>

              <button type="button" onClick={() => resetForm()}>
                Clear
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
