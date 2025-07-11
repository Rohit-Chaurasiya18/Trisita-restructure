import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_ALL_BD_PERSON_BY_BRANCH,
  GET_BRANCH_ACCOUNT_PRODUCTLINE,
  GET_LICENSE_OPTIMISATION,
  GET_RA_ORDER,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getAllBdPersonByBranchId = createAsyncThunk(
  `LicenseOptimization/getAllBdPersonByBranchId`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_ALL_BD_PERSON_BY_BRANCH + `?branch_id=${payload}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getLicenseOptimizationData = createAsyncThunk(
  `LicenseOptimization/getLicenseOptimizationData`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_BRANCH_ACCOUNT_PRODUCTLINE +
          `?branch_id=${payload?.branch}&account_ids=${payload?.account}`
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getLicenseOptimisation = createAsyncThunk(
  `LicenseOptimization/getLicenseOptimisation`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(GET_LICENSE_OPTIMISATION, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const LicenseOptimizationState = {
  licenseOptimizationData: null,
  licenseOptimizationLoading: false,
};

const LicenseOptimizationSlice = createSlice({
  name: "LicenseOptimization",
  initialState: LicenseOptimizationState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLicenseOptimisation.pending, (state) => {
      state.licenseOptimizationLoading = true;
      state.licenseOptimizationData = null;
    });
    builder.addCase(getLicenseOptimisation.fulfilled, (state, action) => {
      state.licenseOptimizationLoading = false;
      state.licenseOptimizationData = action.payload.data?.data;
    });
    builder.addCase(getLicenseOptimisation.rejected, (state) => {
      state.licenseOptimizationLoading = false;
      state.licenseOptimizationData = null;
    });
  },
});

export const {} = LicenseOptimizationSlice.actions;
export default LicenseOptimizationSlice.reducer;
