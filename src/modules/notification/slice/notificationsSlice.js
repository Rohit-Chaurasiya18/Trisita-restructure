import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_ALL_NOTIFICATIONS,
  GET_FILTERED_NOTIFICATIONS,
  MARK_ALL_AS_READ_URL,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get New All Notifications
export const getNewAllNotifications = createAsyncThunk(
  `notifications/getNewAllNotifications`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_FILTERED_NOTIFICATIONS;
      if (payload?.userId) {
        url = `${url}${payload?.userId}/`;
      }
      if (payload?.startDate && payload?.endDate) {
        url = `${url}?from_date=${payload?.startDate}&to_date=${payload?.endDate}`;
      }
      const response = await axiosReact.get(url);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Mark As Read
export const updateMarkAsRead = createAsyncThunk(
  `notifications/updateMarkAsRead`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.patch(
        `${GET_ALL_NOTIFICATIONS + payload?.id}/mark-as-read/`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Mark aLL As Read
export const updateMarkAllAsRead = createAsyncThunk(
  `notifications/updateMarkAllAsRead`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(MARK_ALL_AS_READ_URL);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const notificationsState = {
  notificationsData: [],
  notificationsDataLoading: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: notificationsState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Notifications
    builder.addCase(getNewAllNotifications.pending, (state) => {
      state.notificationsDataLoading = true;
      state.notificationsData = [];
    });
    builder.addCase(getNewAllNotifications.fulfilled, (state, action) => {
      state.notificationsDataLoading = false;
      state.notificationsData = action.payload.data?.notifications;
    });
    builder.addCase(getNewAllNotifications.rejected, (state) => {
      state.notificationsDataLoading = false;
      state.notificationsData = null;
    });

    // Mark As Read
    builder.addCase(updateMarkAsRead.pending, (state) => {});
    builder.addCase(updateMarkAsRead.fulfilled, (state, action) => {
      let data = action.meta.arg?.data;
      const updatedNotifications = data?.map((notification) =>
        notification?.id === action.meta.arg?.id
          ? { ...notification, is_read: true }
          : notification
      );
      state.notificationsData = updatedNotifications;
    });
    builder.addCase(updateMarkAsRead.rejected, (state) => {});

    // Mark All As Read
    builder.addCase(updateMarkAllAsRead.pending, (state) => {});
    builder.addCase(updateMarkAllAsRead.fulfilled, (state, action) => {
      let data = action.meta.arg?.data;
      const updatedNotifications = data?.map((notification) => ({
        ...notification,
        is_read: true,
      }));
      state.notificationsData = updatedNotifications;
    });
    builder.addCase(updateMarkAllAsRead.rejected, (state) => {});
  },
});

export const {} = notificationsSlice.actions;
export default notificationsSlice.reducer;
