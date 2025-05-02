import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DatePickerFilter = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label={label}
          value={value ? dayjs(value) : null}
          onChange={(date) => onChange(dayjs(date).format("YYYY-MM-DD"))}
          className="common-date-picker"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DatePickerFilter;
