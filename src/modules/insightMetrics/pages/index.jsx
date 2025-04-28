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
  processedData,
  columns,
} from "../constants";
import ReactApexChart from "react-apexcharts";
import CommonTable from "@/components/common/dataTable/CommonTable";
import ExportToExcel from "@/components/common/buttons/ExportToExcel";

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
  const getRowId = (row) => row.id;
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
            // placeholder="All Status"
            value="All Status"
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
      <div className="table-container">
        <ExportToExcel
          data={processedData}
          columns={columns}
          fileName={`insight_trisita`}
          className="insight-export-btn"
        />
        <h3 className="common-insight-title">Table Data</h3>
        <CommonTable
          rows={processedData}
          columns={columns}
          getRowId={getRowId}
          checkboxSelection
          toolbar
          exportFileName={`insight_trisita`}
        />
      </div>
    </>
  );
};

export default InsightMetrics;
