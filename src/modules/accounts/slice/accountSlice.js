import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  ADD_EDIT_ACCOUNT,
  END_CUSTOMER_ACCOUNT,
  GET_ACCOUNT,
  GET_ACCOUNT_BY_BDPERSON,
  GET_ACCOUNT_INFORMATION,
  GET_ALL_OEM_MANAGER,
  GET_ALL_USER,
  GET_BD_RENEWAL_PERSON,
  GET_CONTRACTS,
  GET_EXPORTED_ACCOUNTS_DATA,
  GET_NEW_ACCOUNT_INFORMATION,
  GET_SUBS_BY_THIRD_PARTY,
  GET_THIRD_PARTY_ACCOUNT,
  GET_TOTAL_AMOUNT_PER_MONTH_FOR_THIRD_PARTY,
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

export const getAllOemManager = createAsyncThunk(
  `account/getAllOemManager`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ALL_OEM_MANAGER);
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
      let url;
      if (payload?.isThirdParty) {
        url = GET_THIRD_PARTY_ACCOUNT;
      } else {
        url = GET_EXPORTED_ACCOUNTS_DATA;
      }
      const response = await axiosReact.get(url + `${payload?.id}`);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get Third Party Exported Account
export const getThirdPartyExportedAccount = createAsyncThunk(
  `account/getThirdPartyExportedAccount`,
  async (payload, thunkAPI) => {
    try {
      let url;
      if (payload?.isThirdParty) {
        url = GET_THIRD_PARTY_ACCOUNT;
      }
      const response = await axiosReact.get(url + `${payload?.id}`);
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
      let response;
      if (payload?.isUpdate) {
        response = await axiosReact.put(
          GET_NEW_ACCOUNT_INFORMATION + `/${payload?.accountId}`,
          payload?.requestBody
        );
      } else {
        response = await axiosReact.get(
          GET_NEW_ACCOUNT_INFORMATION + `/${payload?.accountId}`
        );
      }
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get Renewal and BD Person
export const getBdRenewalPerson = createAsyncThunk(
  `account/getBdRenewalPerson`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_BD_RENEWAL_PERSON + `/${payload}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get Account By Bd Person
export const getAccountByBdPerson = createAsyncThunk(
  `account/getAccountByBdPerson`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_ACCOUNT_BY_BDPERSON + `?bd_ids=${payload}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get Renewal and BD Person
export const addEditAccount = createAsyncThunk(
  `account/addEditAccount`,
  async (payload, thunkAPI) => {
    try {
      let response;
      if (payload?.accountId) {
        response = await axiosReact.get(
          ADD_EDIT_ACCOUNT + `/` + payload?.accountId
        );
      } else if (payload?.updatedAccountId) {
        response = await axiosReact.put(
          ADD_EDIT_ACCOUNT + `/` + payload?.updatedAccountId,
          payload?.updatedPayload
        );
      } else {
        response = await axiosReact.post(ADD_EDIT_ACCOUNT + `/`, payload);
      }
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get Subscription By Third Party
export const getSubscriptionByThirdParty = createAsyncThunk(
  `account/getSubscriptionByThirdParty`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_SUBS_BY_THIRD_PARTY + `?id=${payload}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get total amount per month data
export const getTotalAmountPerMonthChart = createAsyncThunk(
  `account/getTotalAmountPerMonthChart`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_TOTAL_AMOUNT_PER_MONTH_FOR_THIRD_PARTY +
          `?branch_id=${payload?.branch}&status=${payload?.status}`
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
  allOemManager: [],
  last_updated: "",
  thirdPartyLast_updated: "",
  exportedAccountDataLoading: false,
  exportedAccountData: [],
  thirdPartyExportedAccountDataLoading: false,
  thirdPartyExportedAccountData: [],
  accountDetailLoading: false,
  accountDetail: null,
  insightMetricsCsnLoading: false,
  insightMetricsCsn: null,
  contractsDetailsLoading: false,
  contractsDetails: null,
  endCustomerAccountLoading: false,
  endCustomerAccount: null,
  accountInformation: null,
  accountInformationLoading: false,
  subscriptionByThirdParty: [],
  subscriptionByThirdPartyLoading: false,
  totalAmountMonthThirdPartyLoading: false,
  totalAmountMonthThirdParty: [],
};

const accountSlice = createSlice({
  name: "account",
  initialState: accountState,
  reducers: {},
  extraReducers: (builder) => {
    //getAllOemManager
    builder.addCase(getAllOemManager.pending, (state) => {
      state.allOemManager = [];
    });
    builder.addCase(getAllOemManager.fulfilled, (state, action) => {
      state.allOemManager = action.payload.data?.map((i) => ({
        value: i?.id,
        label: i?.full_name,
      }));
    });
    builder.addCase(getAllOemManager.rejected, (state) => {
      state.allOemManager = [];
    });

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
        industryGroup: account?.industryGroup ?? "Unknown",
        industrySegment: account?.industrySegment ?? "Unknown",
        industrySubSegment: account?.industrySubSegment ?? "Unknown",
        address1: account?.address1 ?? null,
        city: account?.city ?? null,
        status: account?.status ?? null,
        dtp_price: account?.dtp_total ?? 0,
        acv_price: account?.acv_total ?? 0,
        total_seats: account?.total_seats ?? 0,
        account_type: account?.type ?? "Unknown",
        account_group: account?.account_group ?? "Unknown",
        contract_status: account?.contract_status ?? null,
        buyingReadinessScore: account?.buyingReadinessScore ?? null,
        branch: account?.branch_name ?? null,
        branch_object: account?.branch ?? null,
        user_assign:
          account?.user_assign_first_names?.length > 0
            ? account?.user_assign_first_names?.join(", ")
            : "",
        user_assign_Arr: account?.user_assign_first_names,
        renewal_person:
          account?.renewal_person_first_names?.length > 0
            ? account?.renewal_person_first_names?.join(", ")
            : "",
        productLineCodes: account?.productLineCodes,
        totalSeats: account?.total_seats,
      }));
      state.exportedAccountData = formattedData;
      state.exportedAccountDataLoading = false;
      state.last_updated = action.payload.data?.last_updated;
    });
    builder.addCase(getExportedAccount.rejected, (state) => {
      state.exportedAccountData = [];
      state.exportedAccountDataLoading = false;
    });

    // getThirdPartyExportedAccount

    builder.addCase(getThirdPartyExportedAccount.pending, (state) => {
      state.thirdPartyExportedAccountData = [];
      state.thirdPartyExportedAccountDataLoading = true;
    });
    builder.addCase(getThirdPartyExportedAccount.fulfilled, (state, action) => {
      let formattedData = action.payload.data?.accounts?.map((account) => ({
        id: account?.id,
        csn: account?.csn ?? null,
        email: account?.contract_manager_email?.[0] ?? null,
        phone: account?.contract_manager_phone?.[0] ?? null,
        name: account?.name ?? "",
        industryGroup: account?.industryGroup ?? "Unknown",
        industrySegment: account?.industrySegment ?? "Unknown",
        industrySubSegment: account?.industrySubSegment ?? "Unknown",
        address1: account?.address1 ?? null,
        city: account?.city ?? null,
        status: account?.status ?? null,
        dtp_price: account?.dtp_total ?? 0,
        acv_price: account?.acv_total ?? 0,
        total_seats: account?.total_seats ?? 0,
        account_type: account?.type ?? "Unknown",
        account_group: account?.account_group ?? "Unknown",
        contract_status: account?.contract_status ?? null,
        buyingReadinessScore: account?.buyingReadinessScore ?? null,
        branch: account?.branch_name ?? null,
        branch_object: account?.branch ?? null,
        user_assign:
          account?.user_assign_firstname?.length > 0
            ? account?.user_assign_firstname?.join(", ")
            : "",
        user_assign_Arr: account?.user_assign_firstname,
        renewal_person:
          account?.renewal_person_firstname?.length > 0
            ? account?.renewal_person_firstname?.join(", ")
            : "",
        associated_account:
          account?.associated_account?.length > 0
            ? account?.associated_account?.join(",  ")
            : "",
        associated_account_details: account?.associated_account_details?.map(
          (item) => ({
            ...item,
            industryGroup: item?.industry ?? "Unknown",
            industrySegment: item?.industry_segment ?? "Unknown",
            industrySubSegment: item?.industry_subsegment ?? "Unknown",
          })
        ),
        associated_account_arr: account?.associated_account,
        productLineCodes: account?.productLineCode,
        totalSeats: account?.total_seats,
      }));
      state.thirdPartyExportedAccountData = formattedData;
      state.thirdPartyExportedAccountDataLoading = false;
      state.thirdPartyLast_updated = action.payload.data?.last_updated;
    });
    builder.addCase(getThirdPartyExportedAccount.rejected, (state) => {
      state.thirdPartyExportedAccountData = [];
      state.thirdPartyExportedAccountDataLoading = false;
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

    // getSubscriptionByThirdParty
    builder.addCase(getSubscriptionByThirdParty.pending, (state) => {
      state.subscriptionByThirdParty = [];
      state.subscriptionByThirdPartyLoading = true;
    });
    builder.addCase(getSubscriptionByThirdParty.fulfilled, (state, action) => {
      state.subscriptionByThirdParty = action.payload.data;
      state.subscriptionByThirdPartyLoading = false;
    });
    builder.addCase(getSubscriptionByThirdParty.rejected, (state) => {
      state.subscriptionByThirdParty = [];
      state.subscriptionByThirdPartyLoading = false;
    });

    // getTotalAmountPerMonthChart
    builder.addCase(getTotalAmountPerMonthChart.pending, (state) => {
      state.totalAmountMonthThirdParty = [];
      state.totalAmountMonthThirdPartyLoading = true;
    });
    builder.addCase(getTotalAmountPerMonthChart.fulfilled, (state, action) => {
      state.totalAmountMonthThirdParty = action.payload.data;
      state.totalAmountMonthThirdPartyLoading = false;
    });
    builder.addCase(getTotalAmountPerMonthChart.rejected, (state) => {
      state.totalAmountMonthThirdParty = [];
      state.totalAmountMonthThirdPartyLoading = false;
    });
  },
});

export const {} = accountSlice.actions;
export default accountSlice.reducer;
