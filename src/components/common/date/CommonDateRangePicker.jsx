import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { MultiInputDateRangeField } from "@mui/x-date-pickers-pro/MultiInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { IconButton, InputAdornment } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ClearIcon from "@mui/icons-material/Clear";

const CommonDateRangePicker = ({
  value: propValue,
  onChange: propOnChange,
  width = "300px",
  placeholderStart = "Start date",
  placeholderEnd = "End date",
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState([null, null]);
  const isControlled =
    typeof propValue !== "undefined" && typeof propOnChange === "function";

  const value = isControlled ? propValue : internalValue;
  const setValue = isControlled ? propOnChange : setInternalValue;

  const handleClear = () => {
    setValue([null, null]);
  };

  const handleAccept = (newValue) => {
    let finalValue = newValue;

    if (newValue && newValue[0] && !newValue[1]) {
      finalValue = [newValue[0], newValue[0]];
    }

    if (isControlled) {
      propOnChange(finalValue);
    } else {
      setInternalValue(finalValue);
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["MultiInputDateRangeField"]}>
        <DateRangePicker
          disabled={disabled}
          value={value}
          onChange={setValue}
          onAccept={handleAccept}
          slots={{ field: MultiInputDateRangeField }}
          slotProps={{
            field: {
              format: "DD/MM/YYYY", // Format for the field components
            },
            textField: ({ position }) => ({
              label: position === "start" ? placeholderStart : placeholderEnd,
              InputProps: {
                endAdornment: (
                  <>
                    {value?.[position === "start" ? 0 : 1] && (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClear} size="small">
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )}
                    <InputAdornment position="end">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  </>
                ),
              },
              sx: {
                width,
                "& .MuiInputBase-root": {
                  height: "45px",
                },
              },
            }),
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default CommonDateRangePicker;
