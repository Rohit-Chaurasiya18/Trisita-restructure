import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  CITIES_MAP_URL,
  DASHBOARD_CHART,
  DASHBOARD_DATA,
  DASHBOARD_SEAT_DATE_CHART,
  GET_INVOICE_PENDING_LIST,
  GET_PAYMENTS_OUTSTANDING_LIST,
  GET_PAYMENTS_OVERDUE_LIST,
  GET_RENEWAL_EMAIL_LIST,
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

export const GetDashboardChart = createAsyncThunk(
  `dashboard/GetDashboardChartThunk`,
  async (payload, thunkAPI) => {
    try {
      let url = DASHBOARD_CHART;
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

export const GetSeatDateChart = createAsyncThunk(
  `dashboard/GetSeatDateChartThunk`,
  async (payload, thunkAPI) => {
    try {
      let url = DASHBOARD_SEAT_DATE_CHART;
      if (payload) {
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

export const GetCitiesMap = createAsyncThunk(
  `dashboard/GetCitiesMap`,
  async (payload, thunkAPI) => {
    try {
      let url = CITIES_MAP_URL;
      if (payload) {
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
      const response = await axiosReact.get(
        GET_RENEWAL_EMAIL_LIST +
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
    });
    builder.addCase(GetDashboardData.fulfilled, (state, action) => {
      state.dashboardDataLoading = false;
      state.dashboardData = action?.payload?.data;
    });
    builder.addCase(GetDashboardData.rejected, (state) => {
      state.dashboardDataLoading = false;
      state.dashboardData = null;
    });

    // Get Dashboard Chart
    builder.addCase(GetDashboardChart.pending, (state) => {
      state.dashboardChart = null;
      state.dashboardChartLoading = true;
    });
    builder.addCase(GetDashboardChart.fulfilled, (state, action) => {
      state.dashboardChart = action?.payload?.data;
      state.dashboardChartLoading = false;
    });
    builder.addCase(GetDashboardChart.rejected, (state) => {
      state.dashboardChart = null;
      state.dashboardChartLoading = false;
    });

    // Get Seat Date Chart
    builder.addCase(GetSeatDateChart.pending, (state) => {
      state.seatDateChart = null;
      state.seatDateChartLoading = true;
    });
    builder.addCase(GetSeatDateChart.fulfilled, (state, action) => {
      state.seatDateChart = action?.payload?.data;
      state.seatDateChartLoading = false;
    });
    builder.addCase(GetSeatDateChart.rejected, (state) => {
      state.seatDateChart = null;
      state.seatDateChartLoading = false;
    });

    // Get Cities Map Data
    builder.addCase(GetCitiesMap.pending, (state) => {
      state.citiesMapChart = [];
      state.citiesMapLoading = true;
    });
    builder.addCase(GetCitiesMap.fulfilled, (state, action) => {
      state.citiesMapChart = action?.payload?.data?.topCities;
      state.citiesMapLoading = false;
    });
    builder.addCase(GetCitiesMap.rejected, (state) => {
      state.citiesMapChart = [];
      state.citiesMapLoading = false;
    });

    // Get Renewal Email Sent List
    builder.addCase(GetRenewalEmailSentList.pending, (state) => {
      state.renewalEmailSentList = [];
      state.renewalEmailSentListLoading = true;
    });
    builder.addCase(GetRenewalEmailSentList.fulfilled, (state, action) => {
      state.renewalEmailSentList = action.payload.data?.Response?.map(
        (item) => ({
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
  },
});

export const { setLoading, setDashboardLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
