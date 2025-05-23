import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "@/modules/dashboard/slice";
import loginReducer from "@/modules/login/slice/loginSlice";
import profileReducer from "@/modules/profile/slice/profileSlice";
import layoutReducer from "@/layout/slice/layoutSlice";
import insightMetricsReducer from "@/modules/insightMetrics/slice/insightMetricsSlice";
import alertSubscriptionReducer from "@/modules/alertSubscription/slice/alertSubscription";
import accountReducer from "@/modules/accounts/slice/accountSlice";
import quotationReducer from "@/modules/quotations/slice/quotationSlice";
import opportunityReducer from "@/modules/opportunity/slice/opportunitySlice";
const reducer = combineReducers({
  dashboard: dashboardReducer,
  login: loginReducer,
  profile: profileReducer,
  layout: layoutReducer,
  insightMetrics: insightMetricsReducer,
  alertSubscription: alertSubscriptionReducer,
  account: accountReducer,
  quotation: quotationReducer,
  opportunity: opportunityReducer,
});
export default reducer;
