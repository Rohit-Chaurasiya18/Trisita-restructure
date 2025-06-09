import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_ALL_NOTIFICATIONS,
  GET_USER_WISE_NOTIFICATION,
  MARK_ALL_AS_READ_URL,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get All Notifications
export const getAllNotifications = createAsyncThunk(
  `notifications/getAllNotifications`,
  async (payload, thunkAPI) => {
    try {
      let url;
      if (payload?.isUser) {
        url = GET_USER_WISE_NOTIFICATION + payload?.isUser;
      } else {
        url = GET_ALL_NOTIFICATIONS;
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
  count: 0,
  notificationsData: [],
  notificationsDataLoading: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: notificationsState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Notifications
    builder.addCase(getAllNotifications.pending, (state) => {
      state.notificationsDataLoading = true;
      state.notificationsData = [];
    });
    builder.addCase(getAllNotifications.fulfilled, (state, action) => {
      state.count = action.payload.data?.count;
      state.notificationsDataLoading = false;
      state.notificationsData = action.payload.data?.notifications;
    });
    builder.addCase(getAllNotifications.rejected, (state) => {
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
