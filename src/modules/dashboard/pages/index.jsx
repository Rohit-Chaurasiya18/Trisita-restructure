import React, { useEffect, useState } from "react";
import StatCard from "@/components/common/chart/StartCard";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { BarChart, GeographyChart, LineChart } from "../components";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  GetDashboardChart,
  GetDashboardData,
  GetSeatDateChart,
} from "../slice";
import CommonButton from "@/components/common/buttons/CommonButton";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    filter,
    dashboardDataLoading,
    dashboardData,
    dashboardChart,
    seatDateChart,
  } = useSelector((state) => ({
    filter: state?.layout?.filter,
    dashboardDataLoading: state?.dashboard?.dashboardDataLoading,
    dashboardData: state?.dashboard?.dashboardData,
    dashboardChart: state?.dashboard?.dashboardChart,
    seatDateChart: state?.dashboard?.seatDateChart,
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
  }, [filter?.csn]);

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
        <SkeletonLoader isDashboard />
      ) : (
        <>
          <div className="dashboard-startCard">
            <StatCard
              icon={EmailIcon}
              value={dashboardData?.renewal_count || 0}
              title="Renewal Email Sent"
              percentage={14}
              isLink
            />
            <StatCard
              icon={PointOfSaleIcon}
              value={dashboardData?.total_sales_invoice_amount_exc_gst || 0}
              title="Sales Invoice Inc GST"
              percentage={21}
            />
            <StatCard
              icon={PersonAddIcon}
              value={dashboardData?.active_account || 0}
              title="Active Accounts"
              percentage={`${(
                (dashboardData?.active_account /
                  dashboardData?.total_accounts) *
                100
              ).toFixed(2)}`}
              isLink
            />
            <StatCard
              icon={PersonOffIcon}
              value={dashboardData?.inactive_account || 0}
              title="Inactive Accounts"
              percentage={`${(
                (dashboardData?.inactive_account /
                  dashboardData?.total_accounts) *
                100
              ).toFixed(2)}`}
              isLink
            />
          </div>
          <div className="dashboard-startCard">
            <StatCard
              icon={EmailIcon}
              value={`₹${dashboardData?.payment_overdue || 0}`}
              title="Payment Overdue"
              percentage={14}
              isLink
            />
            <StatCard
              icon={PointOfSaleIcon}
              value={`₹${dashboardData?.payment_outstanding || 0}`}
              title="Payment Outstanding"
              percentage={21}
            />
            <StatCard
              icon={PersonAddIcon}
              value={`₹${dashboardData?.payment_received || 0}`}
              title="Payment Received"
              percentage={`${(
                (dashboardData?.active_account /
                  dashboardData?.total_accounts) *
                100
              ).toFixed(2)}`}
              isLink
            />
            <StatCard
              icon={PersonOffIcon}
              value={dashboardData?.invoice_pending || 0}
              title="Invoice Pending"
              percentage={`${(
                (dashboardData?.invoice_pending /
                  dashboardData?.order_loading_count) *
                100
              ).toFixed(2)}`}
              isLink
            />
          </div>
        </>
      )}
      <div className="dashboard-chart-section">
        <div className="dashboard-chart">
          <div className="chart" key="line">
            <LineChart />
          </div>
          <div className="chart" key="bar">
            <BarChart />
          </div>
          <div className="chart" key="geography">
            <span className="geography-span">Geography Based Traffic</span>
            <GeographyChart isDashboard={true} />
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
                    <span>Ankit</span>
                  </Tooltip>
                </div>
                <p>{item?.bd_person_name}</p>
                <p className="amount">₹{item?.order_loading_date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
