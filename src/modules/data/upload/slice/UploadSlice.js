import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  DOWNLOAD_ACCOUNT_TAGGING_CSV_FORMAT_URL,
  DOWNLOAD_ACCOUNT_TAGGING_CSV_HISTORY_URL,
  DOWNLOAD_PRODUCT_MASTER_CSV_FORMAT_URL,
  DOWNLOAD_PRODUCT_MASTER_CSV_HISTORY_URL,
  UPLOAD_ACCOUNT_TAGGING_BULK,
  UPLOAD_PRODUCT_MASTER,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const UploadState = {};

export const downloadHistory = createAsyncThunk(
  `upload/downloadCsvFormat`,
  async (payload, thunkAPI) => {
    try {
      let url;
      if (payload?.isAccountTagging) {
        url =
          DOWNLOAD_ACCOUNT_TAGGING_CSV_HISTORY_URL +
          `?start_date=${payload?.filter?.startDate}&end_date=${payload?.filter?.endDate}`;
      } else if (payload?.isProductMaster) {
        url =
          DOWNLOAD_PRODUCT_MASTER_CSV_HISTORY_URL +
          `?start_date=${payload?.filter?.startDate}&end_date=${payload?.filter?.endDate}`;
      }
      const response = await axiosReact.get(url);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const downloadCSV = createAsyncThunk(
  `upload/downloadCSV`,
  async (payload, thunkAPI) => {
    try {
      let url;
      if (payload?.isAccountTagging) {
        url = DOWNLOAD_ACCOUNT_TAGGING_CSV_FORMAT_URL;
      } else if (payload?.isProductMaster) {
        url = DOWNLOAD_PRODUCT_MASTER_CSV_FORMAT_URL;
      }
      const response = await axiosReact.get(url);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// uploadBulkData
export const uploadBulkData = createAsyncThunk(
  `upload/uploadBulkData`,
  async (payload, thunkAPI) => {
    try {
      let url;
      if (payload?.isAccountTagging) {
        url = UPLOAD_ACCOUNT_TAGGING_BULK;
      } else if (payload?.isProductMaster) {
        url = UPLOAD_PRODUCT_MASTER;
      }
      const response = await axiosReact.post(url, payload?.payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState: UploadState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const {} = uploadSlice.actions;
export default uploadSlice.reducer;
