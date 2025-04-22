// Component for adding a new payment method

import React, { useState } from "react";
import { PaymentMethod } from "../../api/api";
import styles from "./newPaymentMethodForm.module.css";
import valid from "card-validator";

type PaymentMethodFormProps = {
  onSubmit: (method: PaymentMethod) => void; // Callback function to handle form submission
};

const NewPaymentMethodForm = ({ onSubmit }: PaymentMethodFormProps) => {
  // State to manage form input values, using omit to exclude cardDetails from the initial state
  // and include it as a string for easier input handling
  const [form, setForm] = useState<
    Omit<PaymentMethod, "cardDetails"> & { cardDetails: string }
  >({
    cardDetails: "",
    expiryDate: "",
    CVV: "",
    issuer: "Unknown",
    active: false,
  });

  // State to toggle the visibility of the form
  const [showForm, setShowForm] = useState(false);

  // State to manage validation error messages
  const [errors, setErrors] = useState({
    cardDetails: "",
    expiryDate: "",
    CVV: "",
  });

  // Function to validate all fields in the form at once
  const validateFields = (fields: typeof form) => {
    const newErrors = {
      cardDetails: "",
      expiryDate: "",
      CVV: "",
    };

    // Validate card number using card-validator library
    const cardValidation = valid.number(fields.cardDetails);
    if (!cardValidation.isValid) {
      newErrors.cardDetails = "Invalid card number";
    }

    // Validate expiry date using card-validator library and check for correct format and valid month
    const expiryValidation = valid.expirationDate(fields.expiryDate);
    if (!expiryValidation.isValid) {
      newErrors.expiryDate = "Invalid expiry date";
    } else {
      const [month, year] = fields.expiryDate.split("/");
      const monthAsNumber = parseInt(month, 10);
      if (!month || !year || monthAsNumber < 1 || monthAsNumber > 12) {
        newErrors.expiryDate = "Invalid expiry date";
      }
    }

    // Validate CVV using card-validator library and check for correct length based on card type
    const expectedCvvLength = cardValidation.card?.code?.size || 3; // Default to 3 if card type is unknown
    const cvvValidation = valid.cvv(fields.CVV, expectedCvvLength);
    if (!cvvValidation.isValid) {
      newErrors.CVV = `Invalid CVV/CVC`;
    }

    return newErrors;
  };

  // Function to handle input changes and update form state while typing
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Field-specific validation to provide immediate feedback
    if (name === "cardDetails") {
      const validation = valid.number(value);
      setErrors((prev) => ({
        ...prev,
        cardDetails: validation.isValid ? "" : "Invalid card number",
      }));

      // Update issuer dynamically while typing based on the given card number
      setForm((prev) => ({
        ...prev,
        issuer: validation.card?.niceType || "Unknown",
      }));
    }

    // Validate expiry date format and month range
    if (name === "expiryDate") {
      const validation = valid.expirationDate(value);
      const [month, year] = value.split("/");
      const monthAsNumber = parseInt(month, 10);

      setErrors((prev) => ({
        ...prev,
        expiryDate:
          validation.isValid &&
          month &&
          year &&
          monthAsNumber >= 1 &&
          monthAsNumber <= 12
            ? ""
            : "Invalid expiry date",
      }));
    }

    // Validate CVV length based on card type (simplified)
    if (name === "CVV") {
      const cardValidation = valid.number(form.cardDetails);
      const expectedCvvLength = cardValidation.card?.code?.size || 3; // Default to 3 if card type is unknown
      const validation = valid.cvv(value, expectedCvvLength);

      setErrors((prev) => ({
        ...prev,
        CVV: validation.isValid ? "" : `Invalid CVV/CVC`,
      }));
    }
  }

  // Function to handle form submission and validate all fields before sending data to the parent component
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateFields(form);
    const hasErrors = Object.values(newErrors).some((msg) => msg !== "");

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission (convert card number to a number type and remove spaces if any)
    const cardNumberAsNumber = parseInt(
      form.cardDetails.replace(/\s+/g, ""),
      10
    );

    const finalForm: PaymentMethod = {
      ...form,
      cardDetails: cardNumberAsNumber,
    };

    onSubmit(finalForm); // Call the parent component's submit function with the final form data

    // Reset form state after submission (but this is kept when the form is just closed)
    setForm({
      cardDetails: "",
      expiryDate: "",
      CVV: "",
      issuer: "Unknown",
      active: false,
    });
    setErrors({ cardDetails: "", expiryDate: "", CVV: "" });
    setShowForm(false);
  };

  return (
    <div className={styles.container}>
      {!showForm ? (
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Card
        </button>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Add Payment Card</h2>

          <div className={styles.formGroup}>
            <label htmlFor="cardDetails" className={styles.label}>
              Card Number
            </label>
            <input
              id="cardDetails"
              name="cardDetails"
              maxLength={19}
              placeholder="Enter card number"
              value={form.cardDetails}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.cardDetails && (
              <div className={styles.errorMessage}>{errors.cardDetails}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="expiryDate" className={styles.label}>
              Expiry Date (MM/YY)
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              placeholder="Enter expiry date"
              value={form.expiryDate}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.expiryDate && (
              <div className={styles.errorMessage}>{errors.expiryDate}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="CVV" className={styles.label}>
              CVV/CVC
            </label>
            <input
              id="CVV"
              name="CVV"
              type="tel"
              inputMode="numeric"
              pattern="\d*"
              maxLength={4}
              placeholder="Enter CVV/CVC"
              value={form.CVV}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.CVV && (
              <div className={styles.errorMessage}>{errors.CVV}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <span className={styles.label}>Issuer</span>
            <div className={styles.readOnly}>{form.issuer}</div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              Add
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewPaymentMethodForm;
