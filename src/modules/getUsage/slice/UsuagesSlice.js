import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { GET_USUAGE_DATA } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getAllUsuages = createAsyncThunk(
  `usuages/getAllUsuages`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_USUAGE_DATA;
      if (payload?.csn) {
        url = `${GET_USUAGE_DATA}${payload?.csn}`;
      }
      const response = await axiosReact.post(GET_USUAGE_DATA, payload?.payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const UsuagesState = {
  usuagesDataLoading: false,
  usuagesData: [],
  productLineCode: [],
  login_counts: [],
};

const usuagesSlice = createSlice({
  name: "usuages",
  initialState: UsuagesState,
  reducers: {},
  extraReducers: (builder) => {
    // getAllUsuages
    builder.addCase(getAllUsuages.pending, (state) => {
      state.usuagesDataLoading = true;
      state.usuagesData = [];
    });
    builder.addCase(getAllUsuages.fulfilled, (state, action) => {
      state.usuagesDataLoading = false;
      state.usuagesData = action.payload.data?.usages;
      state.productLineCode = action.payload.data?.product_line_codes;
      state.login_counts = action.payload.data?.login_counts;
    });
    builder.addCase(getAllUsuages.rejected, (state, action) => {
      state.usuagesDataLoading = false;
      state.usuagesData = [];
    });
  },
});

export const {} = usuagesSlice.actions;
export default usuagesSlice.reducer;
