import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "@/modules/dashboard/slice";
import loginReducer from "@/modules/login/slice/loginSlice";

const reducer = combineReducers({
  dashboard: dashboardReducer,
  login: loginReducer,
});
export default reducer;
