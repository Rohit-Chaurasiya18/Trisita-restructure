import { axiosReact } from "@/services/api";
import {
  END_CUSTOMER_ACCOUNT,
  GET_ACCOUNT,
  GET_ACCOUNT_INFORMATION,
  GET_ALL_USER,
  GET_CONTRACTS,
  GET_EXPORTED_ACCOUNTS_DATA,
  INSIGHT_METRICS_CSN,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get All User
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

// Get Exported Account
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

// Get Account Detail
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

// Get Insight Metrics Csn
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

// Get Account Information
export const getAccountInformation = createAsyncThunk(
  `account/getAccountInformation`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_ACCOUNT_INFORMATION + `/${payload?.accountId}`
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
  exportedAccountDataLoading: false,
  exportedAccountData: [],
  accountDetailLoading: false,
  accountDetail: null,
  insightMetricsCsnLoading: false,
  insightMetricsCsn: null,
  contractsDetailsLoading: false,
  contractsDetails: null,
  endCustomerAccountLoading: false,
  endCustomerAccount: null,
  industryGroupCount: {},
  accountInformation: null,
  accountInformationLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState: accountState,
  reducers: {},
  extraReducers: (builder) => {
    // getAllUser
    builder.addCase(getAllUser.pending, (state) => {
      state.allUserData = null;
    });
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.allUserData = action.payload.data;
    });
    builder.addCase(getAllUser.rejected, (state) => {
      state.allUserData = null;
    });

    // getExportedAccount
    builder.addCase(getExportedAccount.pending, (state) => {
      state.exportedAccountData = [];
      state.exportedAccountDataLoading = true;
    });
    builder.addCase(getExportedAccount.fulfilled, (state, action) => {
      let formattedData = action.payload.data?.accounts?.map((account) => ({
        id: account?.id,
        csn: account?.csn ?? null,
        email: account?.contract_manager_email?.[0] ?? null,
        phone: account?.contract_manager_phone?.[0] ?? null,
        name: account?.name ?? "",

        // industryGroup: account?.industryGroup ?? null,
        industryGroup: account?.industryGroup ?? "Unknown",

        // industrySegment: account?.industrySegment ?? null,
        industrySegment: account?.industrySegment ?? "Unknown",

        // industrySubSegment: account?.industrySubSegment ?? null,
        industrySubSegment: account?.industrySubSegment ?? "Unknown",

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

      // const fixedOrder = ["AEC", "MFG", "M&E", "EDU", "OTH", "Unknown", "Null"];
      const fixedOrder = ["AEC", "MFG", "M&E", "EDU", "OTH", "Unknown"];

      const groupedCounts = {
        All: { title: "All", active: 0, expired: 0, total: 0 },
      };

      for (const group of fixedOrder) {
        groupedCounts[group] = {
          title: group,
          active: 0,
          expired: 0,
          total: 0,
        };
      }

      for (const item of formattedData) {
        const group = item.industryGroup || "Null";
        const status = item.contract_status === "Active" ? "active" : "expired";

        const key = fixedOrder.includes(group) ? group : "Unknown";

        groupedCounts[key][status]++;
        groupedCounts[key].total++;

        groupedCounts.All[status]++;
        groupedCounts.All.total++;
      }

      const industryGroupStats = [
        groupedCounts["All"],
        ...fixedOrder.map((key) => groupedCounts[key]),
      ];
      state.industryGroupCount = industryGroupStats;
      state.exportedAccountData = formattedData;
      state.exportedAccountDataLoading = false;
    });
    builder.addCase(getExportedAccount.rejected, (state) => {
      state.exportedAccountData = [];
      state.exportedAccountDataLoading = false;
    });

    // getAccount
    builder.addCase(getAccount.pending, (state) => {
      state.accountDetail = null;
      state.accountDetailLoading = true;
    });
    builder.addCase(getAccount.fulfilled, (state, action) => {
      state.accountDetail = action.payload.data;
      state.accountDetailLoading = false;
    });
    builder.addCase(getAccount.rejected, (state) => {
      state.accountDetail = null;
      state.accountDetailLoading = false;
    });

    // getInsightMetricsCsn
    builder.addCase(getInsightMetricsCsn.pending, (state) => {
      state.insightMetricsCsn = null;
      state.insightMetricsCsnLoading = true;
    });
    builder.addCase(getInsightMetricsCsn.fulfilled, (state, action) => {
      state.insightMetricsCsn = action.payload.data?.Response;
      state.insightMetricsCsnLoading = false;
    });
    builder.addCase(getInsightMetricsCsn.rejected, (state) => {
      state.insightMetricsCsn = null;
      state.insightMetricsCsnLoading = false;
    });

    // getContracts
    builder.addCase(getContracts.pending, (state) => {
      state.contractsDetails = null;
      state.contractsDetailsLoading = true;
    });
    builder.addCase(getContracts.fulfilled, (state, action) => {
      state.contractsDetails = action.payload.data;
      state.contractsDetailsLoading = false;
    });
    builder.addCase(getContracts.rejected, (state) => {
      state.contractsDetails = null;
      state.contractsDetailsLoading = false;
    });

    // getEndCustomerAccount
    builder.addCase(getEndCustomerAccount.pending, (state) => {
      state.endCustomerAccount = null;
      state.endCustomerAccountLoading = true;
    });
    builder.addCase(getEndCustomerAccount.fulfilled, (state, action) => {
      state.endCustomerAccount = action.payload.data;
      state.endCustomerAccountLoading = false;
    });
    builder.addCase(getEndCustomerAccount.rejected, (state) => {
      state.endCustomerAccount = null;
      state.endCustomerAccountLoading = false;
    });

    // getAccountInformation
    builder.addCase(getAccountInformation.pending, (state) => {
      state.accountInformation = null;
      state.accountInformationLoading = true;
    });
    builder.addCase(getAccountInformation.fulfilled, (state, action) => {
      state.accountInformation = action.payload.data;
      state.accountInformationLoading = false;
    });
    builder.addCase(getAccountInformation.rejected, (state) => {
      state.accountInformation = null;
      state.accountInformationLoading = false;
    });
  },
});

export const {} = accountSlice.actions;
export default accountSlice.reducer;
