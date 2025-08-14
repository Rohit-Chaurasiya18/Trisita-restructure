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
  OrderLoadingDistributor,
  RAOrder,
  License_optization,
  ContactInformation,
  AddEditNewQuotaion,
  License_Optimisation_View,
  NewQuotaion,
  NewOpportunity,
  AddNewOpportunity,
  CampaignHistory,
  RunCampaign,
  SelectCampaignAudience,
  FinalCampaign,
  ExportedFile,
  DownloadHistory,
  UploadHistory,
  ComingSoon,
  RenewalDue,
  BackupOperation,
} from "./routeImports";
import { Outlet } from "react-router-dom";
import { userType } from "@/constants";

const routesConfig = {
  common: [{ path: routesConstants._404, component: _404 }],
  private: [
    {
      path: routesConstants.DASHBOARD,
      component: Outlet,
      roles: [userType.superadmin, userType.client],
      children: [
        {
          index: true,
          component: Dashboard,
          roles: [userType.superadmin, userType.client],
        },
        {
          path: "payments_overdue",
          component: PaymentsOverdue,
          roles: [userType.superadmin],
        },
        {
          path: "payments_outstanding",
          component: PaymentsOutstanding,
          roles: [userType.superadmin],
        },
        {
          path: "invoice_pending",
          component: InvoicePending,
          roles: [userType.superadmin],
        },
      ],
    },
    {
      path: routesConstants.RENEW_DUE,
      component: RenewalDue,
      roles: [userType.client],
    },
    {
      path: routesConstants.INSIGHT_METRICS,
      component: Insight_metrics,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants.INSIGHT_METRICS_V2,
      component: Insight_metrics_v2,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants.ALERT_SUBSCRIPTION,
      component: Alert_subscription,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.GET_USAGE,
      component: Outlet,
      roles: [userType.superadmin, userType.client],
      children: [
        {
          index: true,
          component: Get_usage,
          roles: [userType.superadmin, userType.client],
        },
        {
          path: "usage/:csn/:from_date/:to_date",
          component: Usuage,
          roles: [userType.superadmin, userType.client],
        },
        {
          path: "usage_user_count/:csn/:from_date/:to_date",
          component: UniqueUserCount,
          roles: [userType.superadmin, userType.client],
        },
      ],
    },
    {
      path: routesConstants?.LICENSE_OPTIMIZATION,
      component: Outlet,
      roles: [userType.superadmin, userType.client],
      children: [
        {
          index: true,
          component: License_optization,
          roles: [userType.superadmin, userType.client],
        },
        {
          path: "view_license_optimization/:accountId/:branchId/:productId/:startDate/:endDate",
          component: License_Optimisation_View,
          roles: [userType.superadmin, userType.client],
        },
      ],
    },
    {
      path: routesConstants.ACCOUNT,
      component: Account,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants.ADD_ACCOUNT,
      component: AddAccount,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.UPDATE_ACCOUNT + `/:id`,
      component: AddAccount,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.THIRD_PARTY_ACCOUNT,
      component: Account,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.OPPORTUNITY,
      component: Opportunity,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.NEW_OPPORTUNITY,
      component: Outlet,
      roles: [userType.superadmin],
      children: [
        {
          index: true,
          component: NewOpportunity,
          roles: [userType.superadmin],
        },
        {
          path: "add_new_opportunity",
          component: AddNewOpportunity,
          roles: [userType.superadmin],
        },
        {
          path: ":opportunityId",
          component: AddNewOpportunity,
          roles: [userType.superadmin],
        },
      ],
    },
    {
      path: routesConstants.NEW_QUOTATION,
      component: Outlet,
      roles: [userType.superadmin],
      children: [
        { index: true, component: NewQuotaion, roles: [userType.superadmin] },
        {
          path: "add_new_quotation",
          component: AddEditNewQuotaion,
          roles: [userType.superadmin],
        },
        {
          path: ":quotationId",
          component: AddEditNewQuotaion,
          roles: [userType.superadmin],
        },
      ],
    },

    {
      path: routesConstants.SUBSCRIPTION,
      component: Subscription,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants.NEW_SUBSCRIPTION,
      component: NewSubscription,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants.DELETED_SUBSCRIPTION,
      component: DeletedSubscription,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants.CHANGED_LOG_SUBSCRIPTION,
      component: ChangeLogSubscription,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.SUBSCRIPTION_DATA_COMPARISON,
      component: CompareSubscription,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.ORDER_LOADING_PO,
      component: Outlet,
      roles: [userType.superadmin],
      children: [
        {
          index: true,
          component: orderLoadingToHO,
          roles: [userType.superadmin],
        },
        {
          path: "add_order_loading_po",
          component: AddEditOrderLoadingHO,
          roles: [userType.superadmin],
        },
        {
          path: "update_order_loading_po/:orderLoadingHoId",
          component: AddEditOrderLoadingHO,
          roles: [userType.superadmin],
        },
        {
          path: "order_loading_po_list",
          component: OrderLoadingHOListing,
          roles: [userType.superadmin],
        },
      ],
    },
    {
      path: routesConstants.ORDER_LOADING_DISTRIBUTOR,
      component: OrderLoadingDistributor,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.RA_ORDER,
      component: RAOrder,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.MANAGE_TEAM,
      component: ManageTeams,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.MANAGE_TEMPLATE,
      component: ManageTemplate,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.DOWNLOAD_HISTORY,
      component: DownloadHistory,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.UPLOAD,
      component: Outlet,
      roles: [userType.superadmin],
      children: [
        {
          index: true,
          component: Upload,
          roles: [userType.superadmin],
        },
        {
          path: "upload_bulk",
          component: UploadBulk,
          roles: [userType.superadmin],
        },
      ],
    },
    {
      path: routesConstants.UPLOAD_HISTORY,
      component: UploadHistory,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.EXPORTED_FILE,
      component: ExportedFile,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.PRODUCT_MASTER,
      component: Outlet,
      roles: [userType.superadmin],
      children: [
        { index: true, component: ProductMaster, roles: [userType.superadmin] },
        {
          path: "add_product_master",
          component: AddUpdateProductMaster,
          roles: [userType.superadmin],
        },
        {
          path: "update_product_master/:productMasterId",
          component: AddUpdateProductMaster,
          roles: [userType.superadmin],
        },
      ],
    },
    {
      path: routesConstants.PRODUCT,
      component: Outlet,
      roles: [userType.superadmin],
      children: [
        { index: true, component: Product, roles: [userType.superadmin] },
        {
          path: "add_product",
          component: AddUpdateProduct,
          roles: [userType.superadmin],
        },
      ],
    },
    {
      path: routesConstants.RUN_CAMPAIGN,
      component: RunCampaign,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants?.CAMPAIGN_AUDIENCE,
      component: SelectCampaignAudience,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants?.FINAL_CAMPAIGN,
      component: FinalCampaign,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.CAMPAIGN_HISTORY,
      component: CampaignHistory,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.CONTACT_INFORMATION,
      component: ContactInformation,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.RENEW_HISTORY,
      component: RenewalEmailSent,
      roles: [userType.superadmin],
    },
    {
      path: routesConstants.LEARNING_LAB,
      component: ComingSoon,
      roles: [userType.client],
    },
    {
      path: routesConstants.PRODUCT_KNOWLEDGE,
      component: ComingSoon,
      roles: [userType.client],
    },
    {
      path: routesConstants.TRAINING_SESSION,
      component: ComingSoon,
      roles: [userType.client],
    },
    // {
    //   path: routesConstants.PROFILE_FORM,
    //   component: Get_usage,
    //   roles: [userType.superadmin, userType.client],
    // },
    {
      path: routesConstants.GENERATE_TICKET,
      component: ComingSoon,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants.CALENDAR,
      component: ComingSoon,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants.FAQ,
      component: ComingSoon,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants.PROFILE + `/:id`,
      component: Profile,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants?.CHANGE_PASSWORD,
      component: ChangePassword,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants?.NOTIFICATIONS,
      component: Notifications,
      roles: [userType.superadmin, userType.client],
    },
    {
      path: routesConstants?.BACKUP_OPERATION,
      component: BackupOperation,
      roles: [userType.superadmin],
    },
  ],
  public: [{ path: routesConstants?.LOGIN, component: Login }],
};

export default routesConfig;
