import React, { useState } from "react";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import CommonSearchInput from "@/components/common/inputTextField/CommonSearch";
import CommonCategoryGrid from "../components/CommonCategoryGrid";
import CommonTable from "@/components/common/dataTable/CommonTable";
import {
  accountData,
  barChartData,
  ChartData,
  columns,
  LineChartData,
} from "../constants";
import ReactApexChart from "react-apexcharts";

const CommonChart = ({ title, options, series, subCategory, className }) => {
  return (
    <div className={`insight-metrics-chart ${className}`}>
      <div className="chart-data">
        <div className="chart-data-header">
          <h3>{title}</h3>
          <div className="chart-data-subcategory">
            {subCategory?.map((item,index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
        <ReactApexChart
          options={options}
          series={series}
          type={options.chart.type}
          height={options.chart.height}
        />
      </div>
    </div>
  );
};

const Account = () => {
  const [searchValue, setSearchValue] = useState("");

  const categories = [
    { title: "All", active: 1632, inactive: 2533, total: 4165 },
    { title: "AEC", active: 658, inactive: 1143, total: 1801 },
    { title: "MFG", active: 551, inactive: 648, total: 1199 },
    { title: "M&E", active: 63, inactive: 81, total: 144 },
    { title: "EDU", active: 9, inactive: 97, total: 106 },
    { title: "OTH", active: 157, inactive: 275, total: 432 },
    { title: "Unknown", active: 193, inactive: 288, total: 481 },
    { title: "Null", active: 1, inactive: 1, total: 2 },
  ];
  const getRowId = (row) => row.id;
  return (
    <div className="account">
      <h5 className="commom-header-title mb-0">
        Account Information of the End Customers
      </h5>
      <span className="common-breadcrum-msg">
        List of all Autodesk End Customers. The boxes below show combined
        industry details.
      </span>

      <div className="account-filter">
        <span>Last Updated</span>

        <CommonButton className="common-green-btn">All</CommonButton>

        <CommonAutocomplete
          label="Select a Branch"
          options={[
            { value: 1, label: "Mumbai" },
            { value: 2, label: "Delhi" },
            { value: 3, label: "Kolkata" },
          ]}
          onChange={(event, newValue) => {
            console.log("Branch selected:", newValue);
          }}
        />

        <CommonSelect
          value="All Status"
          options={[
            { value: "All Status", label: "All Status" },
            { value: "Active", label: "Active" },
            { value: "Expired", label: "Expired" },
          ]}
          onChange={(e) => {
            console.log("Status changed:", e.target.value);
          }}
        />

        <CommonSearchInput
          value={searchValue}
          label="Search Accounts"
          loading={false}
          debounceTime={400}
          onChange={(text) => {
            console.log("Debounced Search Text:", text);
            setSearchValue(text);
          }}
        />
      </div>
      <div className="mt-4">
        <CommonCategoryGrid data={categories} />
      </div>
      <div className="account-table mt-4">
        <CommonTable
          rows={accountData}
          columns={columns}
          getRowId={getRowId}
          checkboxSelection
          toolbar
          exportFileName={`account_trisita`}
        />
      </div>
      <div className="account-industry-chart mt-4">
        <CommonChart
          title="Trend of number of accounts by Industry"
          options={LineChartData.options}
          series={LineChartData.series}
          subCategory={["By Industry Group", "By Segment", "By Sub Segment"]}
        />
      </div>
      <div className="account-industry-chart-2 mt-4">
        <CommonChart
          title="Show by rediness scores"
          options={ChartData.options}
          series={ChartData.series}
          className="chart-data-1"
        />
        <CommonChart
          title="Top 12 cities by number of account trend showing between active and inactive"
          options={barChartData.options}
          className="chart-data-2"
          series={barChartData.series}
        />
      </div>
    </div>
  );
};

export default Account;
