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
import quotationReducer from "@/modules/newQuotation/slice/quotationSlice";
import opportunityReducer from "@/modules/opportunity/slice/opportunitySlice";
import usugesReducer from "@/modules/getUsage/slice/UsuagesSlice";
import subscriptionReducer from "@/modules/subscription/slice/subscriptionSlice";
import productReducer from "@/modules/data/product/slice/ProductSlice";
import manageTemplateReducer from "@/modules/data/manageTemplate/slice/ManageTemplateSlice";
import uploadReducer from "@/modules/data/upload/slice/UploadSlice";
import orderLoadingApiReducer from "@/modules/orderLoadingApi/slice/OrderLoadingApiSlice";
import RaOrderReducer from "@/modules/orderLoadingApi/pages/RAOrder/slice/RAOrderSlice";
import ContactInformationReducer from "@/modules/data/contactInformation/slice/ContactInfoSlice";
import LicenseOptimizationReducer from "@/modules/licenseOptimization/slice/LicenseOptimizationSlice";
import CampaignReducer from "@/modules/data/campaign/slice/CampaignSlice";
import superAdminConsoleReducer from "@/modules/superAdminConsole/slice/index";
import pagesReducer from "@/modules/pages/slice/index";
import knowledgePortalReducer from "@/modules/knowledgePortal/slice/index";

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
  ContactInformation: ContactInformationReducer,
  LicenseOptimization: LicenseOptimizationReducer,
  Campaign: CampaignReducer,
  superAdminConsole: superAdminConsoleReducer,
  pages: pagesReducer,
  knowledgePortal: knowledgePortalReducer,
});
export default reducer;
