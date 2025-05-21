import { axiosReact } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// export const getQuotationData = createAsyncThunk(
//   "quotation/getQuotationData",
//   async (payload, thunkAPI) => {
//     try {
//       //   const response = await axiosReact.get(GET_ADD_QUOTATION);
//       return response;
//     } catch (err) {
//       toast.error(err?.response?.data?.detail || somethingWentWrong);
//       return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
//     }
//   }
// );

const initialValue = {};

const opportunitySlice = createSlice({
  name: "opportunity",
  initialState: initialValue,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(getQuotationData.pending, (state, action) => {});
    // builder.addCase(getQuotationData.fulfilled, (state, action) => {});
    // builder.addCase(getQuotationData.rejected, (state, action) => {});
  },
});
export const {} = opportunitySlice.actions;
export default opportunitySlice.reducer;
