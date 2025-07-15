import { axiosReact } from "@/services/api";
import {
  DOWNLOAD_PDF_QUOTATION,
  GET_ADD_SALES_STAGE,
  GET_NEW_QUOTATION,
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
      const response = await axiosReact.get(GET_NEW_QUOTATION + payload);
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
export const getNewQuotation = createAsyncThunk(
  "opportunities/getNewQuotation",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_NEW_QUOTATION);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const addNewOpportunity = createAsyncThunk(
  "opportunities/addNewOpportunity",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(GET_NEW_QUOTATION, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const updateNewOpportunity = createAsyncThunk(
  "opportunities/updateNewOpportunity",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.put(
        GET_NEW_QUOTATION + payload?.id,
        payload
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
const initialValue = {
  salesStageLoading: false,
  salesStage: [],
  newQuotationList: [],
  newQuotationListLoading: false,
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

    // Get New Quotaion
    builder.addCase(getNewQuotation.pending, (state, action) => {
      state.newQuotationListLoading = true;
      state.newQuotationList = [];
    });
    builder.addCase(getNewQuotation.fulfilled, (state, action) => {
      state.newQuotationListLoading = false;
      state.newQuotationList = action.payload.data;
    });
    builder.addCase(getNewQuotation.rejected, (state, action) => {
      state.newQuotationListLoading = false;
      state.newQuotationList = [];
    });
  },
});
export const {} = quotationSlice.actions;
export default quotationSlice.reducer;
