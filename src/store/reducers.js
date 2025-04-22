import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "@/modules/dashboard/slice";
import loginReducer from "@/modules/login/slice/loginSlice";
import profileReducer from "@/modules/profile/slice/profileSlice";
import layoutReducer from "@/layout/slice/layoutSlice";

const reducer = combineReducers({
  dashboard: dashboardReducer,
  login: loginReducer,
  profile: profileReducer,
  layout: layoutReducer,
});
export default reducer;
