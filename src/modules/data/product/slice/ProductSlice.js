import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_PRODUCT_MASTER,
  GET_PRODUCT_MASTER_CATEGORY,
  GET_PRODUCT_MASTER_GST_TYPE,
  GET_PRODUCT_MASTER_OEM,
  GET_PRODUCT_MASTER_STATUS,
  GET_PRODUCT_MASTER_UOM,
  GET_USUAGE_DATA,
} from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// getProductMasterData
export const getProductMasterData = createAsyncThunk(
  `product/getProductMasterData`,
  async (payload, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      let url = GET_PRODUCT_MASTER;
      if (payload?.status) {
        params.append("status", encodeURIComponent(payload?.status));
        url = url + `?${params?.toString()}`;
      }
      const response = await axiosReact.get(url);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// getProductMasterCategory
export const getProductMasterCategory = createAsyncThunk(
  `product/getProductMasterCategory`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_PRODUCT_MASTER_CATEGORY);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// getProductMasterGst
export const getProductMasterGst = createAsyncThunk(
  `product/getProductMasterGst`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_PRODUCT_MASTER_GST_TYPE);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// getProductMasterOEM
export const getProductMasterOEM = createAsyncThunk(
  `product/getProductMasterOEM`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_PRODUCT_MASTER_OEM);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// getProductMasterStatus
export const getProductMasterStatus = createAsyncThunk(
  `product/getProductMasterStatus`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_PRODUCT_MASTER_STATUS);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

// getProductMasterUOM
export const getProductMasterUOM = createAsyncThunk(
  `product/getProductMasterUOM`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_PRODUCT_MASTER_UOM);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const ProductState = {
  productMasterData: [],
  productMasterDataLoading: false,
  productMasterCategory: [],
  productMasterGst: [],
  productMasterOEM: [],
  productMasterStatus: [],
  productMasterUOM: [],
};

const productSlice = createSlice({
  name: "product",
  initialState: ProductState,
  reducers: {},
  extraReducers: (builder) => {
    // getProductMasterData
    builder.addCase(getProductMasterData.pending, (state) => {
      state.productMasterData = [];
      state.productMasterDataLoading = true;
    });
    builder.addCase(getProductMasterData.fulfilled, (state, action) => {
      state.productMasterData = action.payload.data?.product_master;
      state.productMasterDataLoading = false;
    });
    builder.addCase(getProductMasterData.rejected, (state, action) => {
      state.productMasterData = [];
      state.productMasterDataLoading = false;
    });

    // getProductMasterCategory
    builder.addCase(getProductMasterCategory.pending, (state) => {
      state.productMasterCategory = [];
    });
    builder.addCase(getProductMasterCategory.fulfilled, (state, action) => {
      state.productMasterCategory = action.payload.data;
    });
    builder.addCase(getProductMasterCategory.rejected, (state) => {
      state.productMasterCategory = [];
    });

    // getProductMasterGst
    builder.addCase(getProductMasterGst.pending, (state) => {
      state.productMasterGst = [];
    });
    builder.addCase(getProductMasterGst.fulfilled, (state, action) => {
      state.productMasterGst = action.payload.data;
    });
    builder.addCase(getProductMasterGst.rejected, (state) => {
      state.productMasterGst = [];
    });

    // getProductMasterOEM
    builder.addCase(getProductMasterOEM.pending, (state) => {
      state.productMasterOEM = [];
    });
    builder.addCase(getProductMasterOEM.fulfilled, (state, action) => {
      state.productMasterOEM = action.payload.data;
    });
    builder.addCase(getProductMasterOEM.rejected, (state) => {
      state.productMasterOEM = [];
    });

    // getProductMasterStatus
    builder.addCase(getProductMasterStatus.pending, (state) => {
      state.productMasterStatus = [];
    });
    builder.addCase(getProductMasterStatus.fulfilled, (state, action) => {
      state.productMasterStatus = action.payload.data;
    });
    builder.addCase(getProductMasterStatus.rejected, (state) => {
      state.productMasterStatus = [];
    });

    // getProductMasterUOM
    builder.addCase(getProductMasterUOM.pending, (state) => {
      state.productMasterUOM = [];
    });
    builder.addCase(getProductMasterUOM.fulfilled, (state, action) => {
      state.productMasterUOM = action.payload.data;
    });
    builder.addCase(getProductMasterUOM.rejected, (state) => {
      state.productMasterUOM = [];
    });
  },
});

export const {} = productSlice.actions;
export default productSlice.reducer;
