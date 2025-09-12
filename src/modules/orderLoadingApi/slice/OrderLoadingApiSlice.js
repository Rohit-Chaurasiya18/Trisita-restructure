import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  ACTIVE_PRODUCT_MASTER,
  GET_ACCOUNT_BY_BD_PERSON,
  GET_BD_PERSON_BY_BRANCH,
  GET_ORDER_LOADING_HO,
  GET_ORDER_LOADING_HO_LISTING,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getOrderLoadingHOList = createAsyncThunk(
  `orderLoadingApi/getOrderLoadingHOList`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ORDER_LOADING_HO_LISTING);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const getBdPersonByBranch = createAsyncThunk(
  `orderLoadingApi/getBdPersonByBranch`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_BD_PERSON_BY_BRANCH + payload?.value + "/" + payload?.orderType
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getAccountByBdPerson = createAsyncThunk(
  `orderLoadingApi/getAccountByBdPerson`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(
        GET_ACCOUNT_BY_BD_PERSON + payload?.value + "/" + payload?.orderType
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getActiveProductMaster = createAsyncThunk(
  `orderLoadingApi/getActiveProductMaster`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(ACTIVE_PRODUCT_MASTER);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const addOrderLoadingHO = createAsyncThunk(
  `orderLoadingApi/addOrderLoadingHO`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(GET_ORDER_LOADING_HO, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const updateOrderLoadingHO = createAsyncThunk(
  `orderLoadingApi/updateOrderLoadingHO`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.put(
        GET_ORDER_LOADING_HO + `${payload?.id}/`,
        payload?.formData
      );
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
  bdPersonByBranchLoading: false,
  bdPersonByBranch: [],
  stateCode: null,
  accountByBdPersonLoading: false,
  accountByBdPerson: [],
  thirdPartyAccountByBdPersonLoading: false,
  thirdPartyAccountByBdPerson: [],
  activeProductMasterLoading: false,
  activeProductMaster: [],
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
    //
    builder.addCase(getBdPersonByBranch.pending, (state) => {
      state.bdPersonByBranchLoading = true;
      state.bdPersonByBranch = [];
      state.stateCode = null;
    });
    builder.addCase(getBdPersonByBranch.fulfilled, (state, actions) => {
      state.bdPersonByBranchLoading = false;
      state.bdPersonByBranch = actions.payload.data?.bd_person?.map((item) => ({
        label: item?.first_name + " " + item?.last_name,
        value: item?.id,
      }));
      state.stateCode = actions.payload.data?.state_code;
    });
    builder.addCase(getBdPersonByBranch.rejected, (state) => {
      state.bdPersonByBranchLoading = false;
      state.bdPersonByBranch = [];
      state.stateCode = null;
    });
    //
    builder.addCase(getAccountByBdPerson.pending, (state) => {
      state.accountByBdPersonLoading = true;
      state.accountByBdPerson = [];
      state.thirdPartyAccountByBdPersonLoading = true;
      state.thirdPartyAccountByBdPerson = [];
    });
    builder.addCase(getAccountByBdPerson.fulfilled, (state, actions) => {
      state.accountByBdPersonLoading = false;
      state.accountByBdPerson = actions.payload.data?.accounts?.map((item) => ({
        label: `${item?.name} (${item?.csn})`,
        value: item?.id,
      }));
      state.thirdPartyAccountByBdPersonLoading = false;
      state.thirdPartyAccountByBdPerson =
        actions.payload.data?.third_party_acccounts?.map((item) => ({
          label: `${item?.name} (${item?.csn})`,
          value: item?.id,
        }));
    });
    builder.addCase(getAccountByBdPerson.rejected, (state) => {
      state.accountByBdPersonLoading = false;
      state.accountByBdPerson = [];
      state.thirdPartyAccountByBdPersonLoading = false;
      state.thirdPartyAccountByBdPerson = [];
    });
    //
    builder.addCase(getActiveProductMaster.pending, (state) => {
      state.activeProductMasterLoading = true;
      state.activeProductMaster = [];
    });
    builder.addCase(getActiveProductMaster.fulfilled, (state, actions) => {
      state.activeProductMasterLoading = false;
      state.activeProductMaster = actions.payload.data?.product_master?.map(
        (item) => ({
          label: item?.name,
          value: item?.id,
        })
      );
    });
    builder.addCase(getActiveProductMaster.rejected, (state) => {
      state.activeProductMasterLoading = false;
      state.activeProductMaster = [];
    });
  },
});
export const {} = orderLoadingApiSlice.actions;
export default orderLoadingApiSlice.reducer;
