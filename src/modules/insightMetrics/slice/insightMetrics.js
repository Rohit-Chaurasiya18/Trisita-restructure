import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_ALL_ACCOUNT,
  GET_ALL_BRANCH,
  INSIGHT_METRICS_CUSTOMER,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getAllBranch = createAsyncThunk(
  `insightMetrics/getAllBranch`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ALL_BRANCH);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const getAllAccount = createAsyncThunk(
  `insightMetrics/getAllAccount`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ALL_ACCOUNT);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const getInsightMetrics = createAsyncThunk(
  `insightMetrics/getInsightMetrics`,
  async (payload, thunkAPI) => {
    try {
      let url = INSIGHT_METRICS_CUSTOMER;
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

const insightMetricsState = {
  accountList: null,
  branchList: null,
  insightMetricsCustomer: null,
  lastUpdated: null,
};

const insightMetricsSlice = createSlice({
  name: "insightMetrics",
  initialState: insightMetricsState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Branch List
    builder.addCase(getAllBranch.pending, (state) => {
      state.branchList = [];
    });
    builder.addCase(getAllBranch.fulfilled, (state, action) => {
      state.branchList = action?.payload?.data?.Branch?.map((item) => ({
        label: item?.branch_name,
        value: item?.id,
      }));
    });
    builder.addCase(getAllBranch.rejected, (state) => {
      state.branchList = [];
    });

    // Get All Account List
    builder.addCase(getAllAccount.pending, (state) => {
      state.accountList = [];
    });
    builder.addCase(getAllAccount.fulfilled, (state, action) => {
      let accountData = action.payload.data?.accounts?.map((item) => ({
        label: item?.name,
        csn: item?.csn,
        value: item?.id,
      }));
      const uniqueLabels = new Set();
      const uniqueData = accountData.filter((item) => {
        if (!uniqueLabels.has(item?.csn)) {
          uniqueLabels.add(item?.csn);
          return true;
        }
        return false;
      });
      state.accountList = uniqueData;
    });
    builder.addCase(getAllAccount.rejected, (state) => {
      state.accountList = [];
    });

    //Get Insight Metrics Customer
    builder.addCase(getInsightMetrics.pending, (state, action) => {
      state.lastUpdated = null;
      state.insightMetricsCustomer = null;
    });
    builder.addCase(getInsightMetrics.fulfilled, (state, action) => {
      state.lastUpdated = action.payload.data?.last_updated;
      state.insightMetricsCustomer = action.payload.data?.response_data;
    });
    builder.addCase(getInsightMetrics.rejected, (state, action) => {
      state.lastUpdated = null;
      state.insightMetricsCustomer = null;
    });
  },
});

export const {} = insightMetricsSlice.actions;
export default insightMetricsSlice.reducer;
