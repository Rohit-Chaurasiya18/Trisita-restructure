import CommonButton from "@/components/common/buttons/CommonButton";
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
import useDebounce from "@/hooks/useDebounce";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import dayjs from "dayjs";
import CommonSelect from "@/components/common/dropdown/CommonSelect";

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
  const [dateRange, setDateRange] = useState([null, null]);
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    branch: null,
    from_date: "",
    to_date: "",
    cardFilter: "",
    status: "Open",
  });

  const [opportunityBarChart, SetOpportunityBarChart] = useState([]);

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

  const debounce = useDebounce(filters?.to_date, 500);

  useEffect(() => {
    const payload = {
      branch: filters?.branch?.value,
      status: filters?.status,
      cardFilter: filters?.cardFilter,
      ...(debounce
        ? {
            from_date: filters?.from_date,
            to_date: debounce,
          }
        : {
            from_date: null,
            to_date: null,
          }),
    };

    dispatch(getExportedOpportunities(payload));
  }, [filters?.branch, debounce, filters?.cardFilter, filters?.status]);

  const handleDateChange = (newValue) => {
    const [start, end] = newValue;
    setFilters((prev) => ({
      ...prev,
      from_date: start?.format("YYYY-MM-DD") || null,
      to_date: end ? end.format("YYYY-MM-DD") : "",
    }));

    setDateRange(newValue);
  };

  const handleChange = (name) => {
    setFilters((prev) => ({
      ...prev,
      cardFilter: name,
    }));
  };
  // Columns
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
    { field: "account_type", headerName: "Account Type", width: 200 },
    { field: "account_group", headerName: "Account Group", width: 200 },
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
    {
      field: "productLines",
      headerName: "Product Line",
      width: 250,
    },
    {
      field: "productLineCodes",
      headerName: "Product Line Code",
      width: 250,
    },
    {
      field: "acv_price",
      headerName: "Total ACV Price",
      width: 220,
    },
    {
      field: "dtp_price",
      headerName: "Total DTP Price",
      width: 220,
    },
  ];

  // Handle Export
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
      filteredData?.filter((item) =>
        selectedId.includes(item?.opportunity_number)
      ),
    [selectedId]
  );

  useEffect(() => {
    if (opportunityList?.length > 0) {
      setFilteredData(opportunityList);
    } else {
      setFilteredData([]);
    }
  }, [opportunityList]);

  useEffect(() => {
    if (filteredData) {
      processChartData(filteredData);
    }
  }, [filteredData]);

  const processChartData = (data) => {
    const accountNameCounts = {};

    // Use filters.to_date or default to current month
    const baseMonth = filters?.to_date ? dayjs(filters.to_date) : dayjs();

    // Step 1: Generate exactly 12 months (YYYY-MM → label)
    const last12Months = [];
    const monthlyQuantityMap = {};

    for (let i = 11; i >= 0; i--) {
      const monthKey = baseMonth.subtract(i, "month").format("YYYY-MM");
      const monthLabel = dayjs(monthKey).format("MMM YYYY");
      last12Months.push({ key: monthKey, label: monthLabel });
      monthlyQuantityMap[monthKey] = 0;
    }

    // Step 2: Aggregate quantity per month
    data.forEach((item) => {
      const endMonth = dayjs(item.subscription_end_date).format("YYYY-MM");
      if (monthlyQuantityMap.hasOwnProperty(endMonth)) {
        monthlyQuantityMap[endMonth] += parseInt(item.total_quantity, 10) || 0;
      }

      if (item.account_name) {
        accountNameCounts[item.account_name] =
          (accountNameCounts[item.account_name] || 0) + 1;
      }
    });

    // Step 3: Prepare final chart data (even if some months have 0)
    const modifiedData = last12Months.map((month) => ({
      label: month.label,
      value: monthlyQuantityMap[month.key],
    }));

    SetOpportunityBarChart(modifiedData);

    // Top 25 accounts
    const top25 = Object.entries(accountNameCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25);

    SetOpportunityDataSecondGraph(Object.fromEntries(top25));
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

  const secondgraphdata = Object.values(opportunityAccountDataSecondGraph);
  const secondgraphlabel = Object.keys(opportunityAccountDataSecondGraph);
  const [accountNameLegend, setAccountNameLegend] = useState("");

  const handleAccountNameLegendClick = (data) => {
    let allData;
    const isSameColor = accountNameLegend === data;
    if (isSameColor) {
      allData = opportunityList;
    } else {
      allData = filteredData;
    }
    setAccountNameLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown" ? item?.account_name === data : !item?.account_name
        );

    setFilteredData(updatedData);
  };
  const AccountDataChart = useMemo(
    () => ({
      options: {
        chart: {
          type: "pie",
          height: 350,
          events: {
            legendClick: (chartContext, seriesIndex) => {
              const clickedLegend = secondgraphlabel[seriesIndex];
              if (clickedLegend) {
                handleAccountNameLegendClick(clickedLegend);
              }
            },
          },
        },
        labels: secondgraphlabel,
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
      series: secondgraphdata,
    }),
    [secondgraphlabel]
  );

  // Total Amount as per Months
  const chartData = useMemo(() => {
    const monthlyData = {};

    // Determine base month (start from selected startDate if available, else current month)
    const baseMonth = filters?.to_date ? dayjs(filters.to_date) : dayjs(); // fallback to current month

    // Previous 12 months
    for (let i = 11; i >= 0; i--) {
      const monthKey = baseMonth.subtract(i, "month").format("YYYY-MM");
      monthlyData[monthKey] = { dtp_total: 0, acv_total: 0 };
    }

    // Aggregate DTP and ACV by endDate month
    (filteredData || []).forEach((sub) => {
      const endMonth = dayjs(sub?.subscription_end_date).format("YYYY-MM");
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

  // Total Subscriptions as per Account Group
  const [accountGroupType, setAccountGroupType] = useState("subscription");
  const [accountGroupLegend, setAccountGroupLegend] = useState("");

  const handleAccountGroupLegendClick = (data) => {
    let allData;
    const isSameColor = accountGroupLegend === data;
    if (isSameColor) {
      allData = opportunityList;
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
  const [accountTypeLegend, setAccountTypeLegend] = useState("");

  const handleAccountTypeLegendClick = (data) => {
    let allData;
    const isSameColor = accountTypeLegend === data;
    if (isSameColor) {
      allData = opportunityList;
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

  // Total Subscriptions as per BD Person
  const [bdPersonType, setBdPersonType] = useState("subscription");
  const [bdPersonLegend, setBdPersonLegend] = useState("");

  const handleBDPersonLegendClick = (data) => {
    let allData;
    const isSameColor = bdPersonLegend === data;
    if (isSameColor) {
      allData = opportunityList;
    } else {
      allData = filteredData;
    }
    setBdPersonLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown"
            ? item?.bd_persons?.includes(data)
            : item?.bd_persons?.length === 0
        );

    setFilteredData(updatedData);
  };
  const bdPersonPieChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by BD person based on selected type
      const bdPersonGroups = {};

      filteredData.forEach((item) => {
        const bdPersons =
          item?.bd_persons?.length > 0 ? item?.bd_persons : ["Unknown"]; // Treat empty array as "Unknown"

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

  // Retention Risk shows summary of the renewal risk for the subscription contract
  const [retentionRiskType, setRetentionRiskType] = useState("subscription");
  const [retentionRiskLegend, setRetentionRiskLegend] = useState("");

  const handleRiskRetentionLegendClick = (data) => {
    let allData;
    const isSameColor = retentionRiskLegend === data;
    if (isSameColor) {
      allData = opportunityList;
    } else {
      allData = filteredData;
    }
    setRetentionRiskLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown"
            ? item?.ews_retention_health === data
            : !item?.ews_retention_health
        );

    setFilteredData(updatedData);
  };
  const retentionRiskBarChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const retentionRiskGroups = {};
      filteredData.forEach((item) => {
        const group = item?.ews_retention_health || "Unknown";
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
          series = labels.map((group) =>
            parseFloat(retentionRiskGroups[group].dtp.toFixed(2))
          );
          break;
        case "acv_price":
          series = labels.map((group) =>
            parseFloat(retentionRiskGroups[group].acv.toFixed(2))
          );
          break;
        case "subscription":
        default:
          series = labels.map((group) => retentionRiskGroups[group].count);
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
                  handleRiskRetentionLegendClick(clickedLegend);
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
              const isHighlighted = seriesName === retentionRiskLegend;
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
  }, [filteredData, retentionRiskType]);

  const getRetentionRiskTitle = () => {
    switch (retentionRiskType) {
      case "dtp_price":
        return "Oppen. Retention Risk shows summary of the renewal risk for the dtp price";
      case "acv_price":
        return "Oppen. Retention Risk shows summary of the renewal risk for the acv price";
      case "subscription":
      default:
        return "Oppen. Retention Risk shows summary of the renewal risk for the subscription contract";
    }
  };

  const handleRetentionRiskChange = (viewType) => {
    setRetentionRiskType(viewType);
  };

  return (
    <>
      <div className="opportunity-container">
        <div className="opportunity-header">
          <h5 className="commom-header-title mb-0">Renewal Opportunity Dashboard</h5>
          <span className="common-breadcrum-msg">
            Use of PWS Oppportunity Export API data to show details below
          </span>

          <div className="subscription-header mb-4 opportunity-filter">
            <div className="subscription-filter">
              <Tooltip
                title={moment(last_updated).format(
                  "MMMM D, YYYY [at] h:mm:ss A"
                )}
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
                  setDateRange([null, null]);
                }}
              >
                All
              </CommonButton>
              <CommonDateRangePicker
                value={dateRange}
                onChange={handleDateChange}
                width="180px"
                placeholderStart="Start date"
                placeholderEnd="End date"
                disabled={opportunityLoading}
              />
              <CommonSelect
                value={filters?.status}
                options={[
                  { value: "All Status", label: "All Status" },
                  { value: "Open", label: "Open" },
                  { value: "Cancelled", label: "Cancelled" },
                  { value: "Completed", label: "Completed" },
                ]}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }));
                }}
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
            </div>
          </div>
        </div>

        <div className="opportunity-card-section ">
          {cardData.map((card, index) => (
            <CommonCard key={index} {...card} handleChange={handleChange} />
          ))}
        </div>

        {opportunityLoading ? (
          <div className="mt-2">
            <SkeletonLoader />
          </div>
        ) : (
          <div className="opportunity-chart-section">
            <CommonChart
              title="All User Product Seat data"
              options={LineChartData.options}
              series={LineChartData.series}
            />
            <div className="opportunity-retention-account subscription-chart">
              <CommonChart
                title={getRetentionRiskTitle()}
                options={retentionRiskBarChart?.options}
                series={retentionRiskBarChart?.series}
                className="chart-data-2"
                subCategory={["Subscription", "DTP", "ACV"]}
                onSubCategoryClick={(index) => {
                  if (index === 0) handleRetentionRiskChange("subscription");
                  if (index === 1) handleRetentionRiskChange("dtp_price");
                  if (index === 2) handleRetentionRiskChange("acv_price");
                }}
              />
              <CommonChart
                title="Oppen. by Account name (Top 25)"
                options={AccountDataChart.options}
                series={AccountDataChart.series}
              />
            </div>
          </div>
        )}

        {opportunityLoading ? (
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
        {opportunityLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="account-industry-chart-2 mt-4 subscription-chart">
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
        {opportunityLoading ? (
          <div className="mt-2">
            <SkeletonLoader />
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
              rows={filteredData}
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
