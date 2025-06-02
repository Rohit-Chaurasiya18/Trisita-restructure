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
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  getAllAccount,
  getAllBranch,
} from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { Autocomplete, TextField, Typography } from "@mui/material";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import { getSubscriptionData } from "../slice/subscriptionSlice";
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
  const dispatch = useDispatch();

  const {
    branch_list,
    branchListLoading,
    accountListLoading,
    account_list,
    filter,
    last_updated,
    speedometerRatio,
    subscriptionData,
    subscriptionDataLoading,
  } = useSelector((state) => ({
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    accountListLoading: state?.insightMetrics?.accountListLoading,
    account_list: state?.insightMetrics?.accountList,
    filter: state?.layout?.filter,
    last_updated: state?.subscription?.lastUpdate,
    speedometerRatio: state?.subscription?.speedometerRatio,
    subscriptionData: state?.subscription?.subscriptionData,
    subscriptionDataLoading: state?.subscription?.subscriptionDataLoading,
  }));

  const [dateRange, setDateRange] = useState([null, null]);
  const [filters, setFilters] = useState({
    account: [],
    branch: null,
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getAllAccount());
  }, []);

  useEffect(() => {
    let payload = {
      csn: filter?.csn === "All CSN" ? "" : filter?.csn,
      payload: {
        from_date: filters?.startDate ? filters?.startDate : "",
        to_date: filters?.endDate ? filters?.endDate : "",
      },
    };
    dispatch(getSubscriptionData(payload));
  }, [filter?.csn, filters?.startDate, filters?.endDate]);

  const handleChange = (newValue) => {
    const [start, end] = newValue;

    if (start) {
      setFilters((prev) => ({
        ...prev,
        startDate: start.format("YYYY-MM-DD"),
      }));
    }
    if (end) {
      setFilters((prev) => ({
        ...prev,
        endDate: end.format("YYYY-MM-DD"),
      }));
    }
    setDateRange(newValue);
  };

  const expiredContractSpeedMeterData = useMemo(
    () => ({
      series: [speedometerRatio?.percentage_expired_contract],
      options: {
        chart: {
          height: 350,
          type: "radialBar",
          offsetY: -10,
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
              show: true,
              name: {
                show: false,
                fontSize: "16px",
                color: undefined,
                offsetY: 120,
              },
              value: {
                offsetY: 76,
                fontSize: "22px",
                color: undefined,
                formatter: function (val) {
                  return val + "%";
                },
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91],
          },
        },
        stroke: {
          dashArray: 4,
        },
      },
    }),
    [speedometerRatio]
  );
  
  return (
    <>
      <div>
        <div className="subscription-header">
          <h5 className="commom-header-title mb-0">Subscription</h5>
          <div className="subscription-filter">
            <span>Last Updated</span>
            <CommonButton className="common-green-btn">All</CommonButton>

            <CommonDateRangePicker
              value={dateRange}
              onChange={handleChange}
              width="180px"
              placeholderStart="Start date"
              placeholderEnd="End date"
            />
            <CommonAutocomplete
              onChange={(event, newValue) => {
                setFilters((prev) => ({
                  ...prev,
                  branch: newValue,
                }));
              }}
              options={branch_list}
              label="Select a Branch"
              loading={branchListLoading}
              value={filters?.branch}
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
            <div
              className={`${
                filters?.account?.length > 0 && "multiple-select-container"
              }`}
            >
              <Autocomplete
                value={filters?.account}
                onChange={(event, newValues) => {
                  setFilters((prev) => ({
                    ...prev,
                    account: newValues,
                  }));
                }}
                options={account_list || []}
                multiple
                getOptionLabel={(option) => `${option?.label} (${option?.csn})`}
                loading={accountListLoading}
                disabled={accountListLoading || !account_list?.length}
                sx={{
                  width: 300,
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select an Account"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {params.InputProps.endAdornment}
                          {accountListLoading && (
                            <Typography variant="body2" color="textSecondary">
                              Loading...
                            </Typography>
                          )}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </div>
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
                options={expiredContractSpeedMeterData?.options}
                series={expiredContractSpeedMeterData?.series}
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
