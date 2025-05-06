import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { CHANGED_PASSWORD, PROFILE } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const profileState = {
  userDetail: "",
  profileLoader: false,
};

export const getUserProfile = createAsyncThunk(
  `profile/getProfileData`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(PROFILE + payload, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  `profile/updateUserProfile`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.put(
        PROFILE + payload?.id,
        payload?.formData
      );
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const changedPassword = createAsyncThunk(
  `profile/updateUserProfile`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(CHANGED_PASSWORD, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: profileState,
  reducers: {
    setProfileLoader: (state, action) => {
      state.profileLoader = action.payload;
    },
  },
  extraReducers: (builder) => {
    //login
    builder.addCase(getUserProfile.pending, (state) => {
      state.userDetail = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.userDetail = action?.payload?.data;
    });
    builder.addCase(getUserProfile.rejected, (state) => {
      state.userDetail = null;
    });
  },
});
export const { setProfileLoader } = profileSlice.actions;
export default profileSlice.reducer;
