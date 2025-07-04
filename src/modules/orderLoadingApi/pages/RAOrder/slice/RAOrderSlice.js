import { axiosReact } from "@/services/api";
import { GET_RA_ORDER } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getRaOrderData = createAsyncThunk(
  `RaOrder/getRaOrderData`,
  async (payload, thunkAPI) => {
    try {
      let url = GET_RA_ORDER;
      if (payload?.id) {
        url = url + `${payload?.id}`;
      }
      const response = await axiosReact.post(url, {
        from_date: payload?.from_date,
        to_date: payload?.to_date,
      });
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const RaOrderState = {
  raOrderListLoading: false,
  raOrderList: [],
};

const RaOrderSlice = createSlice({
  name: "RaOrder",
  initialState: RaOrderState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRaOrderData.pending, (state) => {
      state.raOrderList = [];
      state.raOrderListLoading = true;
    });
    builder.addCase(getRaOrderData.fulfilled, (state, action) => {
      state.raOrderList = action.payload.data?.map((item) => ({
        ...item,
        bd_person: item?.bd_person_first_names
          ? item?.bd_person_first_names?.join(", ")
          : "",
        renewal_person: item?.renewal_person_first_names
          ? item?.renewal_person_first_names?.join(", ")
          : "",
      }));
      state.raOrderListLoading = false;
    });
    builder.addCase(getRaOrderData.rejected, (state) => {
      state.raOrderList = [];
      state.raOrderListLoading = false;
    });
  },
});

export const {} = RaOrderSlice.actions;
export default RaOrderSlice.reducer;
