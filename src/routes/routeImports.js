import { lazy } from "react";
export const Dashboard = lazy(() => import("@/modules/dashboard/pages/index"));
export const PaymentsOverdue = lazy(() =>
  import("@/modules/dashboard/pages/PaymentOverdue")
);
export const PaymentsOutstanding = lazy(() =>
  import("@/modules/dashboard/pages/PaymentOutstanding")
);
export const InvoicePending = lazy(() =>
  import("@/modules/dashboard/pages/InvoicePending")
);
export const RenewalEmailSent = lazy(() =>
  import("@/modules/dashboard/pages/RenewalEmailSent")
);
export const Insight_metrics = lazy(() =>
  import("@/modules/insightMetrics/pages/index")
);
export const Insight_metrics_v2 = lazy(() =>
  import("@/modules/insightMetricsV2/pages/index")
);
export const Alert_subscription = lazy(() =>
  import("@/modules/alertSubscription/pages/index")
);
export const Get_usage = lazy(() => import("@/modules/getUsage/pages/index"));
export const Usuage = lazy(() => import("@/modules/getUsage/pages/Usuage"));
export const UniqueUserCount = lazy(() =>
  import("@/modules/getUsage/pages/UniqueUserCount")
);

export const Account = lazy(() => import("@/modules/accounts/pages/index"));
export const AddAccount = lazy(() =>
  import("@/modules/accounts/pages/addAccount/pages/index")
);
export const Quotations = lazy(() =>
  import("@/modules/quotations/pages/index")
);
export const AddQuotation = lazy(() =>
  import("@/modules/quotations/pages/AddQuotation")
);
export const Opportunity = lazy(() =>
  import("@/modules/opportunity/pages/index")
);
export const Subscription = lazy(() =>
  import("@/modules/subscription/pages/index")
);
export const NewSubscription = lazy(() =>
  import("@/modules/subscription/pages/NewSubscription")
);
export const DeletedSubscription = lazy(() =>
  import("@/modules/subscription/pages/DeletedSubscription")
);
export const ChangeLogSubscription = lazy(() =>
  import("@/modules/subscription/pages/ChangeLogSubscription")
);
export const CompareSubscription = lazy(() =>
  import("@/modules/subscription/pages/CompareSubscription")
);
export const ManageTeams = lazy(() =>
  import("@/modules/data/manageTeams/pages/index")
);
export const ManageTemplate = lazy(() =>
  import("@/modules/data/manageTemplate/pages/index")
);
export const Product = lazy(() =>
  import("@/modules/data/product/pages/Product")
);
export const ProductMaster = lazy(() =>
  import("@/modules/data/product/pages/ProductMaster")
);
export const AddUpdateProductMaster = lazy(() =>
  import("@/modules/data/product/pages/AddUpdateProductMaster")
);
export const AddUpdateProduct = lazy(() =>
  import("@/modules/data/product/pages/AddUpdateProduct")
);
export const Upload = lazy(() => import("@/modules/data/upload/pages/index"));

export const UploadBulk = lazy(() =>
  import("@/modules/data/upload/pages/UploadBulk")
);

export const orderLoadingToHO = lazy(() =>
  import("@/modules/orderLoadingApi/pages/orderLoadingHO/pages/OrderLoadingHO")
);

export const OrderLoadingHOListing = lazy(() =>
  import(
    "@/modules/orderLoadingApi/pages/orderLoadingHO/pages/OrderLoadingHOListing"
  )
);

export const AddEditOrderLoadingHO = lazy(() =>
  import(
    "@/modules/orderLoadingApi/pages/orderLoadingHO/pages/AddEditOrderLoadingHO"
  )
);

export const OrderLoadingDistributor = lazy(() =>
  import("@/modules/orderLoadingApi/pages/orderLoadingDistributor/pages/index")
);
export const _404 = lazy(() => import("@/components/common/_404"));
export const Login = lazy(() => import("@/modules/login/pages"));
export const Profile = lazy(() => import("@/modules/profile/index"));
export const Notifications = lazy(() =>
  import("@/modules/notification/pages/index")
);
export const ChangePassword = lazy(() =>
  import("@/modules/profile/components/ChangePassword")
);
