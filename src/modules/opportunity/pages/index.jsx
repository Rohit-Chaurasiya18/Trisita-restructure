import CommonButton from "@/components/common/buttons/CommonButton";
import DatePickerFilter from "@/components/common/date/DatePickerFilter";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import { Tooltip } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import CommonTable from "@/components/common/dataTable/CommonTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { getExportedOpportunities } from "../slice/opportunitySlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import moment from "moment";
import CommonModal from "@/components/common/modal/CommonModal";
import OpportunityDetail from "../components/OpportunityDetail";
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

const CommonCard = ({
  title,
  value,
  bgColor,
  textColor,
  name,
  handleChange,
}) => (
  <div
    className="opportunity-card"
    style={{ backgroundColor: bgColor, color: textColor }}
    onClick={() => handleChange(name)}
  >
    <p>
      {title} - {value}
    </p>
  </div>
);

const Opportunity = () => {
  const dispatch = useDispatch();
  const {
    branchListLoading,
    branch_list,
    userDetail,
    opportunityLoading,
    opportunityList,
    expiring_count,
    last_updated,
  } = useSelector((state) => ({
    branchListLoading: state?.insightMetrics?.branchListLoading,
    branch_list: state?.insightMetrics?.branchList,
    userDetail: state?.login?.userDetail,
    opportunityLoading: state?.opportunity?.opportunityLoading,
    opportunityList: state?.opportunity?.opportunityList,
    expiring_count: state?.opportunity?.expiring_count,
    last_updated: state?.opportunity?.last_updated,
  }));

  const [filters, setFilters] = useState({
    branch: null,
    from_date: null,
    to_date: null,
    cardFilter: "",
  });
  // All User Product Seat
  const [opportunityBarChart, SetOpportunityBarChart] = useState([]);
  // Oppen. by Retention health Graph
  const [opportunityDataGraph, SetOpportunityDataGraph] = useState([]);
  // Oppen. by Account name Graph
  const [opportunityAccountDataSecondGraph, SetOpportunityDataSecondGraph] =
    useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    opportunity_number: "",
  });
  const [selectedId, setSelectedId] = useState([]);

  const cardData = useMemo(
    () => [
      {
        title: "Oppn.expiring by this week",
        value: expiring_count?.expiring_this_week_count,
        bgColor: "#ff6a6a40",
        textColor: "#b31807b5",
        name: "week",
      },
      {
        title: "Oppn.expiring by this month",
        value: expiring_count?.expiring_this_month_count,
        bgColor: "#f2bd20a9",
        textColor: "rgb(145 99 8 / 1)",
        name: "month",
      },
      {
        title: "Oppn.expiring in next month",
        value: expiring_count?.expiring_next_month_count,
        bgColor: "#2178f161",
        textColor: "rgb(59 109 196 / 1)",
        name: "next_month",
      },
      {
        title: "Oppn.expiring today till next 3 months",
        value: expiring_count?.expiring_next_3_months_count,
        bgColor: "#17c34529",
        textColor: "#05340ab0",
        name: "next_three_month",
      },
    ],
    [expiring_count]
  );

  const getRowId = (row) => row?.opportunity_number;

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  useEffect(() => {
    let payload = {
      branch: filters?.branch?.value,
      from_date: filters?.from_date,
      to_date: filters?.to_date,
      cardFilter: filters?.cardFilter,
    };
    dispatch(getExportedOpportunities(payload));
  }, [
    filters?.branch,
    filters?.from_date,
    filters?.to_date,
    filters?.cardFilter,
  ]);

  const handleDateChange = (value, key) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const handleChange = (name) => {
    setFilters((prev) => ({
      ...prev,
      cardFilter: name,
    }));
  };

  useEffect(() => {
    if (opportunityList) {
      processChartData(opportunityList);
    }
  }, [opportunityList]);

  const processChartData = (data) => {
    const retentionHealthCounts = {};
    const accountNameCounts = {};
    const modifiedData = [];

    data.forEach((item) => {
      if (item.ews_retention_health) {
        retentionHealthCounts[item.ews_retention_health] =
          (retentionHealthCounts[item.ews_retention_health] || 0) + 1;
      }

      if (item.account_name) {
        accountNameCounts[item.account_name] =
          (accountNameCounts[item.account_name] || 0) + 1;
      }

      if (item.subscription_end_date && item.total_quantity) {
        modifiedData.push({
          label: item.subscription_end_date,
          value: parseInt(item.total_quantity, 10),
        });
      }
    });
    SetOpportunityBarChart(modifiedData);
    SetOpportunityDataGraph(retentionHealthCounts);
    SetOpportunityDataSecondGraph(accountNameCounts);
  };

  // All User Product Seat data Graph
  const categories = useMemo(
    () => opportunityBarChart?.map((item) => item.label) || [],
    [opportunityBarChart]
  );
  const dataValues = useMemo(
    () => opportunityBarChart?.map((item) => item.value) || [],
    [opportunityBarChart]
  );

  const LineChartData = useMemo(
    () => ({
      series: [
        {
          name: "Seats",
          data: dataValues,
        },
      ],
      options: {
        chart: {
          type: "line",
          width: "100%",
          zoom: {
            enabled: false,
          },
          height: 350,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: categories,
        },
      },
    }),
    [dataValues, categories]
  );

  // Oppen. by Retention health Graph
  const values = Object.values(opportunityDataGraph);
  const names = ["Very High", "Medium", "High", "Low", "Undefined"];

  const graphdata = [];

  for (let i = 0; i < values.length; i++) {
    graphdata.push({ name: names[i], value: values[i] });
  }
  const ChartData = useMemo(
    () => ({
      series: graphdata.map((item) => item.value),
      options: {
        chart: {
          height: 350,
          type: "pie",
        },
        labels: graphdata.map((item) => item.name),
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    }),
    [graphdata]
  );

  // Oppen. by Account name Graph
  const secondgraphdata = Object.values(opportunityAccountDataSecondGraph);
  const secondgraphlabel = Object.keys(opportunityAccountDataSecondGraph);
  const AccountDataChart = useMemo(
    () => ({
      series: secondgraphdata,
      options: {
        chart: {
          type: "pie",
          height: 350,
          //   width: 350,
        },
        labels: secondgraphlabel,
        responsive: [
          {
            breakpoint: 2260,
            options: {
              legend: {
                position: "bottom",
              },
              chart: {
                height: 500,
              },
            },
          },
        ],
      },
    }),
    [secondgraphlabel]
  );

  const columns = [
    {
      field: "opportunity_number",
      headerName: "oppn#",
      width: 150,
      renderCell: (params, index) => (
        <span
          onClick={() => {
            setModal((prev) => ({
              ...prev,
              isOpen: true,
              opportunity_number: params?.row?.opportunity_number,
            }));
          }}
          className="action-button bg-white text-black px-3 py-1 rounded border-0"
        >
          {params?.value}
        </span>
      ),
    },

    { field: "status", headerName: "Status", width: 100 },
    { field: "subscription_end_date", headerName: "Sub end date", width: 150 },
    { field: "total_quantity", headerName: "Quantity", width: 100 },
    { field: "contract_number", headerName: "Contract Number", width: 150 },
    {
      field: "ews_retention_health",
      headerName: "Rentention Health",
      width: 100,
    },
    { field: "reseller_name", headerName: "Reseller", width: 200 },
    { field: "account_name", headerName: "Account", width: 200 },
    {
      field: "bd_person_name",
      headerName: "BD Person Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {params?.value && params?.value ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "renewal_person_name",
      headerName: "Renewal Person Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {params?.value && params?.value ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "branch",
      headerName: "Branch",
      width: 100,
      renderCell: (params) => (
        <div>
          {params?.value && params?.value ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    ,
    {
      field: "contract_manager_email",
      headerName: "Contract Msg Email",
      width: 220,
    },
  ];
  const handleSelectionChange = (selectedRows) => {
    const idArray = [...selectedRows?.ids];
    if (idArray?.length > 0) {
      setSelectedId(idArray);
    } else {
      setSelectedId([]);
    }
  };

  const exportedData = useMemo(
    () =>
      opportunityList?.filter((item) =>
        selectedId.includes(item?.opportunity_number)
      ),
    [selectedId]
  );

  return (
    <>
      <div className="opportunity-container">
        <div className="opportunity-header">
          <h5 className="commom-header-title mb-0">Opportunity Dashboard</h5>
          <span className="common-breadcrum-msg">
            Use of PWS Oppportunity Export API data to show details below
          </span>
          <div className="account-filter">
            <Tooltip
              title={moment(last_updated).format("MMMM D, YYYY [at] h:mm:ss A")}
              placement="top"
            >
              <span>Last Updated</span>
            </Tooltip>

            <CommonButton
              className="common-green-btn"
              onClick={() => {
                setFilters({
                  branch: null,
                  from_date: null,
                  to_date: null,
                  cardFilter: "",
                });
              }}
            >
              All
            </CommonButton>

            <DatePickerFilter
              label="Start Date"
              value={filters?.from_date}
              onChange={(val) => handleDateChange(val, "from_date")}
            />
            <DatePickerFilter
              label="End Date"
              value={filters?.to_date}
              onChange={(val) => handleDateChange(val, "to_date")}
            />

            <CommonAutocomplete
              label="Select a Branch"
              onChange={(event, newValue) => {
                setFilters((prev) => ({
                  ...prev,
                  branch: newValue,
                }));
              }}
              options={branch_list}
              loading={branchListLoading}
              value={filters?.branch}
            />
          </div>
        </div>

        <div className="opportunity-card-section">
          {cardData.map((card, index) => (
            <CommonCard key={index} {...card} handleChange={handleChange} />
          ))}
        </div>

        {opportunityLoading ? (
          <div className="mt-2">
            <SkeletonLoader isDashboard />
          </div>
        ) : (
          <div className="opportunity-chart-section">
            <CommonChart
              title="All User Product Seat data"
              options={LineChartData.options}
              series={LineChartData.series}
            />
            <div className="opportunity-retention-account">
              <CommonChart
                title="Oppen. by Retention health"
                options={ChartData.options}
                series={ChartData.series}
              />
              <CommonChart
                title="Oppen. by Account name"
                options={AccountDataChart.options}
                series={AccountDataChart.series}
              />
            </div>
          </div>
        )}
        {opportunityLoading ? (
          <div className="mt-2">
            <SkeletonLoader isDashboard />
          </div>
        ) : (
          <div className="opportunity-table">
            <ExportToExcel
              data={exportedData}
              columns={columns}
              fileName={`oppn_trisita_${userDetail?.first_name}_${
                userDetail?.last_name
              }_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`}
              className="account-export-btn"
            />
            <CommonTable
              rows={opportunityList}
              columns={columns}
              getRowId={getRowId}
              checkboxSelection
              handleRowSelection={handleSelectionChange}
              toolbar
              exportFileName={`oppn_trisita_${userDetail?.first_name}_${userDetail?.last_name}`}
            />
          </div>
        )}
      </div>
      <CommonModal
        isOpen={modal?.isOpen}
        handleClose={() => {
          setModal((prev) => ({
            ...prev,
            isOpen: false,
            opportunity_number: "",
          }));
        }}
        scrollable
        title={"Opportunity information detail"}
      >
        <OpportunityDetail id={modal?.opportunity_number} />
      </CommonModal>
    </>
  );
};

export default Opportunity;
