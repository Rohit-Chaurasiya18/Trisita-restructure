import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "@/modules/dashboard/slice";
import loginReducer from "@/modules/login/slice/loginSlice";
import profileReducer from "@/modules/profile/slice/profileSlice";
import layoutReducer from "@/layout/slice/layoutSlice";
import insightMetricsReducer from "@/modules/insightMetrics/slice/insightMetrics";

const reducer = combineReducers({
  dashboard: dashboardReducer,
  login: loginReducer,
  profile: profileReducer,
  layout: layoutReducer,
  insightMetrics: insightMetricsReducer,
});
export default reducer;
