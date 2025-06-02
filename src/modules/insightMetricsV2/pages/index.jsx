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
  getInsightMetricsV2,
  getInsightMetricsV2Contract,
} from "../slice/insightMetricsV2Slice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { Autocomplete, TextField, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import CommonModal from "@/components/common/modal/CommonModal";
import InsightMetricsContract from "../components/InsightMetricsContract";
import {
  getAllAccount,
  getAllBranch,
} from "@/modules/insightMetrics/slice/insightMetricsSlice";

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

const InsightMetricsV2 = () => {
  const dispatch = useDispatch();
  const {
    accountListLoading,
    account_list,
    branchListLoading,
    branch_list,
    filter,
    lastUpdated,
    insightMetricsCustomerV2Loading,
    insightMetricsCustomerV2,
    userDetail,
  } = useSelector((state) => ({
    filter: state?.layout?.filter,
    accountListLoading: state?.insightMetrics?.accountListLoading,
    account_list: state?.insightMetrics?.accountList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    branch_list: state?.insightMetrics?.branchList,
    lastUpdated: state?.insightMetricsV2?.lastUpdated,
    insightMetricsCustomerV2Loading:
      state?.insightMetricsV2?.insightMetricsCustomerV2Loading,
    insightMetricsCustomerV2: state?.insightMetricsV2?.insightMetricsCustomerV2,
    userDetail: state?.login?.userDetail,
  }));

  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [productlinecount, SetProductLineCount] = useState();
  const [riskcategory, SetRiskCategory] = useState();
  const [filters, setFilters] = useState({
    branch: null,
    status: "All Status",
    account: [],
    barColor: "",
  });
  const [modal, setModal] = useState({
    isOpen: false,
  });

  // Hanlde Filtered Data
  const handleFilterData = (data) => {
    let allData = data;
    if (filters?.branch?.value) {
      allData = allData?.filter(
        (item) => item?.branch === filters?.branch?.label
      );
    }
    if (filters?.status !== "All Status") {
      allData = allData?.filter(
        (item) =>
          item?.contract_status?.toString()?.toLowerCase() ===
          filters?.status?.toString()?.toLowerCase()
      );
    }
    if (filters?.account?.length > 0) {
      allData = allData?.filter((item) => {
        const name = item["Account"];
        return filters?.account.some(
          (value) =>
            name && name.toLowerCase().includes(value.label.toLowerCase())
        );
      });
    }
    return allData;
  };

  useEffect(() => {
    if (
      filters?.branch?.label ||
      filters?.status ||
      filters?.account?.length > 0
    ) {
      let data = handleFilterData(insightMetricsCustomerV2);
      setFilteredData(data);
    } else {
      setFilteredData(insightMetricsCustomerV2);
    }
  }, [filters?.account, filters?.branch, filters?.status]);

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getAllAccount());
  }, []);

  useEffect(() => {
    setFilteredData(insightMetricsCustomerV2);
  }, [insightMetricsCustomerV2]);

  useEffect(() => {
    dispatch(
      getInsightMetricsV2({ id: filter?.csn === "All CSN" ? "" : filter?.csn })
    );
  }, [filter?.csn]);

  const getRowId = (row) => row.id;

  const handleBarClick = (data) => {
    const allData = handleFilterData(insightMetricsCustomerV2);
    const isSameColor = filters?.barColor === data;

    setFilters((prev) => ({
      ...prev,
      barColor: isSameColor ? "" : data,
    }));

    const updatedData = isSameColor
      ? allData
      : allData.filter((item) => item?.riskCategory === data);

    setFilteredData(updatedData);
    // const allData = handleFilterData(insightMetricsCustomerV2);
    // const updatedData = allData?.filter((item) => item?.riskCategory === data);
    // setFilteredData(updatedData);
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

    const allData = handleFilterData(insightMetricsCustomerV2);
    const risk_counting = allData?.reduce((accumulator, item) => {
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
    }, {});

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

  // Hanlde Modal Pop-up
  const handleOpenModel = (id, contractNumber) => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
    }));

    dispatch(getInsightMetricsV2Contract({ id, contractNumber }));
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
  const handleSelectionChange = (selectedRows) => {
    const idArray = [...selectedRows?.ids];
    if (idArray?.length > 0) {
      setSelectedId(idArray);
    } else {
      setSelectedId([]);
    }
  };

  const exportedData = useMemo(
    () => filteredData?.filter((item) => selectedId.includes(item?.id)),
    [selectedId]
  );
  return (
    <>
      <div>
        <div className="insight-metrics-header">
          <div className="commom-header-title">User Insight Metrics V2</div>
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
          {insightMetricsCustomerV2Loading ? (
            <SkeletonLoader isDashboard />
          ) : (
            <CommonChart
              title="Data of direct seat metrics i.e. 1:1 association between product pool and agreement (without prorated)"
              options={withoutProparated.options}
              series={withoutProparated.series}
            />
          )}
          {insightMetricsCustomerV2Loading ? (
            <SkeletonLoader isDashboard />
          ) : (
            <CommonChart
              title="Retention Risk shows summary of the renewal risk for the subscription's contract"
              options={risk.options}
              series={risk.series}
            />
          )}
        </div>
        {insightMetricsCustomerV2Loading ? (
          <SkeletonLoader isDashboard />
        ) : (
          <div className="table-container">
            <ExportToExcel
              data={exportedData}
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
              handleRowSelection={handleSelectionChange}
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

export default InsightMetricsV2;
