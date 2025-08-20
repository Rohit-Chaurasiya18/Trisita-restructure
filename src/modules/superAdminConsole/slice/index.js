import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { GET_ALL_USERLIST, UPDATE_USER_PERMISSION } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const superAdminConsoleState = {
  allUserList: [],
  allUserListLoading: false,
};

export const getAllUserList = createAsyncThunk(
  `superAdminConsole/getAllUserList`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_ALL_USERLIST);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const updateUserPermission = createAsyncThunk(
  `superAdminConsole/updateUserPermission`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(UPDATE_USER_PERMISSION, payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const superAdminConsoleSlice = createSlice({
  name: "superAdminConsole",
  initialState: superAdminConsoleState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUserList.pending, (state) => {
      state.allUserList = [];
      state.allUserListLoading = true;
    });
    builder.addCase(getAllUserList.fulfilled, (state, action) => {
      state.allUserList = action.payload.data?.User;
      state.allUserListLoading = false;
    });
    builder.addCase(getAllUserList.rejected, (state) => {
      state.allUserList = [];
      state.allUserListLoading = false;
    });
  },
});
export const {} = superAdminConsoleSlice.actions;
export default superAdminConsoleSlice.reducer;
