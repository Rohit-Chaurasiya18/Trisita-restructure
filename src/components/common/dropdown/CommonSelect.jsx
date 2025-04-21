import React from "react";
import { MenuItem, Select } from "@mui/material";

const CommonSelect = ({
  value = "",
  onChange,
  options = [],
  placeholder = "Select",
  style = { height: "45px" },
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      inputProps={{ "aria-label": "common select" }}
      style={style}
    >
      <MenuItem value="">{placeholder}</MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CommonSelect;
