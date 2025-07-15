import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_EXPORT_OPPORTUNITIES,
  GET_NEW_OPPORTUNITY,
  GET_OPPORTUNITY_DETAIL,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getExportedOpportunities = createAsyncThunk(
  "opportunities/getExportedOpportunities",
  async (payload, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (payload?.branch) {
        params.append("branch", encodeURIComponent(payload?.branch));
      }
      if (payload?.from_date && payload?.to_date) {
        params.append("from_date", encodeURIComponent(payload?.from_date));
        params.append("to_date", encodeURIComponent(payload?.to_date));
      }
      if (payload?.cardFilter) {
        params.append(payload?.cardFilter, encodeURIComponent(true));
      }
      const response = await axiosReact.get(
        GET_EXPORT_OPPORTUNITIES + `?${params.toString()}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getOpportunityDetail = createAsyncThunk(
  "opportunities/getOpportunityDetail",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_OPPORTUNITY_DETAIL + `/${payload}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getNewOpportunity = createAsyncThunk(
  "opportunities/getNewOpportunity",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_NEW_OPPORTUNITY);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const addNewOpportunity = createAsyncThunk(
  "opportunities/addNewOpportunity",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(GET_NEW_OPPORTUNITY, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const updateNewOpportunity = createAsyncThunk(
  "opportunities/updateNewOpportunity",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.put(
        GET_NEW_OPPORTUNITY + payload?.id,
        payload
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const initialValue = {
  opportunityLoading: false,
  opportunityList: [],
  expiring_count: {},
  last_updated: "",
  opportunityDetailLoading: false,
  opportunityDetail: null,
  newOpportunityList: [],
  newOpportunityListLoading: false,
};

const opportunitySlice = createSlice({
  name: "opportunity",
  initialState: initialValue,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getExportedOpportunities.pending, (state, action) => {
      state.opportunityList = [];
      state.expiring_count = {};
      state.opportunityLoading = true;
      state.last_updated = "";
    });
    builder.addCase(getExportedOpportunities.fulfilled, (state, action) => {
      state.opportunityList = action.payload.data?.opportunity_data;
      state.expiring_count = action.payload.data?.expiring_count;
      state.last_updated = action.payload.data?.last_updated;
      state.opportunityLoading = false;
    });
    builder.addCase(getExportedOpportunities.rejected, (state, action) => {
      state.opportunityList = [];
      state.expiring_count = {};
      state.opportunityLoading = false;
      state.last_updated = "";
    });

    // Get opportunity detsil
    builder.addCase(getOpportunityDetail.pending, (state, action) => {
      state.opportunityDetailLoading = true;
      state.opportunityDetail = null;
    });
    builder.addCase(getOpportunityDetail.fulfilled, (state, action) => {
      state.opportunityDetailLoading = false;
      state.opportunityDetail = action.payload.data;
    });
    builder.addCase(getOpportunityDetail.rejected, (state, action) => {
      state.opportunityDetailLoading = false;
      state.opportunityDetail = null;
    });

    // Get New Opportunity
    builder.addCase(getNewOpportunity.pending, (state, action) => {
      state.newOpportunityListLoading = true;
      state.newOpportunityList = [];
    });
    builder.addCase(getNewOpportunity.fulfilled, (state, action) => {
      state.newOpportunityListLoading = false;
      state.newOpportunityList = action.payload.data;
    });
    builder.addCase(getNewOpportunity.rejected, (state, action) => {
      state.newOpportunityListLoading = false;
      state.newOpportunityList = [];
    });
  },
});
export const {} = opportunitySlice.actions;
export default opportunitySlice.reducer;
