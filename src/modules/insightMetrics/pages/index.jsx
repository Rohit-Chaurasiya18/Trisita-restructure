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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAccount,
  getAllBranch,
  getInsightMetrics,
} from "../slice/insightMetrics";

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
  const dispatch = useDispatch();
  const {
    accountListLoading,
    account_list,
    branchListLoading,
    branch_list,
    filter,
    lastUpdated,
    insightMetricsCustomer,
  } = useSelector((state) => ({
    filter: state?.layout?.filter,
    accountListLoading: state?.insightMetrics?.accountListLoading,
    account_list: state?.insightMetrics?.accountList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    branch_list: state?.insightMetrics?.branchList,
    lastUpdated: state?.insightMetrics?.lastUpdated,
    insightMetricsCustomer: state?.insightMetrics?.insightMetricsCustomer,
  }));

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getAllAccount());
  }, []);

  useEffect(() => {
    dispatch(
      getInsightMetrics({ id: filter?.csn === "All CSN" ? "" : filter?.csn })
    );
  }, [filter?.csn]);

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
            options={branch_list}
            label="Select a Branch"
            loading={branchListLoading}
          />
          <CommonSelect
            onChange={handleStatusChange}
            value="All Status"
            options={statusOption}
          />

          <CommonAutocomplete
            onChange={(event, newValue) => {
              console.log("Account selected:", newValue);
            }}
            options={account_list}
            label="Select an Account"
            getOptionLabel={(option) => `${option?.label} (${option?.csn})`}
            loading={accountListLoading}
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
