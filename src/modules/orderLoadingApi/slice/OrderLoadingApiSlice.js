import { axiosReact } from "@/services/api";
import { GET_ORDER_LOADING_HO } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getOrderLoadingHOList = createAsyncThunk(
  `orderLoadingApi/getOrderLoadingHOList`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ORDER_LOADING_HO);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const orderLoadingApiState = {
  orderLoadingHOLoading: false,
  orderLoadingHOList: [],
};

const orderLoadingApiSlice = createSlice({
  name: "orderLoadingApi",
  initialState: orderLoadingApiState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrderLoadingHOList.pending, (state) => {
      state.orderLoadingHOLoading = true;
      state.orderLoadingHOList = [];
    });
    builder.addCase(getOrderLoadingHOList.fulfilled, (state, actions) => {
      state.orderLoadingHOLoading = false;
      state.orderLoadingHOList = actions.payload.data?.order_loading_po;
    });
    builder.addCase(getOrderLoadingHOList.rejected, (state) => {
      state.orderLoadingHOLoading = false;
      state.orderLoadingHOList = [];
    });
  },
});
export const {} = orderLoadingApiSlice.actions;
export default orderLoadingApiSlice.reducer;
