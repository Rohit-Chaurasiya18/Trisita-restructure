import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  DASHBOARD_CHART,
  DASHBOARD_DATA,
  DASHBOARD_SEAT_DATE_CHART,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const GetDashboardData = createAsyncThunk(
  `dashboard/GetDashboardDataThunk`,
  async (payload, thunkAPI) => {
    try {
      let url = DASHBOARD_DATA;
      if (payload?.id) {
        url = url + `/${payload?.id}`;
      }
      const response = await axiosReact.get(url, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const GetDashboardChart = createAsyncThunk(
  `dashboard/GetDashboardChartThunk`,
  async (payload, thunkAPI) => {
    try {
      let url = DASHBOARD_CHART;
      if (payload?.id) {
        url = url + `/${payload?.id}`;
      }
      const response = await axiosReact.get(url, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
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
      const response = await axiosReact.get(url, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const dashboardState = {
  loading: false,
  dashboardDataLoading: false,
  dashboardData: null,
  dashboardChartLoading: false,
  dashboardChart: null,
  seatDateChartLoading: false,
  seatDateChart: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: dashboardState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get Dashboard Data
    builder.addCase(GetDashboardData.pending, (state) => {
      state.dashboardDataLoading = true;
      state.dashboardData = null;
    });
    builder.addCase(GetDashboardData.fulfilled, (state, action) => {
      state.dashboardDataLoading = false;
      state.dashboardData = action?.payload?.data;
    });
    builder.addCase(GetDashboardData.rejected, (state) => {
      state.dashboardDataLoading = false;
      state.dashboardData = null;
    });

    // Get Dashboard Chart
    builder.addCase(GetDashboardChart.pending, (state) => {
      state.dashboardChart = null;
      state.dashboardChartLoading = true;
    });
    builder.addCase(GetDashboardChart.fulfilled, (state, action) => {
      state.dashboardChart = action?.payload?.data;
      state.dashboardChartLoading = false;
    });
    builder.addCase(GetDashboardChart.rejected, (state) => {
      state.dashboardChart = null;
      state.dashboardChartLoading = false;
    });

    // Get Seat Date Chart
    builder.addCase(GetSeatDateChart.pending, (state) => {
      state.seatDateChart = null;
      state.seatDateChartLoading = true;
    });
    builder.addCase(GetSeatDateChart.fulfilled, (state, action) => {
      state.seatDateChart = action?.payload?.data;
      state.seatDateChartLoading = false;
    });
    builder.addCase(GetSeatDateChart.rejected, (state) => {
      state.seatDateChart = null;
      state.seatDateChartLoading = false;
    });
  },
});

export const { setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
