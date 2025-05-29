import { lazy } from "react";
export const Dashboard = lazy(() => import("@/modules/dashboard/pages"));
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
export const _404 = lazy(() => import("@/components/common/_404"));
export const Login = lazy(() => import("@/modules/login/pages"));
export const Profile = lazy(() => import("@/modules/profile/index"));
export const ChangePassword = lazy(() =>
  import("@/modules/profile/components/ChangePassword")
);
