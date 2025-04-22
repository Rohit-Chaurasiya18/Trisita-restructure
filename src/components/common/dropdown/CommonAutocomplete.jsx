import React from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";

const CommonAutocomplete = ({
  value,
  onChange,
  options = [],
  loading = false,
  label = "Select an Option",
  width = 300,
  getOptionLabel = (option) => option.label,
  disabled = false,
}) => {
  return (
    <Autocomplete
      value={value}
      onChange={onChange}
      options={options}
      autoSelect
      getOptionLabel={getOptionLabel}
      disabled={disabled || loading}
      sx={{ width }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: loading ? (
              <>
                {params.InputProps.endAdornment}
                <Typography variant="body2" color="textSecondary">
                  Loading...
                </Typography>
              </>
            ) : (
              params.InputProps.endAdornment
            ),
          }}
        />
      )}
    />
  );
};

export default CommonAutocomplete;
