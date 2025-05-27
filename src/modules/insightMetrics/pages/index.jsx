import CommonButton from "@/components/common/buttons/CommonButton";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import { statusOption } from "../constants";
import ReactApexChart from "react-apexcharts";
import CommonTable from "@/components/common/dataTable/CommonTable";
import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAccount,
  getAllBranch,
  getInsightMetrics,
  getInsightMetricsContract,
} from "../slice/insightMetricsSlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { Autocomplete, TextField, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import CommonModal from "@/components/common/modal/CommonModal";
import InsightMetricsContract from "../components/InsightMetricsContract";

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
    insightMetricsCustomerLoading,
    insightMetricsCustomer,
    userDetail,
  } = useSelector((state) => ({
    filter: state?.layout?.filter,
    accountListLoading: state?.insightMetrics?.accountListLoading,
    account_list: state?.insightMetrics?.accountList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    branch_list: state?.insightMetrics?.branchList,
    lastUpdated: state?.insightMetrics?.lastUpdated,
    insightMetricsCustomerLoading:
      state?.insightMetrics?.insightMetricsCustomerLoading,
    insightMetricsCustomer: state?.insightMetrics?.insightMetricsCustomer,
    userDetail: state?.login?.userDetail,
  }));

  const [filteredData, setFilteredData] = useState([]);
  const [productlinecount, SetProductLineCount] = useState();
  const [productlineproratedcount, SetProductLineProratedCount] = useState();
  const [riskcategory, SetRiskCategory] = useState();
  const [filters, setFilters] = useState({
    branch: null,
    status: "All Status",
    account: [],
  });
  const [modal, setModal] = useState({
    isOpen: false,
  });

  useEffect(() => {
    if (
      filters?.branch?.label ||
      filters?.status ||
      filters?.account?.length > 0
    ) {
      let data = insightMetricsCustomer;
      if (filters?.branch?.value) {
        data = data?.filter((item) => item?.branch === filters?.branch?.label);
      }
      if (filters?.status !== "All Status") {
        data = data?.filter(
          (item) =>
            item?.contract_status?.toString()?.toLowerCase() ===
            filters?.status?.toString()?.toLowerCase()
        );
      }
      if (filters?.account?.length > 0) {
        data = data?.filter((item) => {
          const name = item["Account"];
          return filters?.account.some(
            (value) =>
              name && name.toLowerCase().includes(value.label.toLowerCase())
          );
        });
      }
      setFilteredData(data);
    } else {
      setFilteredData(insightMetricsCustomer);
    }
  }, [filters?.account, filters?.branch, filters?.status]);
  
  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getAllAccount());
  }, []);

  useEffect(() => {
    setFilteredData(insightMetricsCustomer);
  }, [insightMetricsCustomer]);

  useEffect(() => {
    dispatch(
      getInsightMetrics({ id: filter?.csn === "All CSN" ? "" : filter?.csn })
    );
  }, [filter?.csn]);

  const getRowId = (row) => row.id;

  const handleBarClick = (data) => {
    const updatedData = insightMetricsCustomer?.filter(
      (item) => item?.riskCategory === data
    );
    setFilteredData(updatedData);
  };

  // Data for graphs
  useEffect(() => {
    const riskCounts = {
      Green: 0,
      Yellow: 0,
      Red: 0,
      Unknown: 0,
    };
    const Green = filteredData?.filter((item) => {
      return item["riskCategory"] === "Green";
    });
    const Yellow = filteredData?.filter((item) => {
      return item["riskCategory"] === "Yellow";
    });
    const Red = filteredData?.filter((item) => {
      return item["riskCategory"] === "Red";
    });
    const Unknown = filteredData?.filter((item) => {
      return item["riskCategory"] === "";
    });
    const onboardall = {};
    onboardall["Green"] = Green || [];
    onboardall["Yellow"] = Yellow || [];
    onboardall["Red"] = Red || [];
    onboardall["Unknown"] = Unknown || [];

    const risk_counting = insightMetricsCustomer?.reduce(
      (accumulator, item) => {
        const { riskCategory } = item;

        if (riskCategory === "Green") {
          riskCounts.Green++;
        } else if (riskCategory === "Yellow") {
          riskCounts.Yellow++;
        } else if (riskCategory === "Red") {
          riskCounts.Red++;
        } else {
          riskCounts.Unknown++;
        }
        return accumulator;
      },
      {}
    );

    const counts = filteredData?.reduce((accumulator, item) => {
      const { productLineCode, seatsPurchased, usersAssigned, seatsInUse } =
        item;

      if (!accumulator[productLineCode]) {
        accumulator[productLineCode] = {
          seats_purchased_count: 0,
          users_assigned_count: 0,
          seats_in_use_count: 0,
        };
      }

      if (usersAssigned !== null && seatsInUse !== null) {
        accumulator[productLineCode].seats_purchased_count +=
          parseInt(seatsPurchased) || 0;
        accumulator[productLineCode].users_assigned_count +=
          parseInt(usersAssigned) || 0;
        accumulator[productLineCode].seats_in_use_count +=
          parseInt(seatsInUse) || 0;
      }

      return accumulator;
    }, {});

    SetProductLineCount(counts);
    SetRiskCategory(riskCounts);

    const prorated = filteredData?.reduce((accumulator, item) => {
      const {
        productLineCode,
        seatsPurchased,
        usersAssigned,
        seatsInUse,
        assignmentRate,
        utilisationRate,
      } = item;

      if (!accumulator[productLineCode]) {
        accumulator[productLineCode] = {
          seats_purchased_count: 0,
          users_assigned_prorated: 0,
          seats_in_use_prorated: 0,
        };
      }

      if (usersAssigned === null || seatsInUse === null) {
        const calculatedUsersAssigned =
          (parseFloat(assignmentRate) * parseInt(seatsPurchased)) / 100;
        const calculatedseatsInUse =
          (parseFloat(utilisationRate) * parseInt(seatsPurchased)) / 100;
        accumulator[productLineCode].seats_purchased_count +=
          parseInt(seatsPurchased);
        accumulator[productLineCode].users_assigned_prorated +=
          calculatedUsersAssigned || 0;
        accumulator[productLineCode].seats_in_use_prorated +=
          calculatedseatsInUse || 0;
      }

      return accumulator;
    }, {});

    const prorated_chart_data = Object.fromEntries(
      Object.entries(prorated || {}).filter(
        ([productLineCode, data]) =>
          data.users_assigned_prorated !== 0 || data.seats_in_use_prorated !== 0
      )
    );

    Object.keys(prorated_chart_data).forEach((productLineCode) => {
      prorated_chart_data[productLineCode].users_assigned_prorated = parseFloat(
        prorated_chart_data[productLineCode].users_assigned_prorated
      )?.toFixed(2);
      prorated_chart_data[productLineCode].seats_in_use_prorated = parseFloat(
        prorated_chart_data[productLineCode].seats_in_use_prorated
      ).toFixed(2);
    });
    SetProductLineProratedCount(prorated_chart_data);
  }, [filteredData]);

  // Data of direct seat metrics i.e. 1:1 association between product pool and agreement (without prorated)
  const categories = productlinecount ? Object.keys(productlinecount) : [];
  const withoutProparated = useMemo(
    () => ({
      options: {
        chart: {
          height: 350,
          type: "bar",
        },
        xaxis: {
          labels: {},
          categories: categories,
        },
        yaxis: {
          title: {
            text: "Count",
          },
        },
        colors: ["#007BFF", "#28A745", "#FFC107"],
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "80%",
          },
        },
      },
      series: [
        {
          name: "Seats Purchased",
          data: categories.map((category) =>
            productlinecount[category]
              ? productlinecount[category]?.seats_purchased_count
              : 0
          ),
        },
        {
          name: "User Assigned",
          data: categories.map((category) =>
            productlinecount[category]
              ? productlinecount[category]?.users_assigned_count
              : 0
          ),
        },
        {
          name: "Seats In Use",
          data: categories.map((category) =>
            productlinecount[category]
              ? productlinecount[category]?.seats_in_use_count
              : 0
          ),
        },
      ],
    }),
    [categories]
  );

  // Data of direct seat metrics i.e. 1:1 association between product pool and agreement (prorated)
  const prorated_categories = productlineproratedcount
    ? Object.keys(productlineproratedcount)
    : [];

  const withProparated = useMemo(
    () => ({
      options: {
        chart: {
          height: 350,
          type: "bar",
        },
        xaxis: {
          labels: {
            rotate: -45,
          },
          categories: prorated_categories,
        },
        yaxis: {
          title: {
            text: "Count",
          },
        },
        colors: ["#007BFF", "#28A745", "#FFC107"],
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "80%",
          },
        },
      },
      series: [
        {
          name: "Seats Purchased",
          data: prorated_categories.map((category) =>
            productlineproratedcount[category]
              ? productlineproratedcount[category].seats_purchased_count
              : 0
          ),
        },
        {
          name: "User Assigned ProRated",
          data: prorated_categories.map((category) =>
            productlineproratedcount[category]
              ? productlineproratedcount[category].users_assigned_prorated
              : 0
          ),
        },
        {
          name: "Seats In Use ProRated",
          data: prorated_categories.map((category) =>
            productlineproratedcount[category]
              ? productlineproratedcount[category].seats_in_use_prorated
              : 0
          ),
        },
      ],
    }),
    [prorated_categories]
  );

  // Retention Risk shows summary of the renewal risk for the subscription's contract
  const risk_category = riskcategory ? Object.keys(riskcategory) : [];
  const risk = useMemo(
    () => ({
      options: {
        chart: {
          type: "bar",
          height: 350,
          width: "100%",
          events: {
            click(event, chartContext, config) {
              const selectedColor = risk_category[config.dataPointIndex];
              let updatedColor = selectedColor;
              if (updatedColor) {
                handleBarClick(updatedColor);
              } else {
                console.log("no click data");
              }
            },
          },
        },

        xaxis: {
          categories: risk_category,
        },
        yaxis: {
          title: {
            text: "",
          },
        },
        dataLabels: {
          position: "top",
        },
      },
      series: [
        {
          name: "contracts",
          data: riskcategory
            ? Object.entries(riskcategory).map(([category, value]) => value)
            : [],
        },
      ],
    }),
    [riskcategory, risk_category]
  );

  //
  const handleOpenModel = (id, contractNumber) => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
    }));

    dispatch(getInsightMetricsContract({ id, contractNumber }));
  };
  // Table Data
  const columns = [
    {
      field: "id",
      headerName: "Serial No.",
      width: 120,
      renderCell: (params, index) => (
        <div>
          <span
            onClick={() =>
              handleOpenModel(params?.row.id, params?.row?.contractNumber)
            }
            className="action-button bg-white text-black px-3 py-1 rounded border-0"
          >
            {params?.value}
          </span>
        </div>
      ),
    },
    { field: "contractNumber", headerName: "Contract#", width: 150 },
    { field: "customerCSN", headerName: "customerCSN", width: 150 },
    {
      field: "bd_person",
      headerName: "BD Person Name",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.value && params.value ? (
            params.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "renewal_person",
      headerName: "Renewal Person Name",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.value && params.value ? (
            params.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "Account",
      headerName: "Account",
      width: 200,
      renderCell: (params) => {
        const { value: Account } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {Account?.length > maxChars ? Account : Account?.slice(0, maxChars)}
          </div>
        );
      },
    },
    {
      field: "AccountStatus",
      headerName: "Autodesk Account Status",
      width: 120,
    },
    {
      field: "contract_status",
      headerName: "Trisita Account Status",
      width: 120,
    },
    { field: "subs_end_date", headerName: "Subs End Date", width: 120 },
    {
      field: "branch",
      headerName: "Branch",
      width: 100,
      renderCell: (params) => (
        <div>
          {params.value && params.value ? (
            params.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    { field: "productLineCode", headerName: "productLineCode", width: 200 },
    { field: "seatsPurchased", headerName: "seatsPurchased", width: 200 },
    { field: "usersAssigned", headerName: "usersAssigned", width: 200 },
    { field: "seatsInUse", headerName: "seatsInUse", width: 200 },
    { field: "assignmentRate", headerName: "assignmentRate", width: 200 },
    { field: "utilisationRate", headerName: "utilisationRate", width: 200 },
    { field: "usageRate", headerName: "usageRate", width: 200 },
    { field: "riskCategory", headerName: "riskCategory", width: 200 },
    {
      field: "engagementCategory",
      headerName: "engagementCategory",
      width: 200,
    },
    { field: "tenantId", headerName: "tenantId", width: 200 },
  ];

  return (
    <>
      <div>
        <div className="insight-metrics-header">
          <div className="commom-header-title">User Insight Metrics</div>
          <div className="insight-filters">
            <Tooltip
              title={
                lastUpdated
                  ? moment(lastUpdated).format("MMMM D, YYYY [at] h:mm:ss A")
                  : ""
              }
              placement="top"
            >
              {" "}
              <span>Last Updated</span>
            </Tooltip>

            <CommonButton
              className="common-green-btn"
              onClick={() => {
                setFilters({
                  branch: null,
                  status: "All Status",
                  account: [],
                });
              }}
            >
              All
            </CommonButton>

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
              getOptionLabel={(option) => option?.label}
            />
            <CommonSelect
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                }));
              }}
              value={filters?.status}
              options={statusOption}
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
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              // sx={{ ml: 1 }}
                            >
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
        </div>
        <div className="insight-chart-container">
          {insightMetricsCustomerLoading ? (
            <SkeletonLoader isDashboard />
          ) : (
            <CommonChart
              title="Data of direct seat metrics i.e. 1:1 association between product pool and agreement (without prorated)"
              options={withoutProparated.options}
              series={withoutProparated.series}
            />
          )}
          {insightMetricsCustomerLoading ? (
            <SkeletonLoader isDashboard />
          ) : (
            <CommonChart
              title="Data of direct seat metrics i.e. 1:1 association between product pool and agreement (prorated)"
              options={withProparated.options}
              series={withProparated.series}
            />
          )}
          {insightMetricsCustomerLoading ? (
            <SkeletonLoader isDashboard />
          ) : (
            <CommonChart
              title="Retention Risk shows summary of the renewal risk for the subscription's contract"
              options={risk.options}
              series={risk.series}
            />
          )}
        </div>
        {insightMetricsCustomerLoading ? (
          <SkeletonLoader isDashboard />
        ) : (
          <div className="table-container">
            <ExportToExcel
              data={filteredData}
              columns={columns}
              fileName={`insight_trisita_${userDetail?.first_name}_${userDetail?.last_name}`}
              className="insight-export-btn"
            />
            <h3 className="common-insight-title">Table Data</h3>
            <CommonTable
              rows={filteredData}
              columns={columns}
              getRowId={getRowId}
              checkboxSelection
              toolbar
              exportFileName={`insight_trisita_${userDetail?.first_name}_${userDetail?.last_name}`}
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
          }));
        }}
        scrollable
        title={"Insight metrics contract detail"}
      >
        <InsightMetricsContract />
      </CommonModal>
    </>
  );
};

export default InsightMetrics;
