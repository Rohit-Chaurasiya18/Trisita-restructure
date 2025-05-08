import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { ALERT_SUBSCRIPTION } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getRORAlertData = createAsyncThunk(
  `alertSubscription/getRORAlertData`,
  async (payload, thunkAPI) => {
    try {
      let url = ALERT_SUBSCRIPTION;
      if (payload?.id) {
        url = url + `${payload?.id}/?alert=${payload?.status}`;
      } else {
        url = url + `?alert=${payload?.status}`;
      }
      const response = await axiosReact.get(url);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const alertSubscriptionState = {
  alertSubscriptionList: null,
};

const alertSubscriptionSlice = createSlice({
  name: "alertSubscription",
  initialState: alertSubscriptionState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All ROR Alert List
    builder.addCase(getRORAlertData.pending, (state) => {});
    builder.addCase(getRORAlertData.fulfilled, (state, action) => {
      state.alertSubscriptionList = action.payload.data;
    });
    builder.addCase(getRORAlertData.rejected, (state) => {});
  },
});

export const {} = alertSubscriptionSlice.actions;
export default alertSubscriptionSlice.reducer;
