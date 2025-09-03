import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  DOWNLOAD_PDF_QUOTATION,
  GET_ADD_SALES_STAGE,
  GET_NEW_QUOTATION,
  GET_PURCHASED_PAYMENT_TERMS,
  GET_QUOTATION_TEMPLATE,
  LOCK_UNLOCK_QUOTATION,
  SEND_QUOTATION,
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
export const getPurchasedPaymentTerms = createAsyncThunk(
  "quotation/getPurchasedPaymentTerms",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_PURCHASED_PAYMENT_TERMS);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const addPurchasedPaymentTerms = createAsyncThunk(
  "quotation/addPurchasedPaymentTerms",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(
        GET_PURCHASED_PAYMENT_TERMS,
        payload
      );
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
          responseType: "blob",
        }
      );
      return response?.data;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const quotationTemplate = createAsyncThunk(
  "quotation/quotationTemplate",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_QUOTATION_TEMPLATE);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const handleSendQuotation = createAsyncThunk(
  "quotation/handleSendQuotation",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(SEND_QUOTATION, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const getNewQuotation = createAsyncThunk(
  "quotation/getNewQuotation",
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
export const addNewQuotation = createAsyncThunk(
  "quotation/addNewQuotation",
  async (payload, thunkAPI) => {
    try {
      let url = GET_NEW_QUOTATION;
      if (payload?.isRevised) {
        url = url + `?revise=${payload?.isRevised}`;
      }
      const response = await axiosReact.post(url, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const updateNewQuotation = createAsyncThunk(
  "quotation/updateNewQuotation",
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

export const lockUnlockQuotation = createAsyncThunk(
  "quotation/lockUnlockQuotation",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        LOCK_UNLOCK_QUOTATION +
          `?id=${payload?.id}&is_locked=${payload?.status}`
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
  quotationTemplate: [],
  quotationTemplateLoading: false,
  purchasedPaymentTerms: [],
  purchasedPaymentTermsLoading: false,
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

    // Get Purchased Payment Terms
    builder.addCase(getPurchasedPaymentTerms.pending, (state, action) => {
      state.purchasedPaymentTerms = [];
      state.purchasedPaymentTermsLoading = true;
    });
    builder.addCase(getPurchasedPaymentTerms.fulfilled, (state, action) => {
      state.purchasedPaymentTerms = action.payload.data;
      state.purchasedPaymentTermsLoading = false;
    });
    builder.addCase(getPurchasedPaymentTerms.rejected, (state, action) => {
      state.purchasedPaymentTerms = [];
      state.purchasedPaymentTermsLoading = false;
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

    //Get quotation template
    builder.addCase(quotationTemplate.pending, (state) => {
      state.quotationTemplate = [];
      state.quotationTemplateLoading = true;
    });
    builder.addCase(quotationTemplate.fulfilled, (state, action) => {
      state.quotationTemplate = action.payload.data?.map((item) => ({
        label: item?.name,
        value: item?.id,
        days: item?.days,
        content: item?.content,
      }));
      state.quotationTemplateLoading = false;
    });
    builder.addCase(quotationTemplate.rejected, (state) => {
      state.quotationTemplate = [];
      state.quotationTemplateLoading = false;
    });

    //Send Quotation
    // handleSendQuotation
  },
});
export const {} = quotationSlice.actions;
export default quotationSlice.reducer;
