import React, { useEffect, useState } from "react";
import { TagInput, Message } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const EmailTagInput = ({ handleEmails, initialEmails }) => {
  const [emails, setEmails] = useState(initialEmails);
  const [error, setError] = useState("");

  // Updated regex for stricter email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (value) => {
    const invalidEmails = value.filter((email) => !emailRegex.test(email));
    const validEmails = value.filter((email) => emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setError(`Invalid email(s): ${invalidEmails.join(", ")}`);
    } else {
      setError("");
    }
    handleEmails(validEmails);
    setEmails(value);
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <TagInput
        trigger={["Enter", "Comma", "Space"]}
        placeholder="Type email and press Enter"
        value={emails}
        onChange={handleChange}
        style={{
          width: "100%",
          minHeight: 50,
          minWidth: 300,
        }}
        menuStyle={{ display: "none" }}
      />
      {error && (
        <Message type="error" style={{ marginTop: 10 }}>
          {error}
        </Message>
      )}
    </div>
  );
};

export default EmailTagInput;
