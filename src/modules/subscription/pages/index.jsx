import CommonButton from "@/components/common/buttons/CommonButton";
import DatePickerFilter from "@/components/common/date/DatePickerFilter";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
// import { accountOption } from "@/modules/insightMetrics/constants";
import {
  accountGroupChartData,
  accountTypeChartData,
  amountPerMOnth,
  columns,
  expiredContractSpeedMeterData,
  onBoardHealth,
  options,
  processedData,
  riskRetentionShows,
  series,
} from "../constants";
import ReactApexChart from "react-apexcharts";
import CommonTable from "@/components/common/dataTable/CommonTable";
const CommonChart = ({ title, options, series, subCategory, className }) => {
  return (
    <div className={`insight-metrics-chart ${className}`}>
      <div className="chart-data">
        <div className="chart-data-header">
          <h3>{title}</h3>
          <div className="chart-data-subcategory">
            {subCategory?.map((item, index) => (
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
const getRowId = (row) => row.id;

const Subscription = () => {
  return (
    <>
      <div>
        <div className="subscription-header">
          <h5 className="commom-header-title mb-0">Subscription</h5>
          <div className="subscription-filter">
            <span>Last Updated</span>
            <CommonButton className="common-green-btn">All</CommonButton>

            <DatePickerFilter
              label="Start Date"
              onChange={(value) => console.log(value)}
            />
            <DatePickerFilter
              label="End Date"
              onChange={(value) => console.log(value)}
            />
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
            <CommonAutocomplete
              onChange={(event, newValue) => {
                console.log("Account selected:", newValue);
              }}
              // options={accountOption}
              label="Select an Account"
            />
          </div>
          <div className="subscription-chart">
            <CommonChart
              title="Trend of number of seats purchased by product line code"
              options={options}
              series={series}
              subCategory={[
                "By Product line",
                "By Account names",
                "By Team names",
                "By Last Purchase Year",
              ]}
            />
            <div className="account-industry-chart-2 mt-4">
              <CommonChart
                title="Total Subscriptions as per Account Group"
                options={accountGroupChartData.options}
                series={accountGroupChartData.series}
                className="chart-data-1"
              />
              <CommonChart
                title="Total Amount as per Months"
                options={amountPerMOnth.options}
                series={amountPerMOnth.series}
                className="chart-data-2"
              />
            </div>
            <div className="account-industry-chart-2 mt-4">
              <CommonChart
                title="Expired subscriptions ratio of nurtrued and customer"
                options={expiredContractSpeedMeterData.options}
                series={expiredContractSpeedMeterData.series}
                className="chart-data-1"
              />
              <div className="chart-section">
                <CommonChart
                  title="Retention Risk shows summary of the renewal risk for the subscription contract"
                  options={riskRetentionShows.options}
                  series={riskRetentionShows.series}
                  className="chart-data-2"
                />
                <CommonChart
                  title="Total Subscriptions as per Account Type"
                  options={accountTypeChartData.options}
                  series={accountTypeChartData.series}
                  className="chart-data-2"
                />
              </div>
            </div>
            <CommonChart
              title="On boarding Health adoption report"
              options={onBoardHealth.options}
              series={onBoardHealth.series}
            />
          </div>
          <div className="subscription-table">
            <CommonTable
              rows={processedData}
              columns={columns}
              getRowId={getRowId}
              checkboxSelection
              toolbar
              exportFileName={`subs_trisita`}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Subscription;
