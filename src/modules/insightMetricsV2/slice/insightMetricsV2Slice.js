import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_INSIGHT_METRICS_V2_CONTRACT,
  INSIGHT_METRICS_CUSTOMER_V2,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getInsightMetricsV2 = createAsyncThunk(
  `insightMetricsV2/getInsightMetricsV2`,
  async (payload, thunkAPI) => {
    try {
      let url = INSIGHT_METRICS_CUSTOMER_V2;
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

// getInsightMetricsV2Contract
export const getInsightMetricsV2Contract = createAsyncThunk(
  `insightMetricsV2/getInsightMetricsV2Contract`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_INSIGHT_METRICS_V2_CONTRACT + `/${payload?.id}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const insightMetricsV2State = {
  lastUpdated: null,
  insightMetricsCustomerV2Loading: false,
  insightMetricsCustomerV2: null,
  insightMetricsContractV2Loading: false,
  insightMetricsV2Contract: null,
};

const insightMetricsV2Slice = createSlice({
  name: "insightMetricsV2",
  initialState: insightMetricsV2State,
  reducers: {},
  extraReducers: (builder) => {
    //Get Insight Metrics Customer
    builder.addCase(getInsightMetricsV2.pending, (state, action) => {
      state.lastUpdated = null;
      state.insightMetricsCustomerV2 = null;
      state.insightMetricsCustomerV2Loading = true;
    });

    builder.addCase(getInsightMetricsV2.fulfilled, (state, action) => {
      state.lastUpdated = action.payload.data?.last_updated;
      state.insightMetricsCustomerV2 = action.payload.data?.response_data?.map(
        (item) => ({
          ...item,
          bd_person: item?.bd_person_name
            ? item?.bd_person_name.join(", ")
            : "",
          renewal_person: item?.renewal_person_name
            ? item?.renewal_person_name.join(", ")
            : "",
        })
      );
      state.insightMetricsCustomerV2Loading = false;
    });

    builder.addCase(getInsightMetricsV2.rejected, (state, action) => {
      state.lastUpdated = null;
      state.insightMetricsCustomerV2 = null;
      state.insightMetricsCustomerV2Loading = false;
    });

    // Get Insight Metrics Contract
    builder.addCase(getInsightMetricsV2Contract.pending, (state) => {
      state.insightMetricsV2Contract = null;
      state.insightMetricsContractV2Loading = true;
    });
    builder.addCase(getInsightMetricsV2Contract.fulfilled, (state, action) => {
      state.insightMetricsV2Contract = action.payload.data;
      state.insightMetricsContractV2Loading = false;
    });
    builder.addCase(getInsightMetricsV2Contract.rejected, (state) => {
      state.insightMetricsV2Contract = null;
      state.insightMetricsContractV2Loading = false;
    });
  },
});

export const {} = insightMetricsV2Slice.actions;
export default insightMetricsV2Slice.reducer;
