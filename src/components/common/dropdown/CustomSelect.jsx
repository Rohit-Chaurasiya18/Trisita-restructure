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
  error = false,
  errorText = '',
  name,
  isDisabled = false,
}) => {
  // Custom style for red border on error
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: error ? "#e84c4d" : provided.borderColor,
      boxShadow: error ? "0 0 0 1px #e84c4d" : state.isFocused ? "0 0 0 1px #2684FF" : provided.boxShadow,
      "&:hover": {
        borderColor: error ? "#e84c4d" : state.isFocused ? "#2684FF" : provided.borderColor,
      },
    }),
  };

  return (
    <div className="form-group" style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          className="form-label"
          htmlFor={name}
          style={{
            display: "block",
            fontWeight: 500,
            color: required ? "rgba(220, 53, 69, 1)" : "rgb(55 65 81 / 1)",
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
        styles={customStyles}
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
          {errorText}
        </span>
      )}
    </div>
  );
};

export default CommonSelect;
