import { axiosReact } from "@/services/api";
import {
  DASHBOARD_CHART,
  DASHBOARD_DATA,
  DASHBOARD_SEAT_DATE_CHART,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const GetDashboardData = createAsyncThunk(
  `dashboard/GetDashboardDataThunk`,
  async (payload, thunkAPI) => {
    try {
      let url = DASHBOARD_DATA;
      if (payload) {
        url = url + `/${payload?.id}`;
      }
      const response = await axiosReact.post(url, payload);
      console.log(response);
      return true;
    } catch (err) {
      console.log(err);
      // toast.error(err?.response?.data?.message || somethingWentWrong);
      return true;
    }
  }
);

export const GetDashboardChart = createAsyncThunk(
  `dashboard/GetDashboardChartThunk`,
  async (payload, thunkAPI) => {
    try {
      let url = DASHBOARD_CHART;
      if (payload) {
        url = url + `/${payload?.id}`;
      }
      const response = await axiosReact.post(url, payload);
      console.log(response);
      return true;
    } catch (err) {
      console.log(err);
      // toast.error(err?.response?.data?.message || somethingWentWrong);
      return true;
    }
  }
);

export const GetSeatDateChart = createAsyncThunk(
  `dashboard/GetSeatDateChartThunk`,
  async (payload, thunkAPI) => {
    try {
      let url = DASHBOARD_SEAT_DATE_CHART;
      if (payload) {
        url = url + `/${payload?.id}`;
      }
      const response = await axiosReact.post(url, payload);
      console.log(response);
      return true;
    } catch (err) {
      console.log(err);
      // toast.error(err?.response?.data?.message || somethingWentWrong);
      return true;
    }
  }
);

const dashboardState = {
  loading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: dashboardState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
