import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_NEW_SUBSCRIPTION_DATA,
  GET_NEW_SUBSCRIPTION_DETAIL,
  GET_SUBSCRIPTION_DATA,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get Subscription Data
export const getSubscriptionData = createAsyncThunk(
  `subscription/getSubscriptionData`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_SUBSCRIPTION_DATA;
      if (payload?.csn) {
        url = url + `${payload?.csn}`;
      }
      const response = await axiosReact.post(url, payload?.payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
// Get New Subscription Data
export const getNewSubscriptionData = createAsyncThunk(
  `subscription/getNewSubscriptionData`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_NEW_SUBSCRIPTION_DATA;
      if (payload?.csn) {
        url = url + `${payload?.csn}`;
      }
      const response = await axiosReact.post(url, payload?.payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get New Subscription Detail
export const getNewSubscriptionDetail = createAsyncThunk(
  `subscription/getNewSubscriptionDetail`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_NEW_SUBSCRIPTION_DETAIL;
      if (payload?.id) {
        url = url + `${payload?.id}`;
      }
      const response = await axiosReact.get(url);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const intialState = {
  lastUpdate: null,
  speedometerRatio: null,
  subscriptionData: [],
  subscriptionDataLoading: false,
  newSubscriptionData: [],
  newSubscriptionDataLoading: false,
  newSubscriptionDetails: null,
  newSubscriptionDetailsLoading: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: intialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Subscription Data
    builder.addCase(getSubscriptionData.pending, (state) => {
      state.subscriptionDataLoading = true;
      state.lastUpdate = null;
      state.speedometerRatio = null;
      state.subscriptionData = [];
    });
    builder.addCase(getSubscriptionData.fulfilled, (state, action) => {
      state.subscriptionDataLoading = false;
      state.lastUpdate = action.payload.data?.last_updated;
      state.speedometerRatio =
        action.payload.data?.percentage_ratio_of_inactiveuser_and_expiredsubs;
      state.subscriptionData = action.payload.data?.subscriptions;
    });
    builder.addCase(getSubscriptionData.rejected, (state) => {
      state.subscriptionDataLoading = false;
      state.lastUpdate = null;
      state.speedometerRatio = null;
      state.subscriptionData = [];
    });

    // Get New Subscription Data
    builder.addCase(getNewSubscriptionData.pending, (state, action) => {
      state.newSubscriptionData = [];
      state.newSubscriptionDataLoading = true;
    });
    builder.addCase(getNewSubscriptionData.fulfilled, (state, action) => {
      state.newSubscriptionData = action.payload.data;
      state.newSubscriptionDataLoading = false;
    });
    builder.addCase(getNewSubscriptionData.rejected, (state) => {
      state.newSubscriptionData = [];
      state.newSubscriptionDataLoading = false;
    });

    // Get New Subscription Details
    builder.addCase(getNewSubscriptionDetail.pending, (state) => {
      state.newSubscriptionDetails = null;
      state.newSubscriptionDetailsLoading = true;
    });
    builder.addCase(getNewSubscriptionDetail.fulfilled, (state, action) => {
      state.newSubscriptionDetails = action.payload.data;
      state.newSubscriptionDetailsLoading = false;
    });
    builder.addCase(getNewSubscriptionDetail.rejected, (state) => {
      state.newSubscriptionDetails = null;
      state.newSubscriptionDetailsLoading = false;
    });
  },
});

export const {} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
