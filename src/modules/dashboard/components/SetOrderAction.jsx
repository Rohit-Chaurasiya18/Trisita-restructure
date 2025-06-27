import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import EmailTagInput from "@/modules/subscription/components/EmailTagInput";

const CheckboxRow = ({ label, name, value, onChange }) => (
  <div className="form-group col-12 align-items-center mb-3 d-flex">
    <div className="col-6">
      <label htmlFor={name} className="form-label h5">
        {label}
      </label>
    </div>
    <div className="col-6 text-center">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={value}
        onChange={onChange}
        style={{ height: "20px", width: "20px" }}
      />
    </div>
  </div>
);

const SetOrderAction = () => {
  const checkboxes = [
    { label: "Email License Certificate:", name: "emailLicenseCertificate" },
    { label: "Email Sales Invoice:", name: "emailSalesInvoice" },
    { label: "Email Payment Request:", name: "emailPaymentRequest" },
  ];

  const formik = useFormik({
    initialValues: {
      emailLicenseCertificate: false,
      emailSalesInvoice: false,
      emailPaymentRequest: false,
      cc_emails: [],
    },
    validate: (values) => {
      const errors = {};
      if (
        !values.emailLicenseCertificate &&
        !values.emailSalesInvoice &&
        !values.emailPaymentRequest
      ) {
        errors.checkboxGroup = "Please check at least one option.";
      }
      // Optional: basic cc_email validation
      if (values.cc_emails.length > 0) {
        const invalidEmails = values.cc_emails.filter(
          (email) => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        );
        if (invalidEmails.length > 0) {
          errors.cc_emails = "One or more email addresses are invalid.";
        }
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  const handleEmails = (validEmails) => {
    formik.setFieldValue("cc_emails", validEmails);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="allocate-form">
      {checkboxes.map((item) => (
        <CheckboxRow
          key={item.name}
          label={item.label}
          name={item.name}
          value={formik.values[item.name]}
          onChange={formik.handleChange}
        />
      ))}

      {formik.errors.checkboxGroup && (
        <div className="text-danger mb-3">{formik.errors.checkboxGroup}</div>
      )}

      <div className="col-12 mb-3">
        <label htmlFor="cc_emails" className="form-label h5">
          CC Emails:
        </label>
      </div>
      <div className="col-12 mb-3 set-actions-ccEmails">
        <EmailTagInput
          handleEmails={handleEmails}
          initialEmails={formik.values.cc_emails}
        />
        {formik.errors.cc_emails && (
          <div className="text-danger">{formik.errors.cc_emails}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary d-flex mx-auto">
        Submit
      </button>
    </form>
  );
};

export default SetOrderAction;
