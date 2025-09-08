import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { GET_LEARNING_LAB, INSIGHT_METRICS_CUSTOMER_V2 } from "@/services/url";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getLearningLab = createAsyncThunk(
  `knowledgePortal/getLearningLab`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_LEARNING_LAB);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
export const viewLearningLab = createAsyncThunk(
  `knowledgePortal/viewLearningLab`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_LEARNING_LAB + `${payload}/`);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.detail || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);
const knowledgePortalState = {
  learningLabList: [],
  learningLabListLoading: false,
  learningLabDetail: null,
  learningLabDetailLoading: false,
};

const knowledgePortalSlice = createSlice({
  name: "knowledgePortal",
  initialState: knowledgePortalState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLearningLab.pending, (state, action) => {
      state.learningLabList = [];
      state.learningLabListLoading = true;
    });

    builder.addCase(getLearningLab.fulfilled, (state, action) => {
      state.learningLabList = action.payload.data;
      state.learningLabListLoading = false;
    });

    builder.addCase(getLearningLab.rejected, (state, action) => {
      state.learningLabList = [];
      state.learningLabListLoading = false;
    });

    builder.addCase(viewLearningLab.pending, (state, action) => {
      state.learningLabDetail = null;
      state.learningLabDetailLoading = true;
    });

    builder.addCase(viewLearningLab.fulfilled, (state, action) => {
      state.learningLabDetail = action.payload.data;
      state.learningLabDetailLoading = false;
    });

    builder.addCase(viewLearningLab.rejected, (state, action) => {
      state.learningLabDetail = [];
      state.learningLabDetailLoading = false;
    });
  },
});

export const {} = knowledgePortalSlice.actions;
export default knowledgePortalSlice.reducer;
