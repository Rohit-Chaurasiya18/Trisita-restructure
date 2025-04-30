import React from "react";
import Select from "react-select";

const CommonSelect = ({
  label,
  required = false,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  isMulti = false,
  error = "",
  name,
  isDisabled = false,
}) => {
  return (
    <div className="form-group" style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          className="form-label"
          htmlFor={name}
          style={{
            display: "block",
            fontWeight: 500,
            color: "rgba(220, 53, 69, 1)",
          }}
        >
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <Select
        id={name}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isDisabled={isDisabled}
        placeholder={placeholder}
        classNamePrefix="react-select"
      />
      {error && (
        <span
          style={{
            color: "#e84c4d",
            fontSize: "12px",
            marginTop: "4px",
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default CommonSelect;
