import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { CALENDAR_LIST } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const pagesState = {
  calendarList: [],
  calendarListLoading: false,
};

export const getCalendarList = createAsyncThunk(
  `pages/getCalendarList`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(CALENDAR_LIST);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const pagesSlice = createSlice({
  name: "pages",
  initialState: pagesState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCalendarList.pending, (state) => {
      state.calendarList = [];
      state.calendarListLoading = true;
    });
    builder.addCase(getCalendarList.fulfilled, (state, action) => {
      state.calendarListLoading = false;
      state.calendarList = action.payload.data;
    });
    builder.addCase(getCalendarList.rejected, (state) => {
      state.calendarList = [];
      state.calendarListLoading = false;
    });
  },
});
export const {} = pagesSlice.actions;
export default pagesSlice.reducer;
