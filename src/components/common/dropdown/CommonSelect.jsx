import React from "react";
import { MenuItem, Select } from "@mui/material";

const CommonSelect = ({
  value = "",
  onChange,
  options = [],
  placeholder = "Select",
  sx = {},
  defaultValue,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      defaultValue={defaultValue}
      displayEmpty
      inputProps={{ "aria-label": "common select" }}
      // style={style}
      sx={{ height: "45px", ...sx }}
    >
      {/* <MenuItem value="">{placeholder}</MenuItem> */}
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CommonSelect;
