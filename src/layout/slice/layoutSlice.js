import { toast } from "react-toastify";
import Cookies, { cookieKeys } from "@/services/cookies";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { LOGIN } from "@/services/url";

const layoutState = {
  filter: {
    csn: "All CSN",
    year: "All Year",
  },
};

const layoutSlice = createSlice({
  name: "layout",
  initialState: layoutState,
  reducers: {
    setLayoutCSNFilter: (state, action) => {
      state.filter.csn = action.payload;
    },
    setLayoutYearFilter: (state, action) => {
      state.filter.year = action.payload;
    },
  },
  extraReducers: (builder) => {},
});
export const { setLayoutCSNFilter, setLayoutYearFilter } = layoutSlice.actions;
export default layoutSlice.reducer;
