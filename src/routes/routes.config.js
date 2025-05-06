import routesConstants from "./routesConstants";
import {
  _404,
  Dashboard,
  Login,
  Insight_metrics,
  Insight_metrics_v2,
  Alert_subscription,
  Get_usage,
  Profile,
  ChangePassword,
  Account,
  AddAccount,
  Quotations,
  AddQuotation,
  Subscription
} from "./routeImports";
import { Outlet } from "react-router-dom";

const routesConfig = {
  common: [{ path: routesConstants._404, component: _404 }],
  private: [
    {
      path: routesConstants.DASHBOARD,
      component: Dashboard,
    },
    {
      path: routesConstants.INSIGHT_METRICS,
      component: Insight_metrics,
    },
    {
      path: routesConstants.INSIGHT_METRICS_V2,
      component: Insight_metrics_v2,
    },
    {
      path: routesConstants.ALERT_SUBSCRIPTION,
      component: Alert_subscription,
    },
    {
      path: routesConstants.GET_USAGE,
      component: Get_usage,
    },
    {
      path: routesConstants.ACCOUNT,
      component: Account,
    },
    {
      path: routesConstants.ADD_ACCOUNT,
      component: AddAccount,
    },
    {
      path: routesConstants.THIRD_PARTY_ACCOUNT,
      component: Account,
    },
    {
      path: routesConstants.OPPORTUNITY,
      component: Get_usage,
    },
    // {
    //   path: routesConstants.QUOTATION,
    //   component: Quotations,
    // },
    {
      path: routesConstants.QUOTATION,
      component: Outlet,
      children: [
        { index: true, component: Quotations },
        { path: "add_quotation", component: AddQuotation },
      ],
    },
    {
      path: routesConstants.SUBSCRIPTION,
      component: Subscription,
    },
    {
      path: routesConstants.NEW_SUBSCRIPTION,
      component: Get_usage,
    },
    {
      path: routesConstants.DELETED_SUBSCRIPTION,
      component: Get_usage,
    },
    {
      path: routesConstants.CHANGED_LOG_SUBSCRIPTION,
      component: Get_usage,
    },
    {
      path: routesConstants.SUBSCRIPTION_DATA_COMPARISON,
      component: Get_usage,
    },
    {
      path: routesConstants.ORDER_LOADING_PO,
      component: Get_usage,
    },
    {
      path: routesConstants.ORDER_LOADING_DISTRIBUTOR,
      component: Get_usage,
    },
    {
      path: routesConstants.RA_ORDER,
      component: Get_usage,
    },
    {
      path: routesConstants.EXPORTED_FILE,
      component: Get_usage,
    },
    {
      path: routesConstants.PRODUCT_MASTER,
      component: Get_usage,
    },
    {
      path: routesConstants.PRODUCT,
      component: Get_usage,
    },
    {
      path: routesConstants.RUN_CAMPAIGN,
      component: Get_usage,
    },
    {
      path: routesConstants.CAMPAIGN_HISTORY,
      component: Get_usage,
    },
    {
      path: routesConstants.CAMPAIGN_HISTORY,
      component: Get_usage,
    },
    {
      path: routesConstants.CONTACT_INFORMATION,
      component: Get_usage,
    },
    {
      path: routesConstants.RENEW_HISTORY,
      component: Get_usage,
    },
    {
      path: routesConstants.PROFILE_FORM,
      component: Get_usage,
    },
    {
      path: routesConstants.CALENDAR,
      component: Get_usage,
    },
    {
      path: routesConstants.FAQ,
      component: Get_usage,
    },
    {
      path: routesConstants.PROFILE + `/:id`,
      component: Profile,
    },
    {
      path: routesConstants?.CHANGE_PASSWORD,
      component: ChangePassword,
    },
  ],
  public: [{ path: routesConstants?.LOGIN, component: Login }],
};

export default routesConfig;
