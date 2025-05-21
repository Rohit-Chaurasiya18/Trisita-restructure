import CommonButton from "@/components/common/buttons/CommonButton";
import DatePickerFilter from "@/components/common/date/DatePickerFilter";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import { Tooltip } from "@mui/material";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import {
  AccountDataChart,
  LineChart,
  PieChart,
  data,
  columns,
} from "../constant";
import CommonTable from "@/components/common/dataTable/CommonTable";
import { useSelector } from "react-redux";

const CommonChart = ({ title, options, series }) => {
  return (
    <div className="insight-metrics-chart">
      <div className="chart-data">
        <h3>{title}</h3>
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

const CommonCard = ({ title, value, bgColor, textColor }) => (
  <div
    className="opportunity-card"
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    <p>
      {title} - {value}
    </p>
  </div>
);

const Opportunity = () => {
  const { userDetail } = useSelector((state) => ({
    userDetail: state?.login?.userDetail,
  }));
  const cardData = useMemo(
    () => [
      {
        title: "Oppn.expiring by this week",
        value: 39,
        bgColor: "#ff6a6a40",
        textColor: "#b31807b5",
      },
      {
        title: "Oppn.expiring by this month",
        value: 124,
        bgColor: "#f2bd20a9",
        textColor: "rgb(145 99 8 / 1)",
      },
      {
        title: "Oppn.expiring in next month",
        value: 131,
        bgColor: "#2178f161",
        textColor: "rgb(59 109 196 / 1)",
      },
      {
        title: "Oppn.expiring today till next 3 months",
        value: 362,
        bgColor: "#17c34529",
        textColor: "#05340ab0",
      },
    ],
    []
  );
  const getRowId = (row) => row?.opportunity_number;

  return (
    <div className="opportunity-container">
      <div className="opportunity-header">
        <h5 className="commom-header-title mb-0">Opportunity Dashboard</h5>
        <span className="common-breadcrum-msg">
          Use of PWS Oppportunity Export API data to show details below
        </span>
        <div className="account-filter">
          <Tooltip title="Last Updated" placement="top">
            <span>Last Updated</span>
          </Tooltip>

          <CommonButton
            className="common-green-btn"
            onClick={() => console.log("All")}
          >
            All
          </CommonButton>

          <DatePickerFilter label="Start Date" />
          <DatePickerFilter label="End Date" />

          <CommonAutocomplete
            label="Select a Branch"
            onChange={(event, newValue) => console.log(newValue)}
          />
        </div>
      </div>

      <div className="opportunity-card-section">
        {cardData.map((card, index) => (
          <CommonCard key={index} {...card} />
        ))}
      </div>

      <div className="opportunity-chart-section">
        <CommonChart
          title="All User Product Seat data"
          options={LineChart.options}
          series={LineChart.series}
        />
        <div className="opportunity-retention-account">
          <CommonChart
            title="Oppen. by Retention health"
            options={PieChart.options}
            series={PieChart.series}
          />
          <CommonChart
            title="Oppen. by Account name"
            options={AccountDataChart.options}
            series={AccountDataChart.series}
          />
        </div>
      </div>

      <div className="opportunity-table">
        <CommonTable
          rows={data}
          columns={columns}
          getRowId={getRowId}
          checkboxSelection
          toolbar
          exportFileName={`oppn_trisita_${userDetail?.first_name}_${userDetail?.last_name}`}
        />
      </div>
    </div>
  );
};

export default Opportunity;
