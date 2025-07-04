import routesConstants from "./routesConstants";
import {
  _404,
  Dashboard,
  Login,
  Insight_metrics,
  Insight_metrics_v2,
  Alert_subscription,
  Get_usage,
  Usuage,
  Profile,
  ChangePassword,
  Account,
  AddAccount,
  Quotations,
  AddQuotation,
  Opportunity,
  Subscription,
  NewSubscription,
  DeletedSubscription,
  ChangeLogSubscription,
  CompareSubscription,
  UniqueUserCount,
  ProductMaster,
  Product,
  AddUpdateProductMaster,
  Notifications,
  AddUpdateProduct,
  orderLoadingToHO,
  AddEditOrderLoadingHO,
  ManageTemplate,
  ManageTeams,
  Upload,
  UploadBulk,
  PaymentsOverdue,
  PaymentsOutstanding,
  InvoicePending,
  RenewalEmailSent,
  OrderLoadingHOListing,
} from "./routeImports";
import { Outlet } from "react-router-dom";

const routesConfig = {
  common: [{ path: routesConstants._404, component: _404 }],
  private: [
    {
      path: routesConstants.DASHBOARD,
      component: Outlet,
      children: [
        { index: true, component: Dashboard },
        { path: "payments_overdue", component: PaymentsOverdue },
        { path: "payments_outstanding", component: PaymentsOutstanding },
        { path: "invoice_pending", component: InvoicePending },
        { path: "renewal_email_sent", component: RenewalEmailSent },
      ],
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
      component: Outlet,
      children: [
        { index: true, component: Get_usage },
        { path: "usage/:csn/:from_date/:to_date", component: Usuage },
        {
          path: "usage_user_count/:csn/:from_date/:to_date",
          component: UniqueUserCount,
        },
      ],
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
      path: routesConstants.UPDATE_ACCOUNT + `/:id`,
      component: AddAccount,
    },
    {
      path: routesConstants.THIRD_PARTY_ACCOUNT,
      component: Account,
    },
    {
      path: routesConstants.OPPORTUNITY,
      component: Opportunity,
    },
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
      component: NewSubscription,
    },
    {
      path: routesConstants.DELETED_SUBSCRIPTION,
      component: DeletedSubscription,
    },
    {
      path: routesConstants.CHANGED_LOG_SUBSCRIPTION,
      component: ChangeLogSubscription,
    },
    {
      path: routesConstants.SUBSCRIPTION_DATA_COMPARISON,
      component: CompareSubscription,
    },
    {
      path: routesConstants.ORDER_LOADING_PO,
      component: Outlet,
      children: [
        { index: true, component: orderLoadingToHO },
        { path: "add_order_loading_po", component: AddEditOrderLoadingHO },
        {
          path: "update_order_loading_po/:orderLoadingHoId",
          component: AddEditOrderLoadingHO,
        },
        { path: "order_loading_po_list", component: OrderLoadingHOListing },
      ],
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
      path: routesConstants.MANAGE_TEAM,
      component: ManageTeams,
    },
    {
      path: routesConstants.MANAGE_TEMPLATE,
      component: ManageTemplate,
    },
    {
      path: routesConstants.UPLOAD,
      component: Outlet,
      children: [
        {
          index: true,
          component: Upload,
        },
        {
          path: "upload_bulk",
          component: UploadBulk,
        },
      ],
    },
    {
      path: routesConstants.EXPORTED_FILE,
      component: Get_usage,
    },
    {
      path: routesConstants.PRODUCT_MASTER,
      component: Outlet,
      children: [
        { index: true, component: ProductMaster },
        { path: "add_product_master", component: AddUpdateProductMaster },
        {
          path: "update_product_master/:productMasterId",
          component: AddUpdateProductMaster,
        },
      ],
    },
    {
      path: routesConstants.PRODUCT,
      component: Outlet,
      children: [
        { index: true, component: Product },
        { path: "add_product", component: AddUpdateProduct },
      ],
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
    {
      path: routesConstants?.NOTIFICATIONS,
      component: Notifications,
    },
  ],
  public: [{ path: routesConstants?.LOGIN, component: Login }],
};

export default routesConfig;
