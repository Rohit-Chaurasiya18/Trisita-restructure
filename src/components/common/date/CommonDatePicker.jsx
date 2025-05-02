import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CommonDatePicker = ({
  label,
  required = false,
  value,
  onChange,
  name,
  placeholder = "dd/mm/yyyy",
  disabled = false,
  error = false,
  errorText = "",
}) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            fontWeight: 500,
            marginBottom: "0.25rem",
            color: required ? "rgba(220, 53, 69, 1)" : "rgb(55 65 81 / 1)",
          }}
        >
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </label>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={(date) =>
            onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")
          }
          format="DD/MM/YYYY"
          disabled={disabled}
          slotProps={{
            textField: {
              id: name,
              name: name,
              placeholder: placeholder,
              error: error,
              helperText: error ? errorText : "",
              fullWidth: true,
              size: "small",
              InputProps: {
                style: {
                  backgroundColor: "#fff",
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CommonDatePicker;
