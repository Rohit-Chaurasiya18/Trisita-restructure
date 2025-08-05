import React, { useEffect, useMemo, useState } from "react";
import { TextField, Box, CircularProgress } from "@mui/material";
import debounce from "lodash/debounce";

const CommonSearchInput = ({
  value = "",
  label = "Search",
  onChange,
  loading = false,
  disabled = false,
  debounceTime = 500,
  placeholder = "Type to search...",
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedChange = useMemo(
    () =>
      debounce((newValue) => {
        onChange(newValue);
      }, debounceTime),
    [onChange, debounceTime]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedChange(newValue);
  };

  return (
    <Box sx={{ position: "relative", width: 300 }}>
      <TextField
        fullWidth
        value={inputValue}
        onChange={handleChange}
        label={label}
        placeholder={placeholder}
        variant="outlined"
        disabled={disabled}
        InputProps={{
          endAdornment: loading && (
            <CircularProgress
              size={20}
              sx={{ position: "absolute", right: 10 }}
            />
          ),
        }}
      />
    </Box>
  );
};

export default CommonSearchInput;
