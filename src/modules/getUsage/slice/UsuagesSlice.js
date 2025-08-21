import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_TASK_USAGES_DATA,
  GET_UNIQUE_USAGE_USER_COUNT,
  GET_USUAGE_DATA,
  GET_USUAGE_PRODUCT_FEATURE_CHART,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getAllUsuages = createAsyncThunk(
  `usuages/getAllUsuages`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_USUAGE_DATA;
      if (payload?.csn) {
        url = `${GET_USUAGE_DATA}${payload?.csn}`;
      }
      const response = await axiosReact.post(url, payload?.payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
//Fetch Usuages Data
export const getTaskUsagesData = createAsyncThunk(
  `usuages/getTaskUsagesData`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_TASK_USAGES_DATA + `?task_id=${payload}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get usuage product feature chart
export const getUsageProductFeatureChart = createAsyncThunk(
  `usuages/getUsageProductFeatureChart`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(
        `${GET_USUAGE_PRODUCT_FEATURE_CHART}${
          payload?.csn ? `${payload?.csn}` : ""
        }`,
        payload
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get unique user count chart
export const getUniqueUsageUserCount = createAsyncThunk(
  `usuages/getUniqueUsageUserCount`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(
        `${GET_UNIQUE_USAGE_USER_COUNT}${
          payload?.csn ? `${payload?.csn}` : ""
        }`,
        payload
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const UsuagesState = {
  usuagesDataLoading: false,
  usuagesData: [],
  productLineCode: [],
  login_counts: [],
  uniqueUsageUserCountLoading: false,
  uniqueUsageUserCount: [],
  uniqueUsageUserLoginCounts: [],
};

const usuagesSlice = createSlice({
  name: "usuages",
  initialState: UsuagesState,
  reducers: {},
  extraReducers: (builder) => {
    // getAllUsuages
    builder.addCase(getTaskUsagesData.pending, (state) => {
      state.usuagesDataLoading = true;
      state.usuagesData = [];
    });
    builder.addCase(getTaskUsagesData.fulfilled, (state, action) => {
      if (action.payload.data?.status === "success") {
        state.usuagesDataLoading = false;
        state.usuagesData = action.payload.data?.data?.usages;
        state.productLineCode = action.payload.data?.data?.product_line_codes;
        state.login_counts = action.payload.data?.data?.login_counts;
      }
    });
    builder.addCase(getTaskUsagesData.rejected, (state, action) => {
      state.usuagesDataLoading = false;
      state.usuagesData = [];
    });

    // Get Unique Usage User Count
    builder.addCase(getUniqueUsageUserCount.pending, (state) => {
      state.uniqueUsageUserCount = [];
      state.uniqueUsageUserLoginCounts = [];
      state.uniqueUsageUserCountLoading = true;
    });
    builder.addCase(getUniqueUsageUserCount.fulfilled, (state, action) => {
      state.uniqueUsageUserCount = action.payload.data?.usages;
      state.uniqueUsageUserLoginCounts = action.payload.data?.login_counts;
      state.uniqueUsageUserCountLoading = false;
    });
    builder.addCase(getUniqueUsageUserCount.rejected, (state, action) => {
      state.uniqueUsageUserCount = [];
      state.uniqueUsageUserLoginCounts = [];
      state.uniqueUsageUserCountLoading = false;
    });
  },
});

export const {} = usuagesSlice.actions;
export default usuagesSlice.reducer;
