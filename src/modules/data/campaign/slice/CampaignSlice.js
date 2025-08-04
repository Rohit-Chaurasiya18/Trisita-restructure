import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  CAMPAIGN_AUDIENCE_LIST,
  CAMPAIGN_SEND,
  GET_ALL_PRODCUT_LINE,
  GET_CAMPAIGN,
  GET_CAMPAIGN_HISTORY,
  GET_CAMPAIGN_SUBSCRIPTION_CONTACT,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getCampaignHistory = createAsyncThunk(
  `Campaign/getCampaignHistory`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_CAMPAIGN_HISTORY);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const getCampaignHistoryById = createAsyncThunk(
  `Campaign/getCampaignHistoryById`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_CAMPAIGN + payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getAllProductLine = createAsyncThunk(
  `Campaign/getAllProductLine`,
  async (payload, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (payload?.branch) {
        params.append("branch_id", encodeURIComponent(payload?.branch));
      }
      if (payload?.accountGroup) {
        params.append(
          "account_group",
          encodeURIComponent(payload?.accountGroup)
        );
      }
      if (payload?.industryGroup) {
        params.append("industry", encodeURIComponent(payload?.industryGroup));
      }

      if (payload?.segmentGroup) {
        params.append("segment", encodeURIComponent(payload?.segmentGroup));
      }

      if (payload?.subSegmentGroup) {
        params.append(
          "subsegment",
          encodeURIComponent(payload?.subSegmentGroup)
        );
      }

      const response = await axiosReact.get(
        GET_ALL_PRODCUT_LINE + `?${params.toString()}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getCampaignAudience = createAsyncThunk(
  `Campaign/getCampaignAudience`,
  async (payload, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (payload?.branch) {
        params.append("branch_id", encodeURIComponent(payload?.branch));
      }
      if (payload?.accountGroup) {
        params.append(
          "account_group",
          encodeURIComponent(payload?.accountGroup)
        );
      }
      if (payload?.industryGroup) {
        params.append("industry", encodeURIComponent(payload?.industryGroup));
      }

      if (payload?.segmentGroup) {
        params.append("segment", encodeURIComponent(payload?.segmentGroup));
      }

      if (payload?.subSegmentGroup) {
        params.append(
          "subsegment",
          encodeURIComponent(payload?.subSegmentGroup)
        );
      }
      if (payload?.status) {
        params.append("status", encodeURIComponent(payload?.status));
      }
      if (payload?.productLine) {
        params.append(
          "product_line_code",
          encodeURIComponent(payload?.productLine)
        );
      }
      const response = await axiosReact.get(
        CAMPAIGN_AUDIENCE_LIST + `?${params.toString()}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const campaignSend = createAsyncThunk(
  `Campaign/campaignSend`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(CAMPAIGN_SEND, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const addSetContent = createAsyncThunk(
  `Campaign/addSetContent`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(
        GET_CAMPAIGN_SUBSCRIPTION_CONTACT,
        payload
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const CampaignSlice = createSlice({
  name: "Campaign",
  initialState: {
    CampaignHistoryListLoading: false,
    CampaignHistoryListList: [],
    campaignHistoryById: null,
    campaignHistoryByIdLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCampaignHistory.pending, (state) => {
      state.CampaignHistoryListList = [];
      state.CampaignHistoryListLoading = true;
    });
    builder.addCase(getCampaignHistory.fulfilled, (state, action) => {
      state.CampaignHistoryListList = action.payload.data?.Response;
      state.CampaignHistoryListLoading = false;
    });
    builder.addCase(getCampaignHistory.rejected, (state) => {
      state.CampaignHistoryListList = [];
      state.CampaignHistoryListLoading = false;
    });

    builder.addCase(getCampaignHistoryById.pending, (state) => {
      state.campaignHistoryById = [];
      state.campaignHistoryByIdLoading = true;
    });
    builder.addCase(getCampaignHistoryById.fulfilled, (state, action) => {
      state.campaignHistoryById = action.payload.data;
      state.campaignHistoryByIdLoading = false;
    });
    builder.addCase(getCampaignHistoryById.rejected, (state) => {
      state.campaignHistoryById = [];
      state.campaignHistoryByIdLoading = false;
    });
  },
});

export const {} = CampaignSlice.actions;
export default CampaignSlice.reducer;
