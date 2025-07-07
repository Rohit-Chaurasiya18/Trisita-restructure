import { axiosReact } from "@/services/api";
import { GET_CONTACT_INFORMATION, GET_RA_ORDER } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getContactInformation = createAsyncThunk(
  `ContactInformation/getContactInformation`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_CONTACT_INFORMATION + payload);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const ContactInformationState = {
  ContactInformationLoading: false,
  ContactInformationList: [],
};

const ContactInformationSlice = createSlice({
  name: "ContactInformation",
  initialState: ContactInformationState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContactInformation.pending, (state) => {
      state.ContactInformationList = [];
      state.ContactInformationLoading = true;
    });
    builder.addCase(getContactInformation.fulfilled, (state, action) => {
      state.ContactInformationList = action.payload.data;
      state.ContactInformationLoading = false;
    });
    builder.addCase(getContactInformation.rejected, (state) => {
      state.ContactInformationList = [];
      state.ContactInformationLoading = false;
    });
  },
});

export const {} = ContactInformationSlice.actions;
export default ContactInformationSlice.reducer;
