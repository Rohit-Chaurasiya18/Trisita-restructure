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
  getSubscriptionAcquiredType,
  getUpdateSubscriptionAcquired,
} from "../slice/subscriptionSlice";
import { Autocomplete, TextField, Tooltip, Typography } from "@mui/material";
import CommonButton from "@/components/common/buttons/CommonButton";
import useDebounce from "@/hooks/useDebounce";
import {
  getAllAccount,
  getAllBranch,
} from "@/modules/insightMetrics/slice/insightMetricsSlice";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import dayjs from "dayjs";
import moment from "moment";
import CommonChart from "@/components/common/chart/CommonChart";
import {
  getEmptyBarChartConfig,
  getEmptyPieChartConfig,
  userType,
} from "@/constants";
import { toast } from "react-toastify";

const SetAction = ({
  id,
  handleClose,
  subscription_acquired_type_id,
  handleFallback,
}) => {
  const dispatch = useDispatch();
  const [subscriptionAcquiredType, setSubscriptionAcquiredType] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  useEffect(() => {
    dispatch(getSubscriptionAcquiredType()).then((res) => {
      if (res?.payload?.status === 200) {
        setSubscriptionAcquiredType(
          res?.payload?.data?.map((i) => ({
            value: i?.id,
            label: i?.name,
          }))
        );
      }
    });
  }, []);
  const handleAction = () => {
    dispatch(
      getUpdateSubscriptionAcquired({
        subscription_id: id,
        subscription_acquired_type: selectedType,
      })
    ).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success("Subscription Acquired Type Updated Successfully");
      }
      handleClose();
      handleFallback(
        id,
        subscriptionAcquiredType?.find((i) => i.value === selectedType)
      );
    });
  };
  useEffect(() => {
    if (subscription_acquired_type_id) {
      setSelectedType(subscription_acquired_type_id);
    }
  }, [subscription_acquired_type_id]);
  return (
    <>
      <div className="col-12 d-flex my-2">
        <div className="col-6 fw-bold">Subscription Acquired :</div>
        <div className="col-6">
          <Autocomplete
            options={subscriptionAcquiredType || []}
            value={
              subscriptionAcquiredType?.find((i) => i.value === selectedType) ||
              null
            }
            getOptionLabel={(option) => option?.label}
            sx={{
              width: 300,
            }}
            onChange={(event, newValues) => {
              setSelectedType(newValues?.value);
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
          style={{
            background: selectedType
              ? "rgb(21, 149, 221)"
              : "rgb(192, 205, 212)",
          }}
          isDisabled={!selectedType}
          onClick={() => {
            handleAction();
          }}
        >
          Action
        </CommonButton>
      </div>
    </>
  );
};

const NewSubscription = () => {
  const dispatch = useDispatch();

  const {
    branch_list,
    branchListLoading,
    accountListLoading,
    account_list,
    filter,
    newSubscriptionLastUpdated,
    newSubscriptionData,
    newSubscriptionDataLoading,
    userDetail,
  } = useSelector((state) => ({
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    accountListLoading: state?.insightMetrics?.accountListLoading,
    account_list: state?.insightMetrics?.accountList,
    filter: state?.layout?.filter,
    newSubscriptionLastUpdated: state?.subscription?.newSubscriptionLastUpdated,
    newSubscriptionData: state?.subscription?.newSubscriptionData,
    newSubscriptionDataLoading: state?.subscription?.newSubscriptionDataLoading,
    userDetail: state?.login?.userDetail,
  }));

  const [subscriptionAcquiredType, setSubscriptionAcquiredType] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const [numberOfSeatsBar, setNumberOfSeatsBar] = useState("");
  const [accountGroupLegend, setAccountGroupLegend] = useState("");
  const [accountTypeLegend, setAccountTypeLegend] = useState("");
  const [bdPersonLegend, setBdPersonLegend] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [filters, setFilters] = useState({
    account: [],
    branch: null,
    status: "All Status",
    startDate: "",
    endDate: "",
    subscriptionAcquire: "All",
  });
  const [modal, setModal] = useState({
    show: false,
    id: null,
    isAssign: false,
    subscription_acquired_type_id: null,
  });
  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getAllAccount());
  }, []);

  useEffect(() => {
    dispatch(getSubscriptionAcquiredType()).then((res) => {
      if (res?.payload?.status === 200) {
        setSubscriptionAcquiredType([
          { value: "All", label: "All" }, // 👈 extra option at index 0
          ...res?.payload?.data?.map((i) => ({
            value: i?.id,
            label: i?.name,
          })),
        ]);
      }
    });
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
  const handleOpenModel = (
    id,
    isAssign = false,
    subscription_acquired_type_id
  ) => {
    setModal({
      show: true,
      id,
      isAssign,
      subscription_acquired_type_id: subscription_acquired_type_id,
    });
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
            onClick={() =>
              handleOpenModel(
                params?.row.id,
                false,
                params?.row?.subscription_acquired_type_id
              )
            }
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
        renderCell: (params) => <div>{params?.value}</div>,
      },
      { field: "account_csn", headerName: "Account CSN", width: 200 },
      { field: "part_number", headerName: "Part Number", width: 200 },
      ...(userDetail?.user_type !== userType.client
        ? [
            { field: "industry", headerName: "Industry", width: 200 },
            { field: "segment", headerName: "Segment", width: 200 },
            { field: "sub_segment", headerName: "Sub Segment", width: 200 },
            {
              field: "third_party",
              headerName: "Third Party Name",
              width: 200,
              renderCell: (params) => {
                const { value: third_party_name } = params;
                return <div>{third_party_name}</div>;
              },
            },
            {
              field: "branch",
              headerName: "Branch",
              width: 100,
              renderCell: ({ value }) =>
                value ? value : <span style={{ color: "red" }}>Undefined</span>,
            },
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
            { field: "account_type", headerName: "Account Type", width: 150 },
          ]
        : []),
      {
        field: "contract_manager_email",
        headerName: "Contract Mgr. Email",
        width: 200,
        renderCell: ({ value }) => <div>{value}</div>,
      },
      {
        field: "contract_term",
        headerName: "Contract Term",
        width: 200,
        renderCell: ({ value }) => <div>{value}</div>,
      },
      { field: "seats", headerName: "Seats", width: 70 },
      {
        field: "startDate",
        headerName: "Subs Start Date",
        width: 200,
        renderCell: (params) => (
          <>{params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}</>
        ),
      },
      {
        field: "endDate",
        headerName: "Subs End Date",
        width: 200,
        renderCell: (params) => (
          <>{params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}</>
        ),
      },
      { field: "trisita_status", headerName: "Trisita Status", width: 200 },
      {
        field: "lastPurchaseDate",
        headerName: "Last Purchase Date",
        width: 200,
        renderCell: (params) => (
          <>{params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}</>
        ),
      },

      { field: "account_group", headerName: "Account Group", width: 200 },

      {
        field: "subscriptionType",
        headerName: "Subscription Type",
        width: 200,
      },
      {
        field: "contract_end_date",
        headerName: "Contract End Date",
        width: 200,
        renderCell: (params) => (
          <>{params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}</>
        ),
      },
      { field: "productLineCode", headerName: "Product Line Code", width: 200 },
      {
        field: "productLine",
        headerName: "Product Line",
        width: 250,
        renderCell: ({ value }) => <div>{value}</div>,
      },
      {
        field: "created_date",
        headerName: "Created Date",
        width: 130,
        renderCell: ({ value }) => (
          <span>{new Date(value).toLocaleDateString()}</span>
        ),
      },
      ...(userDetail?.user_type !== userType.client
        ? [
            { field: "subscriptionStatus", headerName: "Status", width: 100 },
            {
              field: "subscription_acquired_types",
              headerName: "Subscription Acquired Type",
              width: 200,
            },
            {
              field: "acv_price",
              headerName: "Total ACV Price",
              width: 130,
              renderCell: (params) => (
                <div>{Number(params.value).toFixed(2)}</div>
              ),
              sortComparator: (v1, v2) => Number(v1) - Number(v2),
            },
            {
              field: "dtp_price",
              headerName: "Total DTP Price",
              width: 130,
              renderCell: (params) => (
                <div>{Number(params.value).toFixed(2)}</div>
              ),
              sortComparator: (v1, v2) => Number(v1) - Number(v2),
            },
            {
              field: "action",
              headerName: "Action",
              width: 150,
              renderCell: (params) => (
                <span
                  onClick={() =>
                    handleOpenModel(
                      params?.row?.id,
                      true,
                      params?.row?.subscription_acquired_type_id
                    )
                  }
                  className="assign-button text-black px-3 py-1 rounded border-0"
                >
                  Assign Trigger
                </span>
              ),
            },
          ]
        : []),
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
    if (filters?.subscriptionAcquire !== "All") {
      data = data?.filter(
        (item) =>
          item?.subscription_acquired_type_id === filters?.subscriptionAcquire
      );
    }
    if (filters?.account?.length > 0) {
      // data = data?.filter((item) => {
      //   const name = item["account_name"];
      //   return filters?.account.some(
      //     (value) =>
      //       name && name.toLowerCase().includes(value.label.toLowerCase())
      //   );
      // });
      data = data?.filter((item) => {
        const name = item["account_csn"];
        return filters?.account.some((value) => name === value.csn);
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
      filters?.subscriptionAcquire !== "All" ||
      filters?.branch
    ) {
      let data = handleFilter(newSubscriptionData);
      setFilteredData(data);
    } else {
      setFilteredData(newSubscriptionData);
    }
  }, [
    filters?.account,
    filters?.branch,
    filters?.status,
    filters?.subscriptionAcquire,
    newSubscriptionData,
  ]);

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
      let sortDescending;

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
      return getEmptyBarChartConfig();
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
      return getEmptyPieChartConfig();
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
      return getEmptyPieChartConfig();
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
    const baseMonth = filters?.endDate ? dayjs(filters.endDate) : dayjs(); // fallback to current month

    // Previous 12 months
    for (let i = 11; i >= 0; i--) {
      const monthKey = baseMonth.subtract(i, "month").format("YYYY-MM");
      monthlyData[monthKey] = { seats_total: 0, dtp_total: 0, acv_total: 0 };
    }

    // Aggregate DTP and ACV by endDate month
    (filteredData || []).forEach((sub) => {
      const endMonth = dayjs(sub?.lastPurchaseDate).format("YYYY-MM");
      if (monthlyData[endMonth]) {
        if (userDetail?.user_type === userType.client) {
          monthlyData[endMonth].seats_total += Number(sub?.seats) || 0;
        } else {
          monthlyData[endMonth].dtp_total += Number(sub?.dtp_price) || 0;
          monthlyData[endMonth].acv_total += Number(sub?.acv_price) || 0;
        }
      }
    });

    const categories = Object.keys(monthlyData);
    // const dtpData = categories.map((month) =>
    //   parseFloat(monthlyData[month].dtp_total.toFixed(2))
    // );
    // const acvData = categories.map((month) =>
    //   parseFloat(monthlyData[month].acv_total.toFixed(2))
    // );

    // return { categories, dtpData, acvData };
    if (userDetail?.user_type === userType.client) {
      return {
        categories,
        series: [
          {
            name: "Total Seats",
            data: categories.map((m) => monthlyData[m].seats_total),
          },
        ],
      };
    } else {
      return {
        categories,
        series: [
          {
            name: "DTP Price",
            data: categories.map((m) =>
              parseFloat(monthlyData[m].dtp_total.toFixed(2))
            ),
          },
          {
            name: "ACV Price",
            data: categories.map((m) =>
              parseFloat(monthlyData[m].acv_total.toFixed(2))
            ),
          },
        ],
      };
    }
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
        title: {
          text: userDetail?.user_type === userType.client ? "Seats" : "Price",
        },
      },
      colors:
        userDetail?.user_type === userType.client
          ? ["#007BFF"]
          : ["#007BFF", "#FF5733"],
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "50%",
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
    series: chartData.series,
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
      return getEmptyPieChartConfig();
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

  // Total Subscription as per Industry
  const [industryType, setIndustryType] = useState("subscription");
  const [industryLegend, setindustryLegend] = useState("");

  const handleIndustryLegendClick = (data) => {
    let allData;
    const isSameColor = industryLegend === data;
    if (isSameColor) {
      allData = handleFilter(newSubscriptionData);
    } else {
      allData = filteredData;
    }
    setindustryLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) => item?.industry === data);

    setFilteredData(updatedData);
  };
  const industryBarChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const industryGroups = {};
      filteredData.forEach((item) => {
        const group = item?.industry;
        // Initialize group if not exists
        if (!industryGroups[group]) {
          industryGroups[group] = {
            count: 0,
            dtp: 0,
            acv: 0,
          };
        }
        // Aggregate values
        industryGroups[group].count += 1;
        industryGroups[group].dtp += parseFloat(item.dtp_price) || 0;
        industryGroups[group].acv += parseFloat(item.acv_price) || 0;
      });
      // Convert to arrays for the chart
      const labels = Object.keys(industryGroups);
      let series;

      switch (industryType) {
        case "dtp_price":
          series = labels.map((group) =>
            parseFloat(industryGroups[group].dtp.toFixed(2))
          );
          break;
        case "acv_price":
          series = labels.map((group) =>
            parseFloat(industryGroups[group].acv.toFixed(2))
          );
          break;
        case "subscription":
        default:
          series = labels.map((group) => industryGroups[group].count);
      }

      // Optional: sort labels and series based on value
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
                  handleIndustryLegendClick(clickedLegend);
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
              const isHighlighted = seriesName === industryLegend;
              const count = opts.w.globals.series[opts.seriesIndex];
              return `<span style="color: ${
                isHighlighted ? "black" : "black"
              };">${seriesName} - ${count}</span>`;
            },
          },
          plotOptions: {
            pie: {
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
      return getEmptyPieChartConfig();
    }
  }, [filteredData, industryType]);

  const handleIndustryChange = (viewType) => {
    setIndustryType(viewType);
  };

  // Total Subscription as per Segment
  const [segmentType, setSegmentType] = useState("subscription");
  const [segmentLegend, setSegmentLegend] = useState("");

  const handleSegmentLegendClick = (data) => {
    let allData;
    const isSameColor = segmentLegend === data;
    if (isSameColor) {
      allData = handleFilter(newSubscriptionData);
    } else {
      allData = filteredData;
    }
    setSegmentLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) => item?.segment === data);

    setFilteredData(updatedData);
  };
  const segmentBarChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const segmentGroups = {};
      filteredData.forEach((item) => {
        const group = item?.segment;
        // Initialize group if not exists
        if (!segmentGroups[group]) {
          segmentGroups[group] = {
            count: 0,
            dtp: 0,
            acv: 0,
          };
        }
        // Aggregate values
        segmentGroups[group].count += 1;
        segmentGroups[group].dtp += parseFloat(item.dtp_price) || 0;
        segmentGroups[group].acv += parseFloat(item.acv_price) || 0;
      });
      // Convert to arrays for the chart
      const labels = Object.keys(segmentGroups);
      let series;

      switch (segmentType) {
        case "dtp_price":
          series = labels.map((group) =>
            parseFloat(segmentGroups[group].dtp.toFixed(2))
          );
          break;
        case "acv_price":
          series = labels.map((group) =>
            parseFloat(segmentGroups[group].acv.toFixed(2))
          );
          break;
        case "subscription":
        default:
          series = labels.map((group) => segmentGroups[group].count);
      }

      // Optional: sort labels and series based on value
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
                  handleSegmentLegendClick(clickedLegend);
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
              const isHighlighted = seriesName === segmentLegend;
              const count = opts.w.globals.series[opts.seriesIndex];
              return `<span style="color: ${
                isHighlighted ? "black" : "black"
              };">${seriesName} - ${count}</span>`;
            },
          },
          plotOptions: {
            pie: {
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
        series: sortedSeries,
      };
    } else {
      return getEmptyPieChartConfig();
    }
  }, [filteredData, segmentType]);

  const handleSegmentChange = (viewType) => {
    setSegmentType(viewType);
  };

  // Total Subscription as per Sub Segment
  const [subSegmentType, setSubSegmentType] = useState("subscription");
  const [subSegmentLegend, setSubSegmentLegend] = useState("");

  const handleSubSegmentLegendClick = (data) => {
    let allData;
    const isSameColor = subSegmentLegend === data;
    if (isSameColor) {
      allData = handleFilter(newSubscriptionData);
    } else {
      allData = filteredData;
    }
    setSubSegmentLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) => item?.sub_segment === data);

    setFilteredData(updatedData);
  };
  const subSegmentBarChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const subSegmentGroups = {};
      filteredData.forEach((item) => {
        const group = item?.sub_segment;
        // Initialize group if not exists
        if (!subSegmentGroups[group]) {
          subSegmentGroups[group] = {
            count: 0,
            dtp: 0,
            acv: 0,
          };
        }
        // Aggregate values
        subSegmentGroups[group].count += 1;
        subSegmentGroups[group].dtp += parseFloat(item.dtp_price) || 0;
        subSegmentGroups[group].acv += parseFloat(item.acv_price) || 0;
      });

      // Convert to arrays for the chart
      const labels = Object.keys(subSegmentGroups);
      let series;

      switch (subSegmentType) {
        case "dtp_price":
          series = labels.map((group) =>
            parseFloat(subSegmentGroups[group].dtp.toFixed(2))
          );
          break;
        case "acv_price":
          series = labels.map((group) =>
            parseFloat(subSegmentGroups[group].acv.toFixed(2))
          );
          break;
        case "subscription":
        default:
          series = labels.map((group) => subSegmentGroups[group].count);
      }

      // Optional: sort labels and series based on value
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
                  handleSubSegmentLegendClick(clickedLegend);
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
              const isHighlighted = seriesName === subSegmentLegend;
              const count = opts.w.globals.series[opts.seriesIndex];
              return `<span style="color: ${
                isHighlighted ? "black" : "black"
              };">${seriesName} - ${count}</span>`;
            },
          },
          plotOptions: {
            pie: {
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
        series: sortedSeries,
      };
    } else {
      return getEmptyPieChartConfig();
    }
  }, [filteredData, subSegmentType]);

  const handleSubSegmentChange = (viewType) => {
    setSubSegmentType(viewType);
  };
  const handleFallback = (id, selectedType) => {
    const updatedData = filteredData?.map((item) =>
      item?.id === id
        ? {
            ...item,
            subscription_acquired_type_id: selectedType?.value,
            subscription_acquired_types: selectedType?.label,
          }
        : { ...item }
    );
    setFilteredData(updatedData);
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
                setDateRange([null, null]);
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
            {userDetail?.user_type !== userType.client && (
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
            )}
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
            {userDetail?.user_type !== userType.client && (
              <CommonSelect
                value={filters?.subscriptionAcquire}
                options={subscriptionAcquiredType || []}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    subscriptionAcquire: e?.target?.value,
                  }));
                }}
              />
            )}

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
                options={
                  account_list?.filter(
                    (item) =>
                      !filters?.account
                        ?.map((i) => i?.value)
                        ?.includes(item?.value)
                  ) || []
                }
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
                subCategory={
                  userDetail?.user_type === userType.client
                    ? [
                        "By Product line",
                        "By Account names",
                        "By Last Purchase Year",
                      ]
                    : [
                        "By Product line",
                        "By Account names",
                        "By Last Purchase Year",
                        "By Team names",
                      ]
                }
                onSubCategoryClick={(index) => {
                  if (index === 0) handleChartViewChange("byProductLine");
                  if (index === 1) handleChartViewChange("byAccountName");
                  if (index === 2) handleChartViewChange("byLastYear");
                }}
              />
            )}
            {newSubscriptionDataLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="account-industry-chart-2 mt-4 new-subs-amountPerMonth">
                <CommonChart
                  title={
                    userDetail?.user_type === userType.client
                      ? "Total Subscription as per Months"
                      : "Total Amount as per Months"
                  }
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
                  className={`chart-data-1 ${
                    userDetail?.user_type === userType.client && "w-100"
                  }`}
                  subCategory={
                    userDetail?.user_type === userType.client
                      ? []
                      : ["Subscription", "DTP", "ACV"]
                  }
                  onSubCategoryClick={(index) => {
                    if (index === 0) handleAccountGroupChange("subscription");
                    if (index === 1) handleAccountGroupChange("dtp_price");
                    if (index === 2) handleAccountGroupChange("acv_price");
                  }}
                />
                {userDetail?.user_type !== userType.client && (
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
                        if (index === 0)
                          handleAccountTypeChange("subscription");
                        if (index === 1) handleAccountTypeChange("dtp_price");
                        if (index === 2) handleAccountTypeChange("acv_price");
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            {userDetail?.user_type !== userType.client && (
              <div>
                {newSubscriptionDataLoading ? (
                  <SkeletonLoader />
                ) : (
                  <div className="new-subscription-industry-container">
                    <CommonChart
                      title={"Total Subscription as per Industry"}
                      options={industryBarChart?.options}
                      series={industryBarChart?.series}
                      subCategory={["Subscription", "DTP", "ACV"]}
                      onSubCategoryClick={(index) => {
                        if (index === 0) handleIndustryChange("subscription");
                        if (index === 1) handleIndustryChange("dtp_price");
                        if (index === 2) handleIndustryChange("acv_price");
                      }}
                      className={"w-100"}
                    />
                    <CommonChart
                      title={"Total Subscription as per Segment"}
                      options={segmentBarChart?.options}
                      series={segmentBarChart?.series}
                      subCategory={["Subscription", "DTP", "ACV"]}
                      onSubCategoryClick={(index) => {
                        if (index === 0) handleSegmentChange("subscription");
                        if (index === 1) handleSegmentChange("dtp_price");
                        if (index === 2) handleSegmentChange("acv_price");
                      }}
                      className={"w-100"}
                    />
                    <CommonChart
                      title={"Total Subscription as per Sub Segment"}
                      options={subSegmentBarChart?.options}
                      series={subSegmentBarChart?.series}
                      subCategory={["Subscription", "DTP", "ACV"]}
                      onSubCategoryClick={(index) => {
                        if (index === 0) handleSubSegmentChange("subscription");
                        if (index === 1) handleSubSegmentChange("dtp_price");
                        if (index === 2) handleSubSegmentChange("acv_price");
                      }}
                      className={"w-100"}
                    />
                  </div>
                )}
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
                getRowId={(row) => row?.id}
                checkboxSelection
                toolbar
                exportFileName={`subs_trisita`}
                moduleName="New Subscription"
              />
            </div>
          )}
        </div>
      </div>
      <CommonModal
        isOpen={modal.show}
        handleClose={() =>
          setModal({
            show: false,
            id: null,
            isAssign: false,
            subscription_acquired_type_id: null,
          })
        }
        scrollable={modal?.isAssign ? false : true}
        title={modal.isAssign ? "Set Action" : "New Subscription Detail"}
      >
        {modal?.isAssign ? (
          <SetAction
            id={modal?.id}
            handleClose={() =>
              setModal({
                show: false,
                id: null,
                isAssign: false,
                subscription_acquired_type_id: null,
              })
            }
            subscription_acquired_type_id={modal?.subscription_acquired_type_id}
            handleFallback={handleFallback}
          />
        ) : (
          <SubscriptionDetail />
        )}
      </CommonModal>
    </>
  );
};

export default NewSubscription;
