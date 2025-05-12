import { axiosReact } from "@/services/api";
import {
  END_CUSTOMER_ACCOUNT,
  GET_ACCOUNT,
  GET_ALL_USER,
  GET_CONTRACTS,
  GET_EXPORTED_ACCOUNTS_DATA,
  INSIGHT_METRICS_CSN,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getAllUser = createAsyncThunk(
  `account/getAllUser`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ALL_USER);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getExportedAccount = createAsyncThunk(
  `account/getExportedAccount`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_EXPORTED_ACCOUNTS_DATA + `${payload?.id}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get account detail
export const getAccount = createAsyncThunk(
  `account/getAccount`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_ACCOUNT + `${payload?.csn}/${payload?.accountId}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get insight metrics csn
export const getInsightMetricsCsn = createAsyncThunk(
  `account/getInsightMetricsCsn`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        INSIGHT_METRICS_CSN + `${payload?.accountId}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get Contracts Details
export const getContracts = createAsyncThunk(
  `account/getContracts`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_CONTRACTS + `${payload?.accountId}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get End Customer Account
export const getEndCustomerAccount = createAsyncThunk(
  `account/getEndCustomerAccount`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        END_CUSTOMER_ACCOUNT + `${payload?.accountId}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const accountState = {
  allUserData: null,
  exportedAccountData: [],
  accountDetail: null,
  insightMetricsCsn: null,
  contractsDetails: null,
  endCustomerAccount: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState: accountState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All User List
    builder.addCase(getAllUser.pending, (state) => {
      state.allUserData = null;
    });
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.allUserData = action.payload.data;
    });
    builder.addCase(getAllUser.rejected, (state) => {
      state.allUserData = null;
    });

    // Get Exported Data
    builder.addCase(getExportedAccount.pending, (state) => {
      state.exportedAccountData = [];
    });
    builder.addCase(getExportedAccount.fulfilled, (state, action) => {
      let formattedData = action.payload.data?.accounts?.map((account) => ({
        id: account?.id,
        csn: account?.csn ?? null,
        email: account?.contract_manager_email?.[0] ?? null,
        phone: account?.contract_manager_phone?.[0] ?? null,
        name: account?.name ?? "",
        industryGroup: account?.industryGroup ?? null,
        industrySegment: account?.industrySegment ?? null,
        industrySubSegment: account?.industrySubSegment ?? null,
        address1: account?.address1 ?? null,
        city: account?.city ?? null,
        status: account?.status ?? null,
        contract_status: account?.contract_status ?? null,
        buyingReadinessScore: account?.buyingReadinessScore ?? null,
        branch: account?.branch_name ?? null,
        branch_object: account?.branch ?? null,
        user_assign: account?.user_assign_first_names ?? null,
        renewal_person: account?.renewal_person_first_names ?? null,
      }));
      state.exportedAccountData = formattedData;
    });
    builder.addCase(getExportedAccount.rejected, (state) => {
      state.exportedAccountData = [];
    });

    // Get Account Detail
    builder.addCase(getAccount.pending, (state) => {
      state.accountDetail = null;
    });
    builder.addCase(getAccount.fulfilled, (state, action) => {
      state.accountDetail = action.payload.data;
    });
    builder.addCase(getAccount.rejected, (state) => {
      state.accountDetail = null;
    });

    // Get Insight Metrics CSN Summary
    builder.addCase(getInsightMetricsCsn.pending, (state) => {
      state.insightMetricsCsn = null;
    });
    builder.addCase(getInsightMetricsCsn.fulfilled, (state, action) => {
      state.insightMetricsCsn = action.payload.data?.Response;
    });
    builder.addCase(getInsightMetricsCsn.rejected, (state) => {
      state.insightMetricsCsn = null;
    });

    // getContracts
    builder.addCase(getContracts.pending, (state) => {
      state.contractsDetails = null;
    });
    builder.addCase(getContracts.fulfilled, (state, action) => {
      state.contractsDetails = action.payload.data;
    });
    builder.addCase(getContracts.rejected, (state) => {
      state.contractsDetails = null;
    });

    // getEndCustomerAccount
    builder.addCase(getEndCustomerAccount.pending, (state) => {
      state.endCustomerAccount = null;
    });
    builder.addCase(getEndCustomerAccount.fulfilled, (state, action) => {
      state.endCustomerAccount = action.payload.data;
    });
    builder.addCase(getEndCustomerAccount.rejected, (state) => {
      state.endCustomerAccount = null;
    });
  },
});

export const {} = accountSlice.actions;
export default accountSlice.reducer;
