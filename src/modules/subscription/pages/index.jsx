import CommonButton from "@/components/common/buttons/CommonButton";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import ReactApexChart from "react-apexcharts";
import CommonTable from "@/components/common/dataTable/CommonTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  getAllAccount,
  getAllBranch,
} from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { Autocomplete, TextField, Tooltip, Typography } from "@mui/material";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import {
  getBackupSubscriptionDetail,
  getSubscriptionData,
} from "../slice/subscriptionSlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonModal from "@/components/common/modal/CommonModal";
import SubscriptionDetail from "../components/SubscriptionDetail";
import moment from "moment";
import dayjs from "dayjs";
import useDebounce from "@/hooks/useDebounce";

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
  const [filteredData, setFilteredData] = useState();
  const [barColor, setBarColor] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [filters, setFilters] = useState({
    account: [],
    branch: null,
    status: "All Status",
    startDate: "",
    endDate: "",
  });
  const [modal, setModal] = useState({
    show: false,
    id: null,
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
    await dispatch(getSubscriptionData(payload));
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

  // Table Data Handle

  // Handle modal open
  const handleOpenModel = (id) => {
    setModal({ show: true, id });
    dispatch(getBackupSubscriptionDetail({ id, isSubscription: true }));
  };

  const columns = [
    {
      field: "subscriptionReferenceNumber",
      headerName: "subscription",
      width: 150,
      renderCell: (params, index) => (
        <span
          onClick={() => handleOpenModel(params?.row.id)}
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
      renderCell: (params) => {
        const { value: account } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {account?.length > maxChars ? account : account?.slice(0, maxChars)}
          </div>
        );
      },
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
    { field: "account_csn", headerName: "Account CSN", width: 100 },
    {
      field: "retention_health_riskBand",
      headerName: "Retention health riskBand",
      width: 100,
    },
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
    {
      field: "contract_manager_email",
      headerName: "Contract Mgr. Email",
      width: 200,
      renderCell: (params) => {
        const { value: email } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {email?.length > maxChars ? email : email?.slice(0, maxChars)}
          </div>
        );
      },
    },
    { field: "account_type", headerName: "Account Type", width: 130 },
    { field: "seats", headerName: "Seats", width: 70 },
    { field: "startDate", headerName: "Subs Start Date", width: 130 },
    { field: "endDate", headerName: "Subs End Date ", width: 130 },
    { field: "trisita_status", headerName: "Trisita Status", width: 130 },
    { field: "subscriptionStatus", headerName: "Status", width: 100 },
    { field: "lastPurchaseDate", headerName: "Last Purchase date", width: 130 },
    { field: "account_group", headerName: "Account Group", width: 100 },
    { field: "programType", headerName: "Program Type", width: 100 },
    { field: "subscriptionType", headerName: "Subscription Type", width: 100 },
    { field: "contract_end_date", headerName: "Contract EndDate", width: 130 },
    { field: "productLineCode", headerName: "Product Line Code", width: 130 },
    { field: "contract_term", headerName: "Contract Term", width: 130 },
    { field: "switchType", headerName: "Switch Type", width: 130 },
    { field: "switchYear", headerName: "Switch Year", width: 130 },
    { field: "acv_price", headerName: "Total ACV Price", width: 130 },
    { field: "dtp_price", headerName: "Total DTP Price", width: 130 },
    {
      field: "productLine",
      headerName: "Product Line",
      width: 250,
      renderCell: (params) => {
        const { value: productLine } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {productLine?.length > maxChars
              ? productLine
              : productLine?.slice(0, maxChars)}
          </div>
        );
      },
    },
    {
      field: "set-trigger",
      headerName: "Set Trigger",
      width: 150,
      renderCell: (params, index) => (
        <span
          // onClick={() => handleOpenModel(params?.row?.id)}
          className="assign-button text-black px-3 py-1 rounded border-0"
        >
          Assign Trigger
        </span>
      ),
    },
  ];

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
    let data = handleFilter(subscriptionData);
    setFilteredData(data);
  }, [subscriptionData]);

  useEffect(() => {
    if (
      filters?.account?.length > 0 ||
      filters?.status !== "All Status" ||
      filters?.branch
    ) {
      let data = handleFilter(subscriptionData);
      setFilteredData(data);
    } else {
      setFilteredData(subscriptionData);
    }
  }, [filters?.account, filters?.branch, filters?.status, subscriptionData]);

  // Number of seats chart
  const [chartViewType, setChartViewType] = useState("byProductLine");
  const [options, setOptions] = useState({
    chart: {
      events: {},
      type: "bar",
      height: 350,
      width: "100%",
    },
    xaxis: {
      categories: [], // Will be populated with top 50 product codes
    },
    yaxis: {
      title: { text: "Total Seats" },
    },
    dataLabels: {
      position: "top",
    },
  });

  const [series, setSeries] = useState([
    { name: "seats", data: [] }, // Will contain seat counts for top 50
  ]);

  useEffect(() => {
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

      // Update chart state
      setOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories,
          labels: {
            ...prev.xaxis.labels,
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
      }));

      setSeries([{ name: "seats", data: seriesData }]);
    } else {
      // Handle no data case
      setOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: [],
          labels: {
            ...prev.xaxis.labels,
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
      }));
      setSeries([{ name: "seats", data: [] }]);
    }
  }, [filteredData, chartViewType]);

  const handleChartViewChange = (viewType) => {
    setChartViewType(viewType);
  };

  // Total Subscriptions as per Account Group
  const [accountGroupType, setAccountGroupType] = useState("subscription");
  const [accountGroupChart, setAccountGroupChart] = useState({
    options: {
      chart: {
        type: "pie",
        height: 350,
      },
      labels: [],
      legend: {
        position: "bottom",
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
  });

  useEffect(() => {
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

      // Convert to arrays for the chart
      const labels = Object.keys(accountGroups);
      let series;

      switch (accountGroupType) {
        case "dtp_price":
          series = labels.map((group) => accountGroups[group].dtp);
          break;
        case "acv_price":
          series = labels.map((group) => accountGroups[group].acv);
          break;
        case "subscription":
        default:
          series = labels.map((group) => accountGroups[group].count);
      }

      setAccountGroupChart((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          labels,
        },
        series,
      }));
    } else {
      // Reset to empty state
      setAccountGroupChart((prev) => ({
        ...prev,
        options: {
          ...prev.options,
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
        },
        series: [],
      }));
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

  // Retention Risk shows summary of the renewal risk for the subscription contract
  const [retentionRiskType, setRetentionRiskType] = useState("subscription");
  const [retentionRiskChart, setRetentionRiskChart] = useState({
    options: {
      chart: {
        type: "pie",
        height: 350,
      },
      labels: [],
      legend: {
        position: "bottom",
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
  });

  useEffect(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const retentionRiskGroups = {};

      filteredData.forEach((item) => {
        const group = item?.retention_health_riskBand || "Unknown";

        // Initialize group if not exists
        if (!retentionRiskGroups[group]) {
          retentionRiskGroups[group] = {
            count: 0,
            dtp: 0,
            acv: 0,
          };
        }

        // Aggregate values
        retentionRiskGroups[group].count += 1;
        retentionRiskGroups[group].dtp += parseFloat(item.dtp_price) || 0;
        retentionRiskGroups[group].acv += parseFloat(item.acv_price) || 0;
      });

      // Convert to arrays for the chart
      const labels = Object.keys(retentionRiskGroups);
      let series;

      switch (retentionRiskType) {
        case "dtp_price":
          series = labels.map((group) => retentionRiskGroups[group].dtp);
          break;
        case "acv_price":
          series = labels.map((group) => retentionRiskGroups[group].acv);
          break;
        case "subscription":
        default:
          series = labels.map((group) => retentionRiskGroups[group].count);
      }

      setRetentionRiskChart((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          labels,
        },
        series,
      }));
    } else {
      // Reset to empty state
      setRetentionRiskChart((prev) => ({
        ...prev,
        options: {
          ...prev.options,
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
        },
        series: [],
      }));
    }
  }, [filteredData, retentionRiskType]);

  const getRetentionRiskTitle = () => {
    switch (retentionRiskType) {
      case "dtp_price":
        return "Retention Risk shows summary of the renewal risk for the dtp price";
      case "acv_price":
        return "Retention Risk shows summary of the renewal risk for the acv price";
      case "subscription":
      default:
        return "Retention Risk shows summary of the renewal risk for the subscription contract";
    }
  };

  const handleRetentionRiskChange = (viewType) => {
    setRetentionRiskType(viewType);
  };

  // Total Subscriptions as per Account Type
  const [accountType_Type, setAccountType_Type] = useState("subscription");
  const [accountTypeChart, setAccountTypeChart] = useState({
    options: {
      chart: {
        type: "pie",
        height: 350,
      },
      labels: [],
      legend: {
        position: "bottom",
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
  });

  useEffect(() => {
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
          series = labels.map((group) => accountTypeGroups[group].dtp);
          break;
        case "acv_price":
          series = labels.map((group) => accountTypeGroups[group].acv);
          break;
        case "subscription":
        default:
          series = labels.map((group) => accountTypeGroups[group].count);
      }

      setAccountTypeChart((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          labels,
        },
        series,
      }));
    } else {
      // Reset to empty state
      setAccountTypeChart((prev) => ({
        ...prev,
        options: {
          ...prev.options,
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
        },
        series: [],
      }));
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

    // Prepare next 12 months starting from baseMonth
    for (let i = 0; i < 12; i++) {
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

  // 📊 ApexCharts config
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

  // On Board Health
  const orderedCategories = [
    "Very High",
    "High",
    "Medium",
    "Low",
    "Very Low",
    "Unknown",
  ];

  const handleOnBoardHealthBarClick = (data) => {
    const allData = handleFilter(subscriptionData);
    const isSameColor = barColor === data;

    setBarColor(isSameColor ? "" : data);

    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown"
            ? item?.retention_health_riskBand === data
            : !item?.retention_health_riskBand
        );

    setFilteredData(updatedData);
  };

  const onBoardHealthChart = useMemo(() => {
    // Initialize risk count
    const riskCounts = orderedCategories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});
    let allData = handleFilter(subscriptionData);
    if (allData?.length) {
      allData.forEach((item) => {
        const group = item?.retention_health_riskBand || "Unknown";
        if (orderedCategories.includes(group)) {
          riskCounts[group]++;
        }
      });

      const seriesData = orderedCategories.map(
        (category) => riskCounts[category]
      );

      return {
        options: {
          chart: {
            type: "bar",
            height: 350,
            width: "100%",
            events: {
              click(event, chartContext, config) {
                const clickedCategory =
                  config?.config?.xaxis?.categories[config.dataPointIndex];
                if (clickedCategory) {
                  handleOnBoardHealthBarClick(clickedCategory);
                }
              },
            },
          },
          xaxis: {
            categories: orderedCategories,
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
            name: "Subscription",
            data: seriesData,
          },
        ],
      };
    } else {
      return {
        options: {
          chart: {
            type: "bar",
            height: 350,
            width: "100%",
          },
          xaxis: {
            categories: [],
          },
          yaxis: {
            title: {
              text: "",
            },
          },
          dataLabels: {
            enabled: false,
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
        },
        series: [],
      };
    }
  }, [filteredData]);

  console.log({ debounce });

  return (
    <>
      <div>
        <div className="subscription-header">
          <h5 className="commom-header-title mb-0">Subscription</h5>
          <div className="subscription-filter">
            <Tooltip
              title={
                last_updated
                  ? moment(last_updated).format("MMMM D, YYYY [at] h:mm:ss A")
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
              disabled={subscriptionDataLoading}
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
          <div className="subscription-chart">
            {subscriptionDataLoading ? (
              <SkeletonLoader isDashboard />
            ) : (
              <CommonChart
                title={
                  chartViewType === "byProductLine"
                    ? "Trend of number of seats purchased by product line code"
                    : chartViewType === "byAccountName"
                    ? "Trend of number of seats purchased by account name"
                    : "Trend of number of seats purchased by last purchase year"
                }
                options={options}
                series={series}
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
            {subscriptionDataLoading ? (
              <SkeletonLoader isDashboard />
            ) : (
              <div className="account-industry-chart-2 mt-4">
                <CommonChart
                  title={getAccountGroupTitle()}
                  options={accountGroupChart?.options}
                  series={accountGroupChart?.series}
                  className="chart-data-1"
                  subCategory={["Subscription", "DTP", "ACV"]}
                  onSubCategoryClick={(index) => {
                    if (index === 0) handleAccountGroupChange("subscription");
                    if (index === 1) handleAccountGroupChange("dtp_price");
                    if (index === 2) handleAccountGroupChange("acv_price");
                  }}
                />
                <CommonChart
                  title="Total Amount as per Months"
                  options={amountPerMonth.options}
                  series={amountPerMonth.series}
                  className="chart-data-2"
                />
              </div>
            )}
            {subscriptionDataLoading ? (
              <SkeletonLoader isDashboard />
            ) : (
              <div className="account-industry-chart-2 mt-4">
                <CommonChart
                  title="Expired subscriptions ratio of nurtrued and customer"
                  options={expiredContractSpeedMeterData?.options}
                  series={expiredContractSpeedMeterData?.series}
                  className="chart-data-1"
                />
                <div className="chart-section">
                  <CommonChart
                    title={getRetentionRiskTitle()}
                    options={retentionRiskChart?.options}
                    series={retentionRiskChart?.series}
                    className="chart-data-2"
                    subCategory={["Subscription", "DTP", "ACV"]}
                    onSubCategoryClick={(index) => {
                      if (index === 0)
                        handleRetentionRiskChange("subscription");
                      if (index === 1) handleRetentionRiskChange("dtp_price");
                      if (index === 2) handleRetentionRiskChange("acv_price");
                    }}
                  />
                  <CommonChart
                    title={getAccountTypeTitle()}
                    options={accountTypeChart.options}
                    series={accountTypeChart.series}
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
            {subscriptionDataLoading ? (
              <SkeletonLoader isDashboard />
            ) : (
              <CommonChart
                title="On boarding Health adoption report"
                options={onBoardHealthChart.options}
                series={onBoardHealthChart.series}
              />
            )}
          </div>
          {subscriptionDataLoading ? (
            <SkeletonLoader isDashboard />
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
        handleClose={() => setModal({ show: false, id: null })}
        scrollable
        title={"Subscription Detail"}
      >
        <SubscriptionDetail />
      </CommonModal>
    </>
  );
};
export default Subscription;
