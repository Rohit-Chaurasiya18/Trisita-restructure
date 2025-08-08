import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_ALL_ACCOUNT,
  GET_ALL_BRANCH,
  GET_EXPORT_EXCEL_FILES,
  GET_INSIGHT_METRICS_CONTRACT,
  GET_UPLOADED_FILES,
  INSIGHT_METRICS_CUSTOMER,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getExportExcelFile = createAsyncThunk(
  `insightMetrics/getExportExcelFile`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(GET_EXPORT_EXCEL_FILES, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getExportExcelFileData = createAsyncThunk(
  `insightMetrics/getExportExcelFileData`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_EXPORT_EXCEL_FILES);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getUploadedFiles = createAsyncThunk(
  `insightMetrics/getUploadedFiles`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_UPLOADED_FILES);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

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

// getInsightMetricsContract
export const getInsightMetricsContract = createAsyncThunk(
  `insightMetrics/getInsightMetricsContract`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_INSIGHT_METRICS_CONTRACT +
          `/${payload?.id}/${payload?.contractNumber}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const insightMetricsState = {
  accountListLoading: false,
  accountList: null,
  branchListLoading: false,
  branchList: null,
  insightMetricsCustomerLoading: false,
  insightMetricsCustomer: null,
  lastUpdated: null,
  insightMetricsContractLoading: false,
  insightMetricsContract: null,
  exportedData: [],
  exportesDataLoading: false,
  uploadedFilesData: [],
  uploadedFilesDataLoading: false,
};

const insightMetricsSlice = createSlice({
  name: "insightMetrics",
  initialState: insightMetricsState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Branch List
    builder.addCase(getAllBranch.pending, (state) => {
      state.branchList = [];
      state.branchListLoading = true;
    });
    builder.addCase(getAllBranch.fulfilled, (state, action) => {
      state.branchList = action?.payload?.data?.Branch?.map((item) => ({
        label: item?.branch_name,
        value: item?.id,
      }));
      state.branchListLoading = false;
    });
    builder.addCase(getAllBranch.rejected, (state) => {
      state.branchList = [];
      state.branchListLoading = false;
    });

    // Get All Account List
    builder.addCase(getAllAccount.pending, (state) => {
      state.accountList = [];
      state.accountListLoading = true;
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
      state.accountListLoading = false;
    });
    builder.addCase(getAllAccount.rejected, (state) => {
      state.accountList = [];
      state.accountListLoading = false;
    });

    //Get Insight Metrics Customer
    builder.addCase(getInsightMetrics.pending, (state, action) => {
      state.lastUpdated = null;
      state.insightMetricsCustomer = null;
      state.insightMetricsCustomerLoading = true;
    });

    builder.addCase(getInsightMetrics.fulfilled, (state, action) => {
      state.lastUpdated = action.payload.data?.last_updated;
      state.insightMetricsCustomer = action.payload.data?.response_data?.map(
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
      state.insightMetricsCustomerLoading = false;
    });

    builder.addCase(getInsightMetrics.rejected, (state, action) => {
      state.lastUpdated = null;
      state.insightMetricsCustomer = null;
      state.insightMetricsCustomerLoading = false;
    });

    // Get Insight Metrics Contract
    builder.addCase(getInsightMetricsContract.pending, (state) => {
      state.insightMetricsContract = null;
      state.insightMetricsContractLoading = true;
    });
    builder.addCase(getInsightMetricsContract.fulfilled, (state, action) => {
      state.insightMetricsContract = action.payload.data;
      state.insightMetricsContractLoading = false;
    });
    builder.addCase(getInsightMetricsContract.rejected, (state) => {
      state.insightMetricsContract = null;
      state.insightMetricsContractLoading = false;
    });

    // getExportExcelFileData
    builder.addCase(getExportExcelFileData.pending, (state) => {
      state.exportedData = [];
      state.exportesDataLoading = true;
    });
    builder.addCase(getExportExcelFileData.fulfilled, (state, action) => {
      state.exportedData = action.payload.data;
      state.exportesDataLoading = false;
    });
    builder.addCase(getExportExcelFileData.rejected, (state) => {
      state.exportedData = [];
      state.exportesDataLoading = false;
    });

    // getUploadedFiles
    builder.addCase(getUploadedFiles.pending, (state) => {
      state.uploadedFilesData = [];
      state.uploadedFilesDataLoading = true;
    });
    builder.addCase(getUploadedFiles.fulfilled, (state, action) => {
      state.uploadedFilesData = action.payload.data;
      state.uploadedFilesDataLoading = false;
    });
    builder.addCase(getUploadedFiles.rejected, (state) => {
      state.uploadedFilesData = [];
      state.uploadedFilesDataLoading = false;
    });
  },
});

export const {} = insightMetricsSlice.actions;
export default insightMetricsSlice.reducer;
