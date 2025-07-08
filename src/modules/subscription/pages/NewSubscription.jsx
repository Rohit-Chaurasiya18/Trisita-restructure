import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonModal from "@/components/common/modal/CommonModal";
import SubscriptionDetail from "../components/SubscriptionDetail";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNewSubscriptionData,
  getNewSubscriptionDetail,
} from "../slice/subscriptionSlice";
import { Autocomplete, TextField, Tooltip, Typography } from "@mui/material";
import CommonButton from "@/components/common/buttons/CommonButton";
import useDebounce from "@/hooks/useDebounce";
import ReactApexChart from "react-apexcharts";
import {
  getAllAccount,
  getAllBranch,
} from "@/modules/insightMetrics/slice/insightMetricsSlice";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import dayjs from "dayjs";
import moment from "moment";

const SetAction = () => {
  return (
    <>
      <div className="col-12 d-flex my-2">
        <div className="col-6 fw-bold">Subscription Acquired :</div>
        <div className="col-6">
          <Autocomplete
            disablePortal
            multiple
            options={[]}
            // value={filters?.account}
            getOptionLabel={(option) => option?.name}
            sx={{
              width: 300,
            }}
            onChange={(event, newValues) => {
              console.log(newValues);
            }}
            loading={false}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Type"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                      {false && (
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
      <div className="d-flex justify-content-center mt-4">
        <CommonButton
          className={"w-auto"}
          style={{ background: "rgb(21, 149, 221)" }}
        >
          Action
        </CommonButton>
      </div>
    </>
  );
};

const CommonChart = ({
  title,
  options,
  series,
  subCategory,
  className,
  onSubCategoryClick,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className={`insight-metrics-chart ${className}`}>
      <div className="chart-data">
        <div className="chart-data-header">
          <h3>{title}</h3>
          <div className="chart-data-subcategory">
            {subCategory?.map((item, index) => (
              <p
                key={index}
                onClick={() => {
                  onSubCategoryClick && onSubCategoryClick(index);
                  setSelectedIndex(index);
                }}
                className={`${index === selectedIndex && "active-subcategory"}`}
              >
                {item}
              </p>
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

const NewSubscription = () => {
  const dispatch = useDispatch();

  const {
    branch_list,
    branchListLoading,
    accountListLoading,
    account_list,
    filter,
    newSubscriptionLastUpdated,
    userDetail,
    newSubscriptionData,
    newSubscriptionDataLoading,
  } = useSelector((state) => ({
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    accountListLoading: state?.insightMetrics?.accountListLoading,
    account_list: state?.insightMetrics?.accountList,
    filter: state?.layout?.filter,
    userDetail: state?.login?.userDetail,
    newSubscriptionLastUpdated: state?.subscription?.newSubscriptionLastUpdated,
    newSubscriptionData: state?.subscription?.newSubscriptionData,
    newSubscriptionDataLoading: state?.subscription?.newSubscriptionDataLoading,
  }));

  const [filteredData, setFilteredData] = useState();
  const [barColor, setBarColor] = useState("");
  const [numberOfSeatsBar, setNumberOfSeatsBar] = useState("");
  const [accountGroupLegend, setAccountGroupLegend] = useState("");
  const [retentionRiskLegend, setRetentionRiskLegend] = useState("");
  const [accountTypeLegend, setAccountTypeLegend] = useState("");
  const [bdPersonLegend, setBdPersonLegend] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [filters, setFilters] = useState({
    account: [],
    branch: null,
    status: "All Status",
    startDate: "",
    endDate: "",
  });
  const [selectedId, setSelectedId] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    id: null,
    isAssign: false,
  });

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getAllAccount());
  }, []);

  const debounce = useDebounce(filters?.endDate, 500);

  const handleFetchData = async () => {
    let dateFilter;
    if (debounce) {
      dateFilter = {
        from_date: filters?.startDate,
        to_date: debounce,
      };
    } else {
      dateFilter = {
        from_date: null,
        to_date: null,
      };
    }
    let payload = {
      csn: filter?.csn === "All CSN" ? "" : filter?.csn,
      payload: dateFilter,
    };
    await dispatch(getNewSubscriptionData(payload));
  };

  useEffect(() => {
    handleFetchData();
  }, [filter?.csn, debounce]);

  const handleChange = (newValue) => {
    const [start, end] = newValue;
    setFilters((prev) => ({
      ...prev,
      startDate: start?.format("YYYY-MM-DD") || null,
      endDate: end ? end.format("YYYY-MM-DD") : "",
    }));

    setDateRange(newValue);
  };

  // Handle modal open
  const handleOpenModel = (id, isAssign = false) => {
    setModal({ show: true, id, isAssign });
    dispatch(getNewSubscriptionDetail({ id }));
  };

  // Table column definitions
  const columns = useMemo(
    () => [
      {
        field: "subscriptionReferenceNumber",
        headerName: "Subscription",
        width: 150,
        renderCell: (params) => (
          <span
            onClick={() => handleOpenModel(params?.row.id, false)}
            className="action-button bg-white text-black px-3 py-1 rounded border-0"
          >
            {params?.value}
          </span>
        ),
      },
      {
        field: "account_name",
        headerName: "Account Name",
        width: 200,
        renderCell: (params) => (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {params?.value}
          </div>
        ),
      },
      {
        field: "third_party",
        headerName: "Third Party Name",
        width: 200,
        renderCell: (params) => {
          const { value: third_party_name } = params;
          const maxChars = 20;

          return (
            <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
              {third_party_name?.length > maxChars
                ? third_party_name
                : third_party_name?.slice(0, maxChars)}
            </div>
          );
        },
      },
      { field: "part_number", headerName: "Part Number", width: 200 },
      { field: "account_csn", headerName: "Account CSN", width: 100 },
      {
        field: "bd_person",
        headerName: "BD Person Name",
        width: 200,
        renderCell: ({ value }) =>
          value ? value : <span style={{ color: "red" }}>Undefined</span>,
      },
      {
        field: "renewal_person",
        headerName: "Renewal Person Name",
        width: 200,
        renderCell: ({ value }) =>
          value ? value : <span style={{ color: "red" }}>Undefined</span>,
      },
      {
        field: "branch",
        headerName: "Branch",
        width: 100,
        renderCell: ({ value }) =>
          value ? value : <span style={{ color: "red" }}>Undefined</span>,
      },
      {
        field: "contract_manager_email",
        headerName: "Contract Mgr. Email",
        width: 200,
        renderCell: ({ value }) => (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>{value}</div>
        ),
      },
      { field: "account_type", headerName: "Account Type", width: 150 },
      { field: "seats", headerName: "Seats", width: 70 },
      { field: "startDate", headerName: "Subs Start Date", width: 130 },
      { field: "endDate", headerName: "Subs End Date", width: 130 },
      { field: "trisita_status", headerName: "Trisita Status", width: 130 },
      { field: "subscriptionStatus", headerName: "Status", width: 100 },
      {
        field: "lastPurchaseDate",
        headerName: "Last Purchase Date",
        width: 130,
      },
      { field: "account_group", headerName: "Account Group", width: 100 },
      {
        field: "subscriptionType",
        headerName: "Subscription Type",
        width: 100,
      },
      {
        field: "contract_end_date",
        headerName: "Contract End Date",
        width: 130,
      },
      {
        field: "acv_price",
        headerName: "Total ACV Price",
        width: 130,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "dtp_price",
        headerName: "Total DTP Price",
        width: 130,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "productLine",
        headerName: "Product Line",
        width: 250,
        renderCell: ({ value }) => (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>{value}</div>
        ),
      },
      {
        field: "created_date",
        headerName: "Created Date",
        width: 130,
        renderCell: ({ value }) => (
          <span>{new Date(value).toLocaleDateString()}</span>
        ),
      },
      {
        field: "action",
        headerName: "Action",
        width: 150,
        renderCell: (params) => (
          <span
            onClick={() => handleOpenModel(params?.row?.id, true)}
            className="assign-button text-black px-3 py-1 rounded border-0"
          >
            Assign Trigger
          </span>
        ),
      },
    ],
    []
  );

  const handleFilter = (Arr) => {
    let data = Arr;
    if (filters?.branch) {
      data = data?.filter((item) => item?.branch === filters?.branch?.label);
    }
    if (filters?.status !== "All Status") {
      data = data?.filter((item) => item?.trisita_status === filters?.status);
    }
    if (filters?.account?.length > 0) {
      data = data?.filter((item) => {
        const name = item["account_name"];
        return filters?.account.some(
          (value) =>
            name && name.toLowerCase().includes(value.label.toLowerCase())
        );
      });
    }
    return data;
  };

  useEffect(() => {
    let data = handleFilter(newSubscriptionData);
    setFilteredData(data);
  }, [newSubscriptionData]);

  useEffect(() => {
    if (
      filters?.account?.length > 0 ||
      filters?.status !== "All Status" ||
      filters?.branch
    ) {
      let data = handleFilter(newSubscriptionData);
      setFilteredData(data);
    } else {
      setFilteredData(newSubscriptionData);
    }
  }, [filters?.account, filters?.branch, filters?.status, newSubscriptionData]);

  // Chart click events
  const handleNumberOfSeatsClick = (data) => {
    let allData;
    const isSameColor = numberOfSeatsBar === data;
    if (isSameColor) {
      allData = handleFilter(newSubscriptionData);
    } else {
      allData = filteredData;
    }
    setNumberOfSeatsBar(isSameColor ? "" : data);
    let key;
    if (chartViewType === "byProductLine") {
      key = "productLineCode";
    } else if (chartViewType === "byAccountName") {
      key = "account_name";
    } else if (chartViewType === "byLastYear") {
      key = "lastPurchaseDate";
    }
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          key === "lastPurchaseDate"
            ? item[key]?.split("-")?.[0] === data
            : item[key] === data
        );
    setFilteredData(updatedData);
  };

  const handleAccountGroupLegendClick = (data) => {
    let allData;
    const isSameColor = accountGroupLegend === data;
    if (isSameColor) {
      allData = handleFilter(newSubscriptionData);
    } else {
      allData = filteredData;
    }
    setAccountGroupLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown"
            ? item?.account_group === data
            : !item?.account_group
        );

    setFilteredData(updatedData);
  };

  const handleAccountTypeLegendClick = (data) => {
    let allData;
    const isSameColor = accountTypeLegend === data;
    if (isSameColor) {
      allData = handleFilter(newSubscriptionData);
    } else {
      allData = filteredData;
    }
    setAccountTypeLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown" ? item?.account_type === data : !item?.account_type
        );

    setFilteredData(updatedData);
  };

  const handleBDPersonLegendClick = (data) => {
    let allData;
    const isSameColor = bdPersonLegend === data;
    if (isSameColor) {
      allData = handleFilter(newSubscriptionData);
    } else {
      allData = filteredData;
    }
    setBdPersonLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown"
            ? item?.bd_person_first_names?.includes(data)
            : item?.bd_person_first_names?.length === 0
        );

    setFilteredData(updatedData);
  };

  // Number of seats chart
  const [chartViewType, setChartViewType] = useState("byProductLine");

  const numberOfSeats = useMemo(() => {
    if (filteredData?.length > 0) {
      let aggregationMap = new Map();
      let groupKey;
      let truncateLabels = false;
      let rotateLabels = false;
      let sortDescending = true;

      // Determine grouping key based on chart view type
      if (chartViewType === "byAccountName") {
        groupKey = "account_name";
        truncateLabels = true;
        rotateLabels = true;
      } else if (chartViewType === "byLastYear") {
        groupKey = "lastPurchaseDate";
        sortDescending = false; // Sort years ascending
      } else {
        truncateLabels = true;
        rotateLabels = true;
        groupKey = "productLineCode"; // Default to product line
      }

      filteredData.forEach((item) => {
        let key;
        if (chartViewType === "byLastYear") {
          // Extract year from lastPurchaseDate
          if (item[groupKey]) {
            try {
              const year = new Date(item[groupKey]).getFullYear();
              if (!isNaN(year)) key = year.toString();
            } catch (e) {
              console.error("Invalid date format:", item[groupKey]);
            }
          }
        } else {
          key = item[groupKey];
        }

        if (!key) return; // Skip items without key

        const current = aggregationMap.get(key) || 0;
        aggregationMap.set(key, current + (item.seats || 0));
      });

      // Convert to array and sort
      let sortedData = Array.from(aggregationMap.entries()).map(
        ([key, total]) => ({ key, total })
      );

      if (chartViewType === "byLastYear") {
        // Sort years numerically in ascending order
        sortedData = sortedData.sort(
          (a, b) => parseInt(a.key) - parseInt(b.key)
        );
      } else {
        // Sort other views by total descending
        sortedData = sortedData.sort((a, b) => b.total - a.total);
      }

      // Take top 50 (except for years which are limited)
      const topData =
        chartViewType === "byLastYear" ? sortedData : sortedData.slice(0, 50);

      // Extract categories and data values
      const categories = topData.map((item) => item.key);
      const seriesData = topData.map((item) => item.total);
      return {
        options: {
          chart: {
            events: {
              // click(event, chartContext, config) {
              //   debugger;
              //   const clickedCategory =
              //     config?.config?.xaxis?.categories[config.dataPointIndex];
              //   if (clickedCategory) {
              //     handleNumberOfSeatsClick(clickedCategory);
              //   }
              // },
              xAxisLabelClick: function (event, chartContext, config) {
                const clickedCategory =
                  config?.config?.xaxis?.categories[config.labelIndex];
                if (clickedCategory) {
                  handleNumberOfSeatsClick(clickedCategory);
                }
              },
            },
            type: "bar",
            height: 350,
            width: "100%",
          },
          xaxis: {
            categories, // Will be populated with top 50 product codes
            labels: {
              rotate: rotateLabels ? -45 : 0,
              formatter: (value) => {
                // Truncate long labels
                if (truncateLabels && value.length > 20) {
                  return value.substring(0, 20) + "...";
                }
                return value;
              },
            },
          },
          yaxis: {
            title: { text: "Total Seats" },
          },
          dataLabels: {
            position: "top",
          },
        },
        series: [{ name: "seats", data: seriesData }],
      };
    } else {
      return {
        options: {
          chart: {
            events: {},
            type: "bar",
            height: 350,
            width: "100%",
          },
          xaxis: {
            categories: [], // Will be populated with top 50 product codes
            labels: {
              rotate: 0,
            },
          },
          noData: {
            text: "No data available",
            align: "center",
            verticalAlign: "middle",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: "#888",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
            },
          },
          yaxis: {
            title: { text: "Total Seats" },
          },
          dataLabels: {
            position: "top",
          },
        },
        series: [{ name: "seats", data: [] }],
      };
    }
  }, [filteredData, chartViewType]);

  const handleChartViewChange = (viewType) => {
    setChartViewType(viewType);
  };

  // Total Subscriptions as per Account Group
  const [accountGroupType, setAccountGroupType] = useState("subscription");

  const accountGroupBarChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const accountGroups = {};

      filteredData.forEach((item) => {
        const group = item?.account_group || "Unknown";

        // Initialize group if not exists
        if (!accountGroups[group]) {
          accountGroups[group] = {
            count: 0,
            dtp: 0,
            acv: 0,
          };
        }

        // Aggregate values
        accountGroups[group].count += 1;
        accountGroups[group].dtp += parseFloat(item.dtp_price) || 0;
        accountGroups[group].acv += parseFloat(item.acv_price) || 0;
      });

      // Convert to array for sorting
      const groupsArray = Object.entries(accountGroups).map(
        ([group, values]) => ({
          group,
          ...values,
        })
      );
      // Determine the key to sort by based on the selected view
      let sortKey;
      switch (accountGroupType) {
        case "dtp_price":
          sortKey = "dtp";
          break;
        case "acv_price":
          sortKey = "acv";
          break;
        case "subscription":
        default:
          sortKey = "count";
      }

      // Sort in descending order by the selected key
      groupsArray.sort((a, b) => b[sortKey] - a[sortKey]);

      // Extract labels and series from the sorted array
      const labels = groupsArray.map((item) => item.group);
      const series = groupsArray.map((item) =>
        parseFloat(item[sortKey].toFixed(2))
      );
      return {
        options: {
          chart: {
            type: "pie",
            height: 350,
            events: {
              legendClick: (chartContext, seriesIndex) => {
                const clickedLegend = labels[seriesIndex];
                if (clickedLegend) {
                  handleAccountGroupLegendClick(clickedLegend);
                }
              },
            },
          },
          labels: labels,
          legend: {
            position: "bottom",
            onItemClick: {
              toggleDataSeries: true, // Enable toggling of data series
            },
            onItemHover: {
              highlightDataSeries: true, // Highlight the hovered series
            },
            formatter: (seriesName, opts) => {
              const isHighlighted = seriesName === accountGroupLegend;
              const count = opts.w.globals.series[opts.seriesIndex];
              return `<span style="color: ${
                isHighlighted ? "black" : "black"
              };">${seriesName} - ${count}</span>`;
            },
          },
          plotOptions: {
            bar: {
              distributed: true, // Distribute colors across bars
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: "100%",
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
        series: series,
      };
    } else {
      return {
        options: {
          chart: {
            type: "pie",
            height: 350,
          },
          labels: [],
          noData: {
            text: "No data available",
            align: "center",
            verticalAlign: "middle",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: "#888",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
            },
          },
          legend: {
            position: "bottom",
            onItemClick: {
              toggleDataSeries: true, // Enable toggling of data series
            },
            onItemHover: {
              highlightDataSeries: true, // Highlight the hovered series
            },
          },
          plotOptions: {
            bar: {
              distributed: true, // Distribute colors across bars
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: "100%",
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
        series: [],
      };
    }
  }, [filteredData, accountGroupType]);

  const getAccountGroupTitle = () => {
    switch (accountGroupType) {
      case "dtp_price":
        return "Total DTP Price as per Account Group";
      case "acv_price":
        return "Total ACV Price as per Account Group";
      case "subscription":
      default:
        return "Total Subscriptions as per Account Group";
    }
  };

  const handleAccountGroupChange = (viewType) => {
    setAccountGroupType(viewType);
  };

  // Total Subscriptions as per Account Type
  const [accountType_Type, setAccountType_Type] = useState("subscription");

  const accountTypePieChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const accountTypeGroups = {};

      filteredData.forEach((item) => {
        const group = item?.account_type || "Unknown";

        // Initialize group if not exists
        if (!accountTypeGroups[group]) {
          accountTypeGroups[group] = {
            count: 0,
            dtp: 0,
            acv: 0,
          };
        }

        // Aggregate values
        accountTypeGroups[group].count += 1;
        accountTypeGroups[group].dtp += parseFloat(item.dtp_price) || 0;
        accountTypeGroups[group].acv += parseFloat(item.acv_price) || 0;
      });

      // Convert to arrays for the chart
      const labels = Object.keys(accountTypeGroups);
      let series;

      switch (accountType_Type) {
        case "dtp_price":
          series = labels.map((group) =>
            parseFloat(accountTypeGroups[group].dtp.toFixed(2))
          );
          break;
        case "acv_price":
          series = labels.map((group) =>
            parseFloat(accountTypeGroups[group].acv.toFixed(2))
          );
          break;
        case "subscription":
        default:
          series = labels.map((group) => accountTypeGroups[group].count);
      }

      // Optional: Sort data descending by value
      const sortedData = labels.map((label, index) => ({
        label,
        value: series[index],
      }));

      sortedData.sort((a, b) => b.value - a.value);

      const sortedLabels = sortedData.map((item) => item.label);
      const sortedSeries = sortedData.map((item) => item.value);

      return {
        options: {
          chart: {
            type: "pie",
            height: 350,
            events: {
              legendClick: (chartContext, seriesIndex) => {
                const clickedLegend = sortedLabels[seriesIndex];
                if (clickedLegend) {
                  handleAccountTypeLegendClick(clickedLegend);
                }
              },
            },
          },
          labels: sortedLabels,
          legend: {
            position: "bottom",
            onItemClick: {
              toggleDataSeries: true, // Enable toggling of data series
            },
            onItemHover: {
              highlightDataSeries: true, // Highlight the hovered series
            },
            formatter: (seriesName, opts) => {
              const isHighlighted = seriesName === accountTypeLegend;
              const count = opts.w.globals.series[opts.seriesIndex];
              return `<span style="color: ${
                isHighlighted ? "black" : "black"
              };">${seriesName} - ${count}</span>`;
            },
          },
          plotOptions: {
            bar: {
              distributed: true, // Distribute colors across bars
            },
          },
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
        series: sortedSeries,
      };
    } else {
      return {
        options: {
          chart: {
            type: "pie",
            height: 350,
          },
          labels: [],
          legend: {
            position: "bottom",
            onItemClick: {
              toggleDataSeries: true, // Enable toggling of data series
            },
            onItemHover: {
              highlightDataSeries: true, // Highlight the hovered series
            },
          },
          plotOptions: {
            bar: {
              distributed: true, // Distribute colors across bars
            },
          },
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
        series: [],
      };
    }
  }, [filteredData, accountType_Type]);

  const getAccountTypeTitle = () => {
    switch (accountType_Type) {
      case "dtp_price":
        return "Total DTP Price as per Account Type";
      case "acv_price":
        return "Total ACV Price as per Account Type";
      case "subscription":
      default:
        return "Total Subscriptions as per Account Type";
    }
  };

  const handleAccountTypeChange = (viewType) => {
    setAccountType_Type(viewType);
  };

  // Total Amount as per Months
  const chartData = useMemo(() => {
    const monthlyData = {};

    // Determine base month (start from selected startDate if available, else current month)
    const baseMonth = filters?.startDate ? dayjs(filters.startDate) : dayjs(); // fallback to current month

    // Start 2 months before current month
    for (let i = -2; i < 10; i++) {
      const monthKey = baseMonth.add(i, "month").format("YYYY-MM");
      monthlyData[monthKey] = { dtp_total: 0, acv_total: 0 };
    }

    // Aggregate DTP and ACV by endDate month
    (filteredData || []).forEach((sub) => {
      const endMonth = dayjs(sub?.endDate).format("YYYY-MM");
      if (monthlyData[endMonth]) {
        monthlyData[endMonth].dtp_total += Number(sub?.dtp_price) || 0;
        monthlyData[endMonth].acv_total += Number(sub?.acv_price) || 0;
      }
    });

    const categories = Object.keys(monthlyData);
    const dtpData = categories.map((month) =>
      parseFloat(monthlyData[month].dtp_total.toFixed(2))
    );
    const acvData = categories.map((month) =>
      parseFloat(monthlyData[month].acv_total.toFixed(2))
    );

    return { categories, dtpData, acvData };
  }, [filteredData, filters?.startDate]);

  // ApexCharts config
  const amountPerMonth = {
    options: {
      chart: { height: 350, type: "bar" },
      xaxis: {
        categories: chartData.categories,
        title: { text: "Months" },
      },
      yaxis: {
        title: { text: "Price" },
      },
      colors: ["#007BFF", "#FF5733"],
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "50%",
        },
      },
    },
    series: [
      { name: "DTP Price", data: chartData.dtpData },
      { name: "ACV Price", data: chartData.acvData },
    ],
  };

  // Total Subscriptions as per BD Person
  const [bdPersonType, setBdPersonType] = useState("subscription");

  const bdPersonPieChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by BD person based on selected type
      const bdPersonGroups = {};

      filteredData.forEach((item) => {
        const bdPersons =
          item?.bd_person_first_names?.length > 0
            ? item.bd_person_first_names
            : ["Unknown"]; // Treat empty array as "Unknown"

        bdPersons.forEach((person) => {
          const normalizedPerson = person.trim().toLowerCase(); // Normalize names to avoid duplicates due to case sensitivity

          // Initialize group if not exists
          if (!bdPersonGroups[normalizedPerson]) {
            bdPersonGroups[normalizedPerson] = {
              name: person, // Keep original name for display
              count: 0,
              dtp: 0,
              acv: 0,
            };
          }

          // Aggregate values
          bdPersonGroups[normalizedPerson].count += 1;
          bdPersonGroups[normalizedPerson].dtp +=
            parseFloat(item.dtp_price) || 0;
          bdPersonGroups[normalizedPerson].acv +=
            parseFloat(item.acv_price) || 0;
        });
      });

      // Convert to arrays for the chart
      const groupValues = Object.values(bdPersonGroups);

      let series;
      switch (bdPersonType) {
        case "dtp_price":
          series = groupValues.map((group) => parseFloat(group.dtp.toFixed(2)));
          break;
        case "acv_price":
          series = groupValues.map((group) => parseFloat(group.acv.toFixed(2)));
          break;
        case "subscription":
        default:
          series = groupValues.map((group) => group.count);
      }

      const labels = groupValues.map((group) => group.name);

      // Sort labels and series by value
      const sortedData = labels.map((label, index) => ({
        label,
        value: series[index],
      }));

      sortedData.sort((a, b) => b.value - a.value);

      const sortedLabels = sortedData.map((item) => item.label);
      const sortedSeries = sortedData.map((item) => item.value);
      return {
        options: {
          chart: {
            type: "pie",
            height: 350,
            events: {
              legendClick: (chartContext, seriesIndex) => {
                const clickedLegend = sortedLabels[seriesIndex];
                if (clickedLegend) {
                  // Handle legend click if needed
                  handleBDPersonLegendClick(clickedLegend);
                }
              },
            },
          },
          labels: sortedLabels,
          legend: {
            position: "bottom",
            onItemClick: {
              toggleDataSeries: true, // Enable toggling of data series
            },
            onItemHover: {
              highlightDataSeries: true, // Highlight the hovered series
            },
            formatter: (seriesName, opts) => {
              const count = opts.w.globals.series[opts.seriesIndex];
              const isHighlighted = seriesName === bdPersonLegend;
              return `<span style="color: ${
                isHighlighted ? "black" : "black"
              };">${seriesName} - ${count}</span>`;
            },
          },
          plotOptions: {
            pie: {
              distributed: true, // Distribute colors across slices
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: "100%",
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
        series: sortedSeries,
      };
    } else {
      return {
        options: {
          chart: {
            type: "pie",
            height: 350,
          },
          labels: [],
          noData: {
            text: "No data available",
            align: "center",
            verticalAlign: "middle",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: "#888",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
            },
          },
          legend: {
            position: "bottom",
            formatter: (seriesName, opts) => {
              const count = opts.w.globals.series[opts.seriesIndex];
              const isHighlighted = seriesName === bdPersonLegend;
              return `<span style="color: ${
                isHighlighted ? "black" : "black"
              };">${seriesName} - ${count}</span>`;
            },
            onItemClick: {
              toggleDataSeries: true, // Enable toggling of data series
            },
            onItemHover: {
              highlightDataSeries: true, // Highlight the hovered series
            },
          },
          plotOptions: {
            pie: {
              distributed: true, // Distribute colors across slices
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: "100%",
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
        series: [],
      };
    }
  }, [filteredData, bdPersonType]);

  const getBdPersonTitle = () => {
    switch (bdPersonType) {
      case "dtp_price":
        return "Total DTP Price as per BD Person";
      case "acv_price":
        return "Total ACV Price as per BD Person";
      case "subscription":
      default:
        return "Total Subscriptions as per BD Person";
    }
  };

  const handleBdPersonChange = (viewType) => {
    setBdPersonType(viewType);
  };

  return (
    <>
      <div>
        <div className="subscription-header">
          <h5 className="commom-header-title mb-0">
            New Subscription Data (Newest)
          </h5>
          <div className="subscription-filter">
            <Tooltip
              title={
                newSubscriptionLastUpdated
                  ? moment(newSubscriptionLastUpdated).format(
                      "MMMM D, YYYY [at] h:mm:ss A"
                    )
                  : ""
              }
              placement="top"
            >
              <span>Last Updated</span>
            </Tooltip>
            <CommonButton
              className="common-green-btn"
              onClick={() => {
                setFilters({
                  account: [],
                  branch: null,
                  status: "All Status",
                  startDate: null,
                  endDate: null,
                });
                setBarColor("");
              }}
            >
              All
            </CommonButton>

            <CommonDateRangePicker
              value={dateRange}
              onChange={handleChange}
              width="180px"
              placeholderStart="Start date"
              placeholderEnd="End date"
              disabled={newSubscriptionDataLoading}
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
              value={filters?.status}
              options={[
                { value: "All Status", label: "All Status" },
                { value: "Active", label: "Active" },
                { value: "Expired", label: "Expired" },
              ]}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  status: e?.target?.value,
                }));
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
          <div className="subscription-chart number-of-seasts-chart">
            {newSubscriptionDataLoading ? (
              <SkeletonLoader />
            ) : (
              <CommonChart
                title={
                  chartViewType === "byProductLine"
                    ? "Trend of number of seats purchased by product line code"
                    : chartViewType === "byAccountName"
                    ? "Trend of number of seats purchased by account name"
                    : "Trend of number of seats purchased by last purchase year"
                }
                options={numberOfSeats?.options}
                series={numberOfSeats?.series}
                subCategory={[
                  "By Product line",
                  "By Account names",
                  "By Team names",
                  "By Last Purchase Year",
                ]}
                onSubCategoryClick={(index) => {
                  if (index === 0) handleChartViewChange("byProductLine");
                  if (index === 1) handleChartViewChange("byAccountName");
                  if (index === 3) handleChartViewChange("byLastYear");
                }}
              />
            )}
            {newSubscriptionDataLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="account-industry-chart-2 mt-4 new-subs-amountPerMonth">
                <CommonChart
                  title="Total Amount as per Months"
                  options={amountPerMonth.options}
                  series={amountPerMonth.series}
                  className="chart-data-2"
                />
              </div>
            )}
            {newSubscriptionDataLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="account-industry-chart-2 mt-4">
                <CommonChart
                  title={getAccountGroupTitle()}
                  options={accountGroupBarChart?.options}
                  series={accountGroupBarChart?.series}
                  className="chart-data-1"
                  subCategory={["Subscription", "DTP", "ACV"]}
                  onSubCategoryClick={(index) => {
                    if (index === 0) handleAccountGroupChange("subscription");
                    if (index === 1) handleAccountGroupChange("dtp_price");
                    if (index === 2) handleAccountGroupChange("acv_price");
                  }}
                />
                <div className="chart-section">
                  <CommonChart
                    title={getBdPersonTitle()}
                    options={bdPersonPieChart?.options}
                    series={bdPersonPieChart?.series}
                    className="chart-data-2"
                    subCategory={["Subscription", "DTP", "ACV"]}
                    onSubCategoryClick={(index) => {
                      if (index === 0) handleBdPersonChange("subscription");
                      if (index === 1) handleBdPersonChange("dtp_price");
                      if (index === 2) handleBdPersonChange("acv_price");
                    }}
                  />
                  <CommonChart
                    title={getAccountTypeTitle()}
                    options={accountTypePieChart?.options}
                    series={accountTypePieChart?.series}
                    className="chart-data-2"
                    subCategory={["Subscription", "DTP", "ACV"]}
                    onSubCategoryClick={(index) => {
                      if (index === 0) handleAccountTypeChange("subscription");
                      if (index === 1) handleAccountTypeChange("dtp_price");
                      if (index === 2) handleAccountTypeChange("acv_price");
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {newSubscriptionDataLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="subscription-table">
              <CommonTable
                rows={filteredData}
                columns={columns}
                getRowId={getRowId}
                checkboxSelection
                toolbar
                exportFileName={`subs_trisita`}
              />
            </div>
          )}
        </div>
      </div>
      <CommonModal
        isOpen={modal.show}
        handleClose={() => setModal({ show: false, id: null, isAssign: false })}
        scrollable
        title={modal.isAssign ? "Set Action" : "New Subscription Detail"}
      >
        {modal?.isAssign ? <SetAction /> : <SubscriptionDetail />}
      </CommonModal>
    </>
  );
};

export default NewSubscription;
