import { forwardRef } from "react";

const CommonTextareaField = (
  {
    labelName = "",
    required = false,
    readOnly = false,
    mutedText = "",
    isInvalid = false,
    errorText = "",
    value = "",
    onChange,
    className = "",
    placeHolder = "",
    isDisabled = false,
    errorClass = "",
    name = "",
    mainDiv = "",
    labelClass = "",
    requiredText = false,
    rows = 4,
    ...inputProps
  },
  ref
) => {
  return (
    <div className={mainDiv}>
      {labelName && (
        <label
          className={`form-label ${labelClass} ${
            requiredText && "requiredText"
          }`}
        >
          {labelName}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      {mutedText && <small className="text-muted">{mutedText}</small>}

      <textarea
        ref={ref}
        rows={rows}
        className={`form-control ${isInvalid ? "is-invalid" : ""} ${className}`}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
        readOnly={readOnly}
        disabled={isDisabled}
        {...inputProps}
      />

      {isInvalid && errorText && (
        <div className={`invalid-feedback ${errorClass}`}>{errorText}</div>
      )}
    </div>
  );
};

export default forwardRef(CommonTextareaField);
