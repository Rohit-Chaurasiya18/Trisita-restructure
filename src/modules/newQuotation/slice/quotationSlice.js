import { axiosReact } from "@/services/api";
import {
  DOWNLOAD_PDF_QUOTATION,
  GET_ADD_QUOTATION,
  GET_ADD_SALES_STAGE,
  GET_NEW_OPPORTUNITY,
  PRODUCT_DETAILS,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

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

export const getQuotationById = createAsyncThunk(
  "quotation/getQuotationById",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_NEW_OPPORTUNITY + payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const downloadQuotation = createAsyncThunk(
  "quotation/downloadQuotation",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        DOWNLOAD_PDF_QUOTATION + `${payload}/`,
        {
          responseType: "blob", // 🔥 IMPORTANT
        }
      );
      return response?.data;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const initialValue = {
  salesStageLoading: false,
  salesStage: [],
};

const quotationSlice = createSlice({
  name: "quotation",
  initialState: initialValue,
  reducers: {},
  extraReducers: (builder) => {
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
