import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { MANAGE_TEMPLATE_URL } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// getProductMasterData
export const getManageTemplate = createAsyncThunk(
  `manageTemplate/getManageTemplate`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(MANAGE_TEMPLATE_URL);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
// updateManageTemplate
export const updateManageTemplate = createAsyncThunk(
  `manageTemplate/updateManageTemplate`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.put(
        MANAGE_TEMPLATE_URL + payload?.id + "/",
        payload
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// addManageTemplate
export const addManageTemplate = createAsyncThunk(
  `manageTemplate/addManageTemplate`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(MANAGE_TEMPLATE_URL, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const ManageTemplateState = {
  templatesData: [],
  templatesDataLoading: false,
};

const manageTemplatetSlice = createSlice({
  name: "manageTemplate",
  initialState: ManageTemplateState,
  reducers: {},
  extraReducers: (builder) => {
    // getManageTemplate
    builder.addCase(getManageTemplate.pending, (state) => {
      state.templatesData = [];
      state.templatesDataLoading = true;
    });
    builder.addCase(getManageTemplate.fulfilled, (state, action) => {
      state.templatesData = action.payload.data?.map((item) => ({
        label: item?.name,
        value: item?.id,
        days: item?.days,
        content: item?.content,
      }));
      state.templatesDataLoading = false;
    });
    builder.addCase(getManageTemplate.rejected, (state) => {
      state.templatesData = [];
      state.templatesDataLoading = false;
    });
  },
});

export const {} = manageTemplatetSlice.actions;
export default manageTemplatetSlice.reducer;
