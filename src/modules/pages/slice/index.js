import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  CALENDAR_LIST,
  GENERATE_TICKET,
  GET_CALENDAR_SUBSCRIPTION_DETAILS,
  GET_SUBSCRIPTION_TICKET,
  GET_TICKET_ISSUES,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getCalendarList = createAsyncThunk(
  `pages/getCalendarList`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(CALENDAR_LIST);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const getSubscriptionByCalendar = createAsyncThunk(
  `pages/getSubscriptionByCalendar`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_CALENDAR_SUBSCRIPTION_DETAILS + `${payload?.id}/${payload?.status}/`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getTicketIssues = createAsyncThunk(
  `pages/getTicketIssues`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_TICKET_ISSUES);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const generateTicket = createAsyncThunk(
  `pages/generateTicket`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(GENERATE_TICKET, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getTicketList = createAsyncThunk(
  `pages/getTicketList`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GENERATE_TICKET);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getSubscriptionTicket = createAsyncThunk(
  `pages/getSubscriptionTicket`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_SUBSCRIPTION_TICKET);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
const pagesState = {
  calendarList: [],
  calendarListLoading: false,
  calendarSubscriptionData: null,
  calendarSubscriptionLoading: false,
  ticketsIssues: [],
  ticketsIssuesLoading: false,
  subscriptionList: [],
  subscriptionListLoading: false,
  ticketListing: [],
  ticketListingLoading: false,
};

const pagesSlice = createSlice({
  name: "pages",
  initialState: pagesState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCalendarList.pending, (state) => {
      state.calendarList = [];
      state.calendarListLoading = true;
    });
    builder.addCase(getCalendarList.fulfilled, (state, action) => {
      state.calendarListLoading = false;
      state.calendarList = action.payload.data;
    });
    builder.addCase(getCalendarList.rejected, (state) => {
      state.calendarList = [];
      state.calendarListLoading = false;
    });

    // getSubscriptionByCalendar
    builder.addCase(getSubscriptionByCalendar.pending, (state) => {
      state.calendarSubscriptionData = null;
      state.calendarSubscriptionLoading = true;
    });
    builder.addCase(getSubscriptionByCalendar.fulfilled, (state, action) => {
      state.calendarSubscriptionLoading = false;
      state.calendarSubscriptionData = action.payload.data;
    });
    builder.addCase(getSubscriptionByCalendar.rejected, (state) => {
      state.calendarSubscriptionData = null;
      state.calendarSubscriptionLoading = false;
    });

    //getTicketList
    builder.addCase(getTicketList.pending, (state) => {
      state.ticketListing = [];
      state.ticketListingLoading = true;
    });
    builder.addCase(getTicketList.fulfilled, (state, action) => {
      state.ticketListing = action.payload.data;
      state.ticketListingLoading = false;
    });
    builder.addCase(getTicketList.rejected, (state) => {
      state.ticketListing = [];
      state.ticketListingLoading = false;
    });
    //getTicketIssues
    builder.addCase(getTicketIssues.pending, (state) => {
      state.ticketsIssues = [];
      state.ticketsIssuesLoading = true;
    });
    builder.addCase(getTicketIssues.fulfilled, (state, action) => {
      state.ticketsIssuesLoading = false;
      state.ticketsIssues = action.payload.data?.map((i) => ({
        value: i?.id,
        label: i?.name,
      }));
    });
    builder.addCase(getTicketIssues.rejected, (state) => {
      state.ticketsIssues = [];
      state.ticketsIssuesLoading = false;
    });

    // getSubscriptionTicket
    builder.addCase(getSubscriptionTicket.pending, (state) => {
      state.subscriptionList = [];
      state.subscriptionListLoading = true;
    });
    builder.addCase(getSubscriptionTicket.fulfilled, (state, action) => {
      state.subscriptionList = action.payload.data?.subscriptions?.map(
        (item) => ({
          ...item,
          value: item?.id,
          label: `${item?.subscriptionReferenceNumber} - (${item?.productLine})`,
        })
      );
      state.subscriptionListLoading = false;
    });
    builder.addCase(getSubscriptionTicket.rejected, (state) => {
      state.subscriptionList = [];
      state.subscriptionListLoading = false;
    });
  },
});
export const {} = pagesSlice.actions;
export default pagesSlice.reducer;
