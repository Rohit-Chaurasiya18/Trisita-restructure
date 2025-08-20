import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  BACKUP_OPERATION,
  DASHBOARD_DATA,
  GET_DELETED_COUNT,
  GET_INVOICE_PENDING_LIST,
  GET_ORDER_LOADING_HO,
  GET_PAYMENTS_OUTSTANDING_LIST,
  GET_PAYMENTS_OVERDUE_LIST,
  GET_RENEWAL_DUE,
  GET_RENEWAL_EMAIL_LIST,
  UPDATE_LOCK_UNLOCK_OREDER_LOADING,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const GetDashboardData = createAsyncThunk(
  `dashboard/GetDashboardDataThunk`,
  async (payload, thunkAPI) => {
    try {
      let url = DASHBOARD_DATA;
      if (payload?.id) {
        url = url + `/${payload?.id}`;
      }
      const response = await axiosReact.get(url, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const GetRenewalEmailSentList = createAsyncThunk(
  `dashboard/GetRenewalEmailList`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_RENEWAL_EMAIL_LIST;
      if (payload?.id) {
        url = url + `${payload?.id}/`;
      }
      const response = await axiosReact.get(
        url +
          `?start_date=${payload?.startDate || ""}&end_date=${
            payload?.endDate || ""
          }`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const GetPaymentOverdueList = createAsyncThunk(
  `dashboard/GetPaymentOverdueList`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_PAYMENTS_OVERDUE_LIST);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const GetPaymentOutstandingList = createAsyncThunk(
  `dashboard/GetPaymentOutstandingList`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_PAYMENTS_OUTSTANDING_LIST);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const GetInvoicePendingList = createAsyncThunk(
  `dashboard/GetInvoicePendingList`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_INVOICE_PENDING_LIST);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getOrderLoadingPo = createAsyncThunk(
  `dashboard/getOrderLoadingPo`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ORDER_LOADING_HO + payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const updateLockUnlockStatus = createAsyncThunk(
  `dashboard/updateLockUnlockStatus`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        UPDATE_LOCK_UNLOCK_OREDER_LOADING + payload?.id + "/" + payload?.status
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getRenewalDue = createAsyncThunk(
  `dashboard/getRenewalDue`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_RENEWAL_DUE);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getDeletedData = createAsyncThunk(
  `dashboard/getDeletedData`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_DELETED_COUNT + `?date=${payload}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const backupOperation = createAsyncThunk(
  `dashboard/BackupOperation`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(BACKUP_OPERATION, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
const dashboardState = {
  loading: false,
  dashboardDataLoading: false,
  dashboardData: null,
  dashboardChartLoading: false,
  dashboardChart: null,
  seatDateChartLoading: false,
  seatDateChart: null,
  citiesMapLoading: false,
  citiesMapChart: [],
  dashboardStatus: "",
  renewalEmailSentList: [],
  renewalEmailSentListLoading: false,
  paymentOverdueList: [],
  paymentOverdueListLoading: false,
  paymentOutstandingList: [],
  paymentOutstandingListLoading: false,
  invoicePendingList: [],
  invoicePendingListLoading: false,
  orderLoadingHoDetail: null,
  orderLoadingHoDetailLoading: false,
  renewalDueList: [],
  renewalDueListLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: dashboardState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDashboardLoading: (state, action) => {
      state.dashboardStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get Dashboard Data
    builder.addCase(GetDashboardData.pending, (state) => {
      state.dashboardDataLoading = true;
      state.dashboardData = null;
      state.dashboardChart = null;
      state.dashboardChartLoading = true;
      state.seatDateChart = null;
      state.seatDateChartLoading = true;
      state.citiesMapChart = [];
      state.citiesMapLoading = true;
    });
    builder.addCase(GetDashboardData.fulfilled, (state, action) => {
      state.dashboardDataLoading = false;
      state.dashboardChartLoading = false;
      state.seatDateChartLoading = false;
      state.citiesMapLoading = false;
      state.citiesMapChart = action?.payload?.data?.cityData?.topCities;
      state.seatDateChart = action?.payload?.data?.seatWithDateChart;
      state.dashboardData = action?.payload?.data?.gridBoxData;
      state.dashboardChart = action?.payload?.data?.seatQuantityChart;
    });
    builder.addCase(GetDashboardData.rejected, (state) => {
      state.dashboardDataLoading = false;
      state.dashboardChartLoading = false;
      state.seatDateChartLoading = false;
      state.citiesMapLoading = false;
      state.citiesMapChart = [];
      state.seatDateChart = null;
      state.dashboardData = null;
      state.dashboardChart = null;
    });

    // Get Renewal Email Sent List
    builder.addCase(GetRenewalEmailSentList.pending, (state) => {
      state.renewalEmailSentList = [];
      state.renewalEmailSentListLoading = true;
    });
    builder.addCase(GetRenewalEmailSentList.fulfilled, (state, action) => {
      state.renewalEmailSentList = action.payload.data?.results?.map(
        (item, index) => ({
          ...item,
          bd_person: item?.bd_person_first_names
            ? item?.bd_person_first_names.join(", ")
            : "",
          renewal_person: item?.renewal_person_first_names
            ? item?.renewal_person_first_names.join(", ")
            : "",
          contract_manager_email: item?.contract_manager_email
            ? item?.contract_manager_email.join(", ")
            : "",
          contract_manager_phone: item?.contract_manager_phone
            ? item?.contract_manager_phone.join(", ")
            : "",
          cc_emails: item?.cc_emails ? item?.cc_emails.join(", ") : "",
          index_id: item?.id,
        })
      );
      state.renewalEmailSentListLoading = false;
    });
    builder.addCase(GetRenewalEmailSentList.rejected, (state) => {
      state.renewalEmailSentList = [];
      state.renewalEmailSentListLoading = false;
    });

    // Get Payment Overdue List
    builder.addCase(GetPaymentOverdueList.pending, (state) => {
      state.paymentOverdueList = [];
      state.paymentOverdueListLoading = true;
    });
    builder.addCase(GetPaymentOverdueList.fulfilled, (state, action) => {
      state.paymentOverdueList = action.payload.data?.overdue_orders;
      state.paymentOverdueListLoading = false;
    });
    builder.addCase(GetPaymentOverdueList.rejected, (state) => {
      state.paymentOverdueList = [];
      state.paymentOverdueListLoading = false;
    });

    // Get Payment Outstanding List
    builder.addCase(GetPaymentOutstandingList.pending, (state) => {
      state.paymentOutstandingList = [];
      state.paymentOutstandingListLoading = true;
    });
    builder.addCase(GetPaymentOutstandingList.fulfilled, (state, action) => {
      state.paymentOutstandingList = action.payload.data?.order_list;
      state.paymentOutstandingListLoading = false;
    });
    builder.addCase(GetPaymentOutstandingList.rejected, (state) => {
      state.paymentOutstandingList = [];
      state.paymentOutstandingListLoading = false;
    });

    // Get Invoice Pending List
    builder.addCase(GetInvoicePendingList.pending, (state) => {
      state.invoicePendingList = [];
      state.invoicePendingListLoading = true;
    });
    builder.addCase(GetInvoicePendingList.fulfilled, (state, action) => {
      state.invoicePendingList = action.payload.data?.total_invoice;
      state.invoicePendingListLoading = false;
    });
    builder.addCase(GetInvoicePendingList.rejected, (state) => {
      state.invoicePendingList = [];
      state.invoicePendingListLoading = false;
    });

    // Get Order Loading Ho Detail
    builder.addCase(getOrderLoadingPo.pending, (state) => {
      state.orderLoadingHoDetail = null;
      state.orderLoadingHoDetailLoading = true;
    });
    builder.addCase(getOrderLoadingPo.fulfilled, (state, action) => {
      state.orderLoadingHoDetail = action?.payload?.data?.order_loading_po;
      state.orderLoadingHoDetailLoading = false;
    });
    builder.addCase(getOrderLoadingPo.rejected, (state) => {
      state.orderLoadingHoDetail = null;
      state.orderLoadingHoDetailLoading = false;
    });

    //getRenewalDue
    builder.addCase(getRenewalDue.pending, (state) => {
      state.renewalDueList = [];
      state.renewalDueListLoading = true;
    });
    builder.addCase(getRenewalDue.fulfilled, (state, action) => {
      state.renewalDueList = action?.payload?.data?.subscriptions;
      state.renewalDueListLoading = false;
    });
    builder.addCase(getRenewalDue.rejected, (state) => {
      state.renewalDueList = [];
      state.renewalDueListLoading = false;
    });
  },
});

export const { setLoading, setDashboardLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
