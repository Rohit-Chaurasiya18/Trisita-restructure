import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { GET_ALL_PRODCUT_LINE, GET_CAMPAIGN_HISTORY } from "@/services/url";
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
        params.append("subsegment", encodeURIComponent(payload?.subSegmentGroup));
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

const CampaignSlice = createSlice({
  name: "Campaign",
  initialState: {
    CampaignHistoryListLoading: false,
    CampaignHistoryListList: [],
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
  },
});

export const {} = CampaignSlice.actions;
export default CampaignSlice.reducer;
