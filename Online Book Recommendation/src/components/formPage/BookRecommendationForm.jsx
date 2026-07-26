import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./BookRecommendationForm.css";
import { bookValidationSchema } from "../../validation/bookValidation";
import { useMessage } from "../../context/MessageContext";
import api from "../../utils/axios";
import Note from "./Note";

const SectionTitle = ({ icon, children }) => (
  <div className="section-title">
    <span className="section-title__icon" aria-hidden="true">{icon}</span>
    {children}
  </div>
);

export default function BookRecommendationForm() {
  const { showMessage } = useMessage();

  const initialValues = {
    itemType: "Both",
    title: "",
    author: "",
    publisher: "",
    year: "",
    isbn: "",
    format: "",
    type: "",
    edition: "",
    quantity: "",
    currency: "INR",
    price: "",
    recommendation: "",
    notes: "",
    level: "",
    courseCode: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      ...values,
      quantity: Number(values.quantity),
      price: Number(values.price),
      year: values.year ? Number(values.year) : undefined,
    };
    try {
      await api.post("/api/recommend", payload);
      showMessage("Recommendation submitted successfully", "success");
      resetForm();
    } catch (err) {
      console.error("SERVER ERROR:", err.response?.data);
      showMessage(err.response?.data?.message || "Submission failed", "error");
    }
  };

  return (
    <div className="form-container">
      <Formik
        initialValues={initialValues}
        validationSchema={bookValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ resetForm }) => (
          <Form className="book-form">

            {/* ── Section 1: Item Details ── */}
            <div className="form-card">
              <SectionTitle icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              }>Book Details</SectionTitle>

              <div className="form-group">
                <label>Item Type</label>
                <Field as="select" name="itemType">
                  <option value="Both">Both</option>
                  <option value="Book">Book</option>
                  <option value="eBook">eBook</option>
                </Field>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Title <span className="req">*</span></label>
                  <Field name="title" placeholder="Enter book title" />
                  <ErrorMessage name="title" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label>Author / Editor <span className="req">*</span></label>
                  <Field name="author" placeholder="Author name(s)" />
                  <ErrorMessage name="author" component="div" className="error" />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Publisher</label>
                  <Field name="publisher" placeholder="Publisher name" />
                </div>
                <div className="form-group">
                  <label>Publication Year</label>
                  <Field name="year" placeholder="e.g. 2023" />
                  <ErrorMessage name="year" component="div" className="error" />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>ISBN <span className="req">*</span></label>
                  <Field name="isbn" placeholder="978-x-xxx-xxxxx-x" />
                  <ErrorMessage name="isbn" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label>Edition</label>
                  <Field name="edition" placeholder="e.g. 3rd" />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Format <span className="req">*</span></label>
                  <Field as="select" name="format">
                    <option value="">— Select Format —</option>
                    <option value="Print Book">Print Book</option>
                    <option value="E-Book">E-Book</option>
                  </Field>
                  <ErrorMessage name="format" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label>Book Type <span className="req">*</span></label>
                  <Field as="select" name="type">
                    <option value="">— Select Type —</option>
                    <option value="TextBook">TextBook</option>
                    <option value="Reference Book">Reference Book</option>
                    <option value="General Book">General Book</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="error" />
                </div>
              </div>
            </div>

            {/* ── Section 2: Pricing & Quantity ── */}
            <div className="form-card">
              <SectionTitle icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              }>Pricing & Quantity</SectionTitle>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Quantity <span className="req">*</span></label>
                  <Field name="quantity" placeholder="e.g. 3" />
                  <ErrorMessage name="quantity" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <Field as="select" name="currency">
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label>Price <span className="req">*</span></label>
                  <Field name="price" placeholder="e.g. 750" />
                  <ErrorMessage name="price" component="div" className="error" />
                </div>
              </div>
            </div>

            {/* ── Section 3: Academic Details ── */}
            <div className="form-card">
              <SectionTitle icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              }>Academic Information</SectionTitle>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Level <span className="req">*</span></label>
                  <Field as="select" name="level">
                    <option value="">— Select Level —</option>
                    <option value="UG">UG</option>
                    <option value="PG">PG</option>
                    <option value="PhD">PhD</option>
                  </Field>
                  <ErrorMessage name="level" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label>Course Code</label>
                  <Field name="courseCode" placeholder="e.g. CS3001" />
                </div>
              </div>
            </div>

            {/* ── Section 4: Justification ── */}
            <div className="form-card">
              <SectionTitle icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              }>Justification & Notes</SectionTitle>

              <div className="form-group">
                <label>Recommendation / Justification</label>
                <Field as="textarea" name="recommendation" rows="4" placeholder="Why do you recommend this book? How will it benefit students?" />
              </div>
              <div className="form-group">
                <label>Additional Notes</label>
                <Field as="textarea" name="notes" rows="3" placeholder="Any other relevant information..." />
              </div>
            </div>

            <Note />

            {/* ── Buttons ── */}
            <div className="btn-row">
              <button type="submit" className="btn-submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Submit Recommendation
              </button>
              <button type="button" className="btn-clear" onClick={resetForm}>
                Clear Form
              </button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}