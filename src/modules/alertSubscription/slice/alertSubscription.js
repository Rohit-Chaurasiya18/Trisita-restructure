import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { ALERT_SUBSCRIPTION, GET_ALERT_SUBSCRIPTION } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get ROR Alert Data
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
      let response;
      if (payload?.startDate && payload?.endDate) {
        response = await axiosReact.post(url, {
          from_date: payload?.startDate,
          to_date: payload?.endDate,
        });
      } else {
        response = await axiosReact.get(url);
      }
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get Alert Subscription
export const getAlertSubscription = createAsyncThunk(
  `alertSubscription/getAlertSubscription`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ALERT_SUBSCRIPTION + payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const alertSubscriptionState = {
  alertSubscriptionLoading: null,
  alertSubscriptionList: null,
  alertSubscriptionDataLoading: false,
  alertSubscriptionData: null,
};

const alertSubscriptionSlice = createSlice({
  name: "alertSubscription",
  initialState: alertSubscriptionState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All ROR Alert List
    builder.addCase(getRORAlertData.pending, (state) => {
      state.alertSubscriptionLoading = true;
      state.alertSubscriptionList = [];
    });
    builder.addCase(getRORAlertData.fulfilled, (state, action) => {
      state.alertSubscriptionLoading = false;
      state.alertSubscriptionList = action.payload.data?.map((item) => ({
        ...item,
        bd_person: item.bd_person_first_names
          ? item?.bd_person_first_names.join(", ")
          : "",
        renewal_person: item.renewal_person_first_names
          ? item?.renewal_person_first_names.join(", ")
          : "",
        third_party_name: item.third_party_name
          ? item?.third_party_name.join(", ")
          : "",
      }));
    });
    builder.addCase(getRORAlertData.rejected, (state) => {
      state.alertSubscriptionLoading = false;
      state.alertSubscriptionList = [];
    });

    // Get Alert Subscription Data
    builder.addCase(getAlertSubscription.pending, (state) => {
      state.alertSubscriptionDataLoading = true;
      state.alertSubscriptionData = [];
    });
    builder.addCase(getAlertSubscription.fulfilled, (state, action) => {
      state.alertSubscriptionDataLoading = false;
      state.alertSubscriptionData = action.payload.data;
    });
    builder.addCase(getAlertSubscription.rejected, (state) => {
      state.alertSubscriptionDataLoading = false;
      state.alertSubscriptionData = null;
    });
  },
});

export const {} = alertSubscriptionSlice.actions;
export default alertSubscriptionSlice.reducer;
