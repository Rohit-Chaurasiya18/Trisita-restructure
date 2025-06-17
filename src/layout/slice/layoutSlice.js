import { toast } from "react-toastify";
import Cookies, { cookieKeys } from "@/services/cookies";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { GET_ALL_NOTIFICATIONS, LOGIN } from "@/services/url";

const layoutState = {
  filter: {
    csn: "All CSN",
    year: "All Year",
  },
  notificationCount: 0,
  notifications: [],
  loading: false,
};

// Notification
export const fetchNotifications = createAsyncThunk(
  `layout/fetchNotifications`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ALL_NOTIFICATIONS);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
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
  extraReducers: (builder) => {
    // Notification
    builder.addCase(fetchNotifications.pending, (state) => {
      state.notificationCount = 0;
      state.loading = true;
      state.notifications = [];
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload.data?.notifications;
      state.notificationCount = action.payload.data?.count;
      state.loading = false;
    });
    builder.addCase(fetchNotifications.rejected, (state) => {
      state.notificationCount = 0;
      state.loading = false;
      state.notifications = [];
    });
  },
});
export const { setLayoutCSNFilter, setLayoutYearFilter } = layoutSlice.actions;
export default layoutSlice.reducer;
