import { toast } from "react-toastify";
import Cookies, { cookieKeys } from "@/services/cookies";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { LOGIN } from "@/services/url";

const token = Cookies.get(cookieKeys?.TOKEN);
const loginState = {
  isAuth: !!token,
  token: token ? token : "",
  pageLoader: false,
};

export const getLogin = createAsyncThunk(
  `authentication/LoginThunk`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(LOGIN, payload);
      if (response?.status === 200) {
        Cookies.set(cookieKeys?.USER, response?.data?.user_serializer);
        return response.data;
      }
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: loginState,
  reducers: {
    setPageLoader: (state, action) => {
      state.pageLoader = action.payload;
    },
  },
  extraReducers: (builder) => {
    //login
    builder.addCase(getLogin.pending, (state) => {
      state.loading = true;
      state.isAuth = false;
    });
    builder.addCase(getLogin.fulfilled, (state) => {
      state.loading = false;
      state.isAuth = true;
      state.token = "7f4a2c9e-8b35-4d78-b9e1-3a6f2d5c7e8f";
    });
    builder.addCase(getLogin.rejected, (state) => {
      state.loading = false;
      state.isAuth = false;
    });
  },
});
export const { setPageLoader } = loginSlice.actions;
export default loginSlice.reducer;
