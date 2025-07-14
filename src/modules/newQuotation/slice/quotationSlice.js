import { axiosReact } from "@/services/api";
import { GET_ADD_QUOTATION, GET_ADD_SALES_STAGE } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getQuotationData = createAsyncThunk(
  "quotation/getQuotationData",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ADD_QUOTATION);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const addQuotation = createAsyncThunk(
  "quotation/addQuotation",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(GET_ADD_QUOTATION, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getSalesStage = createAsyncThunk(
  "quotation/getSalesStage",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ADD_SALES_STAGE);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const addSalesStage = createAsyncThunk(
  "quotation/addSalesStage",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(GET_ADD_SALES_STAGE, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const initialValue = {
  quotationDataLoading: false,
  quotationData: [],
  salesStageLoading: false,
  salesStage: [],
};

const quotationSlice = createSlice({
  name: "quotation",
  initialState: initialValue,
  reducers: {},
  extraReducers: (builder) => {
    // Get QUotation Data
    builder.addCase(getQuotationData.pending, (state, action) => {
      state.quotationDataLoading = true;
      state.quotationData = [];
    });
    builder.addCase(getQuotationData.fulfilled, (state, action) => {
      state.quotationDataLoading = false;
      state.quotationData = action.payload.data?.quotation;
    });
    builder.addCase(getQuotationData.rejected, (state, action) => {
      state.quotationDataLoading = false;
      state.quotationData = [];
    });

    // Get Sales Stage
    builder.addCase(getSalesStage.pending, (state, action) => {
      state.salesStage = [];
      state.salesStageLoading = true;
    });
    builder.addCase(getSalesStage.fulfilled, (state, action) => {
      state.salesStage = action.payload.data;
      state.salesStageLoading = false;
    });
    builder.addCase(getSalesStage.rejected, (state, action) => {
      state.salesStage = [];
      state.salesStageLoading = false;
    });
  },
});
export const {} = quotationSlice.actions;
export default quotationSlice.reducer;
