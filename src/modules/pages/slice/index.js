import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  CALENDAR_LIST,
  GET_CALENDAR_SUBSCRIPTION_DETAILS,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const pagesState = {
  calendarList: [],
  calendarListLoading: false,
  calendarSubscriptionData: null,
  calendarSubscriptionLoading: false,
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
export const getSubscriptionByCalendar = createAsyncThunk(
  `pages/getSubscriptionByCalendar`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_CALENDAR_SUBSCRIPTION_DETAILS + `${payload?.id}/${payload?.status}/`
      );
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

    // getSubscriptionByCalendar
    builder.addCase(getSubscriptionByCalendar.pending, (state) => {
      state.calendarSubscriptionData = null;
      state.calendarSubscriptionLoading = true;
    });
    builder.addCase(getSubscriptionByCalendar.fulfilled, (state, action) => {
      state.calendarSubscriptionLoading = false;
      state.calendarSubscriptionData = action.payload.data;
    });
    builder.addCase(getSubscriptionByCalendar.rejected, (state) => {
      state.calendarSubscriptionData = null;
      state.calendarSubscriptionLoading = false;
    });
  },
});
export const {} = pagesSlice.actions;
export default pagesSlice.reducer;
