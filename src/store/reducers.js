import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "@/modules/dashboard/slice";
import loginReducer from "@/modules/login/slice/loginSlice";
import profileReducer from "@/modules/profile/slice/profileSlice";
import notificationsReducer from "@/modules/notification/slice/notificationsSlice";
import layoutReducer from "@/layout/slice/layoutSlice";
import insightMetricsReducer from "@/modules/insightMetrics/slice/insightMetricsSlice";
import insightMetricsReducerV2 from "@/modules/insightMetricsV2/slice/insightMetricsV2Slice";
import alertSubscriptionReducer from "@/modules/alertSubscription/slice/alertSubscription";
import accountReducer from "@/modules/accounts/slice/accountSlice";
import quotationReducer from "@/modules/quotations/slice/quotationSlice";
import opportunityReducer from "@/modules/opportunity/slice/opportunitySlice";
import usugesReducer from "@/modules/getUsage/slice/UsuagesSlice";
import subscriptionReducer from "@/modules/subscription/slice/subscriptionSlice";
import productReducer from "@/modules/data/product/slice/ProductSlice";
import manageTemplateReducer from "@/modules/data/manageTemplate/slice/ManageTemplateSlice";
import uploadReducer from "@/modules/data/upload/slice/UploadSlice";
import orderLoadingApiReducer from "@/modules/orderLoadingApi/slice/OrderLoadingApiSlice";
import RaOrderReducer from "@/modules/orderLoadingApi/pages/RAOrder/slice/RAOrderSlice";

const reducer = combineReducers({
  dashboard: dashboardReducer,
  login: loginReducer,
  profile: profileReducer,
  notifications: notificationsReducer,
  layout: layoutReducer,
  insightMetrics: insightMetricsReducer,
  insightMetricsV2: insightMetricsReducerV2,
  alertSubscription: alertSubscriptionReducer,
  account: accountReducer,
  quotation: quotationReducer,
  opportunity: opportunityReducer,
  usuages: usugesReducer,
  subscription: subscriptionReducer,
  product: productReducer,
  manageTemplate: manageTemplateReducer,
  upload: uploadReducer,
  orderLoadingApi: orderLoadingApiReducer,
  RaOrder: RaOrderReducer,
});
export default reducer;
