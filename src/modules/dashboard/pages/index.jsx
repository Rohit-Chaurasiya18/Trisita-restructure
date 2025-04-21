import React, { useEffect, useState } from "react";
import StatCard from "@/components/common/chart/StartCard";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { BarChart, GeographyChart, LineChart } from "../components";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  GetDashboardChart,
  GetDashboardData,
  GetSeatDateChart,
} from "../slice";
import CommonButton from "@/components/common/buttons/CommonButton";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CommonSelect from "@/components/common/dropdown/CommonSelect";

const data = [
  {
    account_name: "Penta India Technical Consultants Pvt. Ltd",
    bd_person_name: "person",
    order_loading_date: "1938359",
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    year: "",
    csn: "",
  });

  useEffect(() => {
    dispatch(GetDashboardData({ id: "1" }));
    dispatch(GetDashboardChart({ id: "2" }));
    dispatch(GetSeatDateChart({ id: "3" }));
  }, []);

  const handleFilterChange = (key) => (event) => {
    setFilter((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  return (
    <div className="">
      <div className="dashboard-header">
        <div>
          <h3 className="mb-0">Dashboard</h3>
          <span className="common-breadcrum-msg">
            Welcome to your dashboard
          </span>
        </div>
        <div className="dashboard-filter">
          <CommonSelect
            value={filter.year}
            onChange={handleFilterChange("year")}
            placeholder="All Year"
            options={[
              { value: "ADSK FY 2025", label: "ADSK FY 2025" },
              { value: "ADSK FY 2024", label: "ADSK FY 2024" },
              { value: "ADSK FY 2023", label: "ADSK FY 2023" },
            ]}
          />
          <CommonSelect
            value={filter.csn}
            onChange={handleFilterChange("csn")}
            placeholder="All CSN"
            options={[
              { value: "5102086717", label: "5102086717" },
              { value: "5117963549", label: "5117963549" },
              { value: "1234567890", label: "1234567890" },
            ]}
          />
          <CommonButton className="download-report-btn">
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </CommonButton>
        </div>
      </div>
      <div className="dashboard-startCard">
        <StatCard
          icon={EmailIcon}
          value={0}
          title="Renewal Email Sent"
          percentage={14}
          isLink
        />
        <StatCard
          icon={PointOfSaleIcon}
          value={1232805}
          title="Sales Invoice Inc GST"
          percentage={21}
        />
        <StatCard
          icon={PersonAddIcon}
          value={87}
          title="Active Accounts"
          percentage={94.57}
          isLink
        />
        <StatCard
          icon={PersonOffIcon}
          value={5}
          title="Inactive Accounts"
          percentage={5.43}
          isLink
        />
      </div>
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
        <div className="dashboard-recent-transaction">
          <p className="dashboard-recent-span">Resent Transaction</p>
          {data?.map((item) => (
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
      </div>
    </div>
  );
};

export default Dashboard;
