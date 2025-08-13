import React, { useEffect, useState } from "react";
import StatCard from "@/components/common/chart/StartCard";
import EmailIcon from "@mui/icons-material/Email";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaymentIcon from "@mui/icons-material/Payment";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { BarChart, GeographyChart, LineChart } from "../components";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  GetCitiesMap,
  GetDashboardChart,
  GetDashboardData,
  GetSeatDateChart,
  setDashboardLoading,
} from "../slice";
import CommonButton from "@/components/common/buttons/CommonButton";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { setPageLoader } from "@/modules/login/slice/loginSlice";
import StoreMap from "../components/StoreMap";
// import MapView from "../components/MapView";
import { lazy, Suspense } from "react";
import routesConstants from "@/routes/routesConstants";
import { useNavigate } from "react-router-dom";
import { userType } from "@/constants";
const MapView = lazy(() => import("../components/MapView"));

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    filter,
    dashboardDataLoading,
    dashboardData,
    dashboardChartLoading,
    dashboardChart,
    seatDateChartLoading,
    seatDateChart,
    userDetail,
  } = useSelector((state) => ({
    filter: state?.layout?.filter,
    dashboardDataLoading: state?.dashboard?.dashboardDataLoading,
    dashboardData: state?.dashboard?.dashboardData,
    dashboardChartLoading: state?.dashboard?.dashboardChartLoading,
    dashboardChart: state?.dashboard?.dashboardChart,
    seatDateChartLoading: state?.dashboard?.seatDateChartLoading,
    seatDateChart: state?.dashboard?.seatDateChart,
    userDetail: state?.login?.userDetail,
  }));
  useEffect(() => {
    dispatch(
      GetDashboardData({ id: filter?.csn === "All CSN" ? "" : filter?.csn })
    );
    dispatch(
      GetDashboardChart({ id: filter?.csn === "All CSN" ? "" : filter?.csn })
    );
    dispatch(
      GetSeatDateChart({ id: filter?.csn === "All CSN" ? "" : filter?.csn })
    );
    dispatch(
      GetCitiesMap({ id: filter?.csn === "All CSN" ? "" : filter?.csn })
    );
  }, [filter?.csn]);

  useEffect(() => {
    if (
      !dashboardChartLoading &&
      !dashboardDataLoading &&
      !seatDateChartLoading
    ) {
      dispatch(setPageLoader(false));
    } else {
      dispatch(setPageLoader(true));
    }
  }, [dashboardChartLoading, dashboardDataLoading, seatDateChartLoading]);

  return (
    <div className="">
      <div className="dashboard-header">
        <div>
          <h3 className="mb-0 commom-header-title">Dashboard</h3>
          <span className="common-breadcrum-msg">
            Welcome to your dashboard
          </span>
        </div>
        <div className="dashboard-filter">
          <CommonButton className="download-report-btn">
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </CommonButton>
        </div>
      </div>
      {dashboardDataLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          {userDetail?.user_type === userType.client ? (
            <>
              <div className="dashboard-startCard">
                <StatCard
                  icon={EmailIcon}
                  value={dashboardData?.subscriptions_last_30_days || 0}
                  title="Renewal Due (Within 30 days)"
                  percentage={dashboardData?.renewal_percentage || 0}
                  isLink
                  path={routesConstants?.RENEW_DUE}
                />
                <StatCard
                  icon={ReceiptIcon}
                  value={dashboardData?.total_sales_invoice_amount_exc_gst || 0}
                  title="Total Annual License Amount (Exc GST)"
                  percentage={dashboardData?.sales_invoice_percentage || 0}
                />
                <StatCard
                  icon={PersonAddIcon}
                  value={dashboardData?.active_account || 0}
                  title="Active Accounts"
                  percentage={dashboardData?.active_account_percentage || 0}
                  isLink
                  handleNavigate={() => {
                    dispatch(setDashboardLoading("Active"));
                    navigate(routesConstants?.ACCOUNT);
                  }}
                />
                <StatCard
                  icon={PersonOffIcon}
                  value={dashboardData?.inactive_account || 0}
                  title="Inactive Accounts"
                  percentage={dashboardData?.expired_account_percentage || 0}
                  isLink
                  handleNavigate={() => {
                    dispatch(setDashboardLoading("Expired"));
                    navigate(routesConstants?.ACCOUNT);
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="dashboard-startCard">
                <StatCard
                  icon={EmailIcon}
                  value={dashboardData?.renewal_count || 0}
                  title="Renewal Email Sent"
                  percentage={dashboardData?.renewal_percentage || 0}
                  isLink
                  path={routesConstants?.RENEW_HISTORY}
                />
                <StatCard
                  icon={ReceiptIcon}
                  value={dashboardData?.total_sales_invoice_amount_exc_gst || 0}
                  title="Sales Invoice Inc GST"
                  percentage={dashboardData?.sales_invoice_percentage || 0}
                />
                <StatCard
                  icon={PersonAddIcon}
                  value={dashboardData?.active_account || 0}
                  title="Active Accounts"
                  percentage={dashboardData?.active_account_percentage || 0}
                  isLink
                  handleNavigate={() => {
                    dispatch(setDashboardLoading("Active"));
                    navigate(routesConstants?.ACCOUNT);
                  }}
                />
                <StatCard
                  icon={PersonOffIcon}
                  value={dashboardData?.inactive_account || 0}
                  title="Inactive Accounts"
                  percentage={dashboardData?.expired_account_percentage || 0}
                  isLink
                  handleNavigate={() => {
                    dispatch(setDashboardLoading("Expired"));
                    navigate(routesConstants?.ACCOUNT);
                  }}
                />
              </div>
              <div className="dashboard-startCard">
                <StatCard
                  icon={PaymentIcon}
                  value={`₹${dashboardData?.payment_overdue || 0}`}
                  title="Payment Overdue"
                  percentage={dashboardData?.overdue_percentage || 0}
                  isLink
                  path={
                    routesConstants?.DASHBOARD +
                    routesConstants?.PAYMENTS_OVERDUE
                  }
                />
                <StatCard
                  icon={PointOfSaleIcon}
                  value={`₹${dashboardData?.payment_outstanding || 0}`}
                  title="Payment Outstanding"
                  percentage={
                    dashboardData?.payment_outstanding_percentage || 0
                  }
                  path={
                    routesConstants?.DASHBOARD +
                    routesConstants?.PAYMENTS_OUTSTANDING
                  }
                  isLink
                />
                <StatCard
                  icon={CurrencyRupeeIcon}
                  value={`₹${dashboardData?.payment_received || 0}`}
                  title="Payment Received"
                  percentage={dashboardData?.payment_received_percentage || 0}
                />
                <StatCard
                  icon={PendingActionsIcon}
                  value={dashboardData?.invoice_pending || 0}
                  title="Invoice Pending"
                  percentage={dashboardData?.invoice_pending_percentage || 0}
                  isLink
                  path={
                    routesConstants?.DASHBOARD +
                    routesConstants?.INVOICE_PENDING
                  }
                />
              </div>
            </>
          )}
        </>
      )}
      <div className="dashboard-chart-section">
        <div className="dashboard-chart">
          {seatDateChartLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="chart" key="line">
              {userDetail?.user_type === userType.client && (
                <label className="fw-bold">Licence Asset Graph</label>
              )}
              <LineChart data={seatDateChart} />
            </div>
          )}

          {dashboardChartLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="chart" key="bar">
              {userDetail?.user_type === userType.client && (
                <label className="fw-bold">Seat Quantity</label>
              )}
              <BarChart
                data={dashboardChart?.Response}
                isClient={userDetail?.user_type === userType.client}
              />
            </div>
          )}
          <div className="chart geography-map" key="geography">
            <span className="geography-span">Geography Based Traffic</span>
            {/* <GeographyChart isDashboard={true} /> */}
            {/* <StoreMap /> */}
            <Suspense fallback={<div>Loading map...</div>}>
              <MapView />
            </Suspense>
          </div>
        </div>
        {dashboardData?.order_loading_ho?.length > 0 && (
          <div className="dashboard-recent-transaction">
            <p className="dashboard-recent-span">Resent Transaction</p>
            {dashboardData?.order_loading_ho?.map((item) => (
              <div className="recent-transaction-section">
                <div>
                  <Tooltip title={item?.account_name || ""} placement="left">
                    <p className="mb-0 title">
                      {item?.account_name.slice(0, 14) + "..."}
                    </p>
                    <span>{item?.bd_person_name}</span>
                  </Tooltip>
                </div>
                <p>{item?.order_loading_date}</p>
                <p className="amount">₹{item?.sales_invoice_amount_ex_gst}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
