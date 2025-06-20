import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_BACKUP_SUBSCRIPTION,
  GET_CHANGED_LOG_SUBSCRIPTION_DATA,
  GET_CHANGED_LOG_SUBSCRIPTION_DETAIL,
  GET_COMPARE_SUBSCRIPTION_DATA,
  GET_DELETED_SUBSCRIPTION_DATA,
  GET_DELETED_SUBSCRIPTION_DETAIL,
  GET_NEW_SUBSCRIPTION_DATA,
  GET_NEW_SUBSCRIPTION_DETAIL,
  GET_SUBSCRIPTION,
  GET_SUBSCRIPTION_DATA,
  TRIGGER_TEMPLATE_URL,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get Subscription Data
export const getSubscriptionData = createAsyncThunk(
  `subscription/getSubscriptionData`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_SUBSCRIPTION_DATA;
      if (payload?.csn) {
        url = url + `${payload?.csn}`;
      }
      const response = await axiosReact.post(url, payload?.payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
// Get New Subscription Data
export const getNewSubscriptionData = createAsyncThunk(
  `subscription/getNewSubscriptionData`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_NEW_SUBSCRIPTION_DATA;
      if (payload?.csn) {
        url = url + `${payload?.csn}`;
      }
      const response = await axiosReact.post(url, payload?.payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get New Subscription Detail
export const getNewSubscriptionDetail = createAsyncThunk(
  `subscription/getNewSubscriptionDetail`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_NEW_SUBSCRIPTION_DETAIL;
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

// Get Deleted Subscription Data
export const getDeletedSubscriptionData = createAsyncThunk(
  `subscription/getDeletedSubscriptionData`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_DELETED_SUBSCRIPTION_DATA;
      if (payload?.csn) {
        url = url + `${payload?.csn}`;
      }
      const response = await axiosReact.post(url, payload?.payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get New Subscription Detail
export const getDeletedSubscriptionDetail = createAsyncThunk(
  `subscription/getDeletedSubscriptionDetail`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_DELETED_SUBSCRIPTION_DETAIL;
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

// Get Changed Log Subscription Data
export const getChangedLogSubscriptionData = createAsyncThunk(
  `subscription/getChangedLogSubscriptionData`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_CHANGED_LOG_SUBSCRIPTION_DATA;
      if (payload?.csn) {
        url = url + `${payload?.csn}`;
      }
      const response = await axiosReact.post(url, payload?.payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get Changed Log Subscription Detail
export const getChangedLogSubscriptionDetail = createAsyncThunk(
  `subscription/getChangedLogSubscriptionDetail`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_CHANGED_LOG_SUBSCRIPTION_DETAIL;
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

// Get Changed Log Subscription Data
export const getCompareSubscriptionData = createAsyncThunk(
  `subscription/getCompareSubscriptionData`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_COMPARE_SUBSCRIPTION_DATA;
      if (payload?.csn) {
        url = url + `${payload?.csn}`;
      }
      const response = await axiosReact.get(url);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Get Backup Subscription Data
export const getBackupSubscriptionDetail = createAsyncThunk(
  `subscription/getBackupSubscriptionDetail`,
  async (payload, thunkAPI) => {
    try {
      let url =
        payload?.tableId === 1 ? GET_BACKUP_SUBSCRIPTION : GET_SUBSCRIPTION;
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

// Hanlde Trigger Template
export const handleTriggerTemplate = createAsyncThunk(
  `subscription/handleTriggerTemplate`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(
        TRIGGER_TEMPLATE_URL + payload?.id + "/",
        payload
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// Hanlde Trigger Template
export const getTriggeredTemplate = createAsyncThunk(
  `subscription/getTriggeredTemplate`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        TRIGGER_TEMPLATE_URL + payload + "/"
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const intialState = {
  lastUpdate: null,
  speedometerRatio: null,
  subscriptionData: [],
  subscriptionDataLoading: false,
  subscriptionDetails: null,
  subscriptionDetailsLoading: false,
  newSubscriptionData: [],
  newSubscriptionDataLoading: false,
  newSubscriptionDetails: null,
  newSubscriptionDetailsLoading: false,
  deletedSubscriptionData: [],
  deletedSubscriptionDataLoading: false,
  deletedSubscriptionDetails: null,
  deletedSubscriptionDetailsLoading: false,
  changedLogSubscriptionData: [],
  changedLogSubscriptionDataLoading: false,
  changedLogSubscriptionDetails: null,
  changedLogSubscriptionDetailsLoading: false,
  compareSubscriptionData: {},
  compareSubscriptionDataLoading: false,
  compareSubscriptionDetails: null,
  compareSubscriptionDetailsLoading: false,
  subscriptionTemplateCCEmails: [],
  subscriptionTemplate: [],
  subscriptionTemplateLoading: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: intialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Subscription Data
    builder.addCase(getSubscriptionData.pending, (state) => {
      state.subscriptionDataLoading = true;
      state.lastUpdate = null;
      state.speedometerRatio = null;
      state.subscriptionData = [];
    });
    builder.addCase(getSubscriptionData.fulfilled, (state, action) => {
      state.subscriptionDataLoading = false;
      state.lastUpdate = action.payload.data?.last_updated;
      state.speedometerRatio =
        action.payload.data?.percentage_ratio_of_inactiveuser_and_expiredsubs;
      state.subscriptionData = action.payload.data?.subscriptions?.map(
        (item) => ({
          ...item,
          bd_person: item.bd_person_first_names
            ? item.bd_person_first_names.join(", ")
            : "",
          renewal_person: item.renewal_person_first_names
            ? item.renewal_person_first_names.join(", ")
            : "",
          third_party: item.third_party_names
            ? item.third_party_names.join(", ")
            : "",
        })
      );
    });
    builder.addCase(getSubscriptionData.rejected, (state) => {
      state.subscriptionDataLoading = false;
      state.lastUpdate = null;
      state.speedometerRatio = null;
      state.subscriptionData = [];
    });

    // Get New Subscription Data
    builder.addCase(getNewSubscriptionData.pending, (state, action) => {
      state.newSubscriptionData = [];
      state.newSubscriptionDataLoading = true;
    });
    builder.addCase(getNewSubscriptionData.fulfilled, (state, action) => {
      state.newSubscriptionData = action.payload.data?.map((item) => ({
        ...item,
        bd_person: item?.bd_person_first_names
          ? item?.bd_person_first_names.join(", ")
          : "",
        renewal_person: item?.renewal_person_first_names
          ? item?.renewal_person_first_names.join(", ")
          : "",
      }));
      state.newSubscriptionDataLoading = false;
    });
    builder.addCase(getNewSubscriptionData.rejected, (state) => {
      state.newSubscriptionData = [];
      state.newSubscriptionDataLoading = false;
    });

    // Get New Subscription Details
    builder.addCase(getNewSubscriptionDetail.pending, (state) => {
      state.newSubscriptionDetails = null;
      state.newSubscriptionDetailsLoading = true;
    });
    builder.addCase(getNewSubscriptionDetail.fulfilled, (state, action) => {
      state.newSubscriptionDetails = action.payload.data;
      state.newSubscriptionDetailsLoading = false;
    });
    builder.addCase(getNewSubscriptionDetail.rejected, (state) => {
      state.newSubscriptionDetails = null;
      state.newSubscriptionDetailsLoading = false;
    });

    // Get Deleted Subscription Data
    builder.addCase(getDeletedSubscriptionData.pending, (state, action) => {
      state.deletedSubscriptionData = [];
      state.deletedSubscriptionDataLoading = true;
    });
    builder.addCase(getDeletedSubscriptionData.fulfilled, (state, action) => {
      state.deletedSubscriptionData = action.payload.data?.map((item) => ({
        ...item,
        bd_person: item?.bd_person_first_names
          ? item?.bd_person_first_names.join(", ")
          : "",
        renewal_person: item?.renewal_person_first_names
          ? item?.renewal_person_first_names.join(", ")
          : "",
      }));
      state.deletedSubscriptionDataLoading = false;
    });
    builder.addCase(getDeletedSubscriptionData.rejected, (state) => {
      state.deletedSubscriptionData = [];
      state.deletedSubscriptionDataLoading = false;
    });

    // Get Deleted Subscription Details
    builder.addCase(getDeletedSubscriptionDetail.pending, (state) => {
      state.deletedSubscriptionDetails = null;
      state.deletedSubscriptionDetailsLoading = true;
    });
    builder.addCase(getDeletedSubscriptionDetail.fulfilled, (state, action) => {
      state.deletedSubscriptionDetails = action.payload.data;
      state.deletedSubscriptionDetailsLoading = false;
    });
    builder.addCase(getDeletedSubscriptionDetail.rejected, (state) => {
      state.deletedSubscriptionDetails = null;
      state.deletedSubscriptionDetailsLoading = false;
    });

    // Get Changed Log Subscription Data
    builder.addCase(getChangedLogSubscriptionData.pending, (state, action) => {
      state.changedLogSubscriptionData = [];
      state.changedLogSubscriptionDataLoading = true;
    });
    builder.addCase(
      getChangedLogSubscriptionData.fulfilled,
      (state, action) => {
        state.changedLogSubscriptionData = action.payload.data?.map((item) => ({
          ...item,
          bd_person: item?.bd_person_first_names
            ? item?.bd_person_first_names.join(", ")
            : "",
          renewal_person: item?.renewal_person_first_names
            ? item?.renewal_person_first_names.join(", ")
            : "",
        }));
        state.changedLogSubscriptionDataLoading = false;
      }
    );
    builder.addCase(getChangedLogSubscriptionData.rejected, (state) => {
      state.changedLogSubscriptionData = [];
      state.changedLogSubscriptionDataLoading = false;
    });

    // Get Changed Log Subscription Details
    builder.addCase(getChangedLogSubscriptionDetail.pending, (state) => {
      state.changedLogSubscriptionDetails = null;
      state.changedLogSubscriptionDetailsLoading = true;
    });
    builder.addCase(
      getChangedLogSubscriptionDetail.fulfilled,
      (state, action) => {
        state.changedLogSubscriptionDetails = action.payload.data;
        state.changedLogSubscriptionDetailsLoading = false;
      }
    );
    builder.addCase(getChangedLogSubscriptionDetail.rejected, (state) => {
      state.changedLogSubscriptionDetailsLoading = false;
      state.changedLogSubscriptionDetails = null;
    });

    // Get Compare Subscription Data
    builder.addCase(getCompareSubscriptionData.pending, (state, action) => {
      state.compareSubscriptionData = {};
      state.compareSubscriptionDataLoading = true;
    });
    builder.addCase(getCompareSubscriptionData.fulfilled, (state, action) => {
      state.compareSubscriptionData = action.payload.data;
      state.compareSubscriptionDataLoading = false;
    });
    builder.addCase(getCompareSubscriptionData.rejected, (state) => {
      state.compareSubscriptionData = {};
      state.compareSubscriptionDataLoading = false;
    });

    // Get Compare Subscription Details
    builder.addCase(getBackupSubscriptionDetail.pending, (state, action) => {
      if (action.meta.arg?.isSubscription) {
        state.subscriptionDetails = null;
        state.subscriptionDetailsLoading = false;
      } else {
        state.compareSubscriptionDetails = null;
        state.compareSubscriptionDetailsLoading = true;
      }
    });
    builder.addCase(getBackupSubscriptionDetail.fulfilled, (state, action) => {
      if (action.meta.arg?.isSubscription) {
        state.subscriptionDetails = action.payload.data;
        state.subscriptionDetailsLoading = false;
      } else {
        state.compareSubscriptionDetails = action.payload.data;
        state.compareSubscriptionDetailsLoading = false;
      }
    });
    builder.addCase(getBackupSubscriptionDetail.rejected, (state, action) => {
      if (action.meta.arg?.isSubscription) {
        state.subscriptionDetails = null;
        state.subscriptionDetailsLoading = false;
      } else {
        state.compareSubscriptionDetailsLoading = false;
        state.compareSubscriptionDetails = null;
      }
    });

    // Get Subscription Template
    builder.addCase(getTriggeredTemplate.pending, (state) => {
      state.subscriptionTemplateCCEmails = [];
      state.subscriptionTemplate = [];
      state.subscriptionTemplateLoading = true;
    });
    builder.addCase(getTriggeredTemplate.fulfilled, (state, action) => {
      state.subscriptionTemplateCCEmails = action.payload.data?.cc_emails;
      state.subscriptionTemplate =
        action.payload.data?.trigger_choices_new?.map((item) => item?.id);
      state.subscriptionTemplateLoading = false;
    });
    builder.addCase(getTriggeredTemplate.rejected, (state) => {
      state.subscriptionTemplateCCEmails = [];
      state.subscriptionTemplate = [];
      state.subscriptionTemplateLoading = false;
    });
  },
});

export const {} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
