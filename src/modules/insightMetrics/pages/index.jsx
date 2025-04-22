import CommonButton from "@/components/common/buttons/CommonButton";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";

import {
  options,
  statusOption,
  accountOption,
  withoutProparated,
  withProparated,
  risk,
} from "../constants";
import ReactApexChart from "react-apexcharts";

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

const InsightMetrics = () => {
  const handleStatusChange = () => {
    console.log("Status changed!");
  };

  return (
    <>
      <div className="insight-metrics-header">
        <div className="commom-header-title">User Insight Metrics</div>
        <div className="insight-filters">
          <span>Last Updated</span>

          <CommonButton className="common-green-btn">All</CommonButton>

          <CommonAutocomplete
            onChange={(event, newValue) => {
              console.log("Branch selected:", newValue);
            }}
            options={options}
            label="Select a Branch"
          />

          <CommonSelect
            onChange={handleStatusChange}
            placeholder="All Status"
            options={statusOption}
          />

          <CommonAutocomplete
            onChange={(event, newValue) => {
              console.log("Account selected:", newValue);
            }}
            options={accountOption}
            label="Select an Account"
          />
        </div>
      </div>
      <div className="insight-chart-container">
        <CommonChart
          title="Data of direct seat metrics i.e. 1:1 association between product pool and agreement (without prorated)"
          options={withoutProparated.options}
          series={withoutProparated.series}
        />

        <CommonChart
          title="Data of direct seat metrics i.e. 1:1 association between product pool and agreement (prorated)"
          options={withProparated.options}
          series={withProparated.series}
        />

        <CommonChart
          title="Retention Risk shows summary of the renewal risk for the subscription's contract"
          options={risk.options}
          series={risk.series}
        />
      </div>
    </>
  );
};

export default InsightMetrics;
