import React, { useEffect, useMemo, useState } from "react";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import CommonSearchInput from "@/components/common/inputTextField/CommonSearch";
import CommonTable from "@/components/common/dataTable/CommonTable";
import { barChartData } from "../constants";
import ReactApexChart from "react-apexcharts";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import {
  getAccount,
  getAllUser,
  getContracts,
  getEndCustomerAccount,
  getExportedAccount,
  getInsightMetricsCsn,
  getSubscriptionByThirdParty,
  getThirdPartyExportedAccount,
  getTotalAmountPerMonthChart,
} from "../slice/accountSlice";
import { Tooltip } from "@mui/material";
import CommonModal from "@/components/common/modal/CommonModal";
import CustomTabs from "../components/CustomTabs";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import AssignUserBranch from "../components/AssignUserBranch";
import moment from "moment";
import routesConstants from "@/routes/routesConstants";
import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import SubscriptionDetail from "../components/SubscriptionDetail";
import dayjs from "dayjs";

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

const Account = () => {
  const [filters, setFilters] = useState({
    searchValue: "",
    branch: null,
    status: "All Status",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    id: "",
    isAssign: false,
    type: null,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isThirdPartyAccount = useMemo(
    () => location.pathname.startsWith("/third_party_account"),
    [location?.pathname]
  );

  useEffect(() => {
    setFilters({
      searchValue: "",
      branch: null,
      status: "All Status",
    });
  }, [isThirdPartyAccount]);

  const {
    branchListLoading,
    branch_list,
    filter,
    last_updated,
    exportedAccountDataLoading,
    exportedAccountData,
    accountInformation,
    userDetail,
    dashboardStatus,
    totalAmountMonthThirdParty,
    totalAmountMonthThirdPartyLoading,
  } = useSelector((state) => ({
    branchListLoading: state?.insightMetrics?.branchListLoading,
    branch_list: state?.insightMetrics?.branchList,
    filter: state?.layout?.filter,
    exportedAccountDataLoading: isThirdPartyAccount
      ? state?.account?.thirdPartyExportedAccountDataLoading
      : state?.account?.exportedAccountDataLoading,
    exportedAccountData: isThirdPartyAccount
      ? state?.account?.thirdPartyExportedAccountData
      : state?.account?.exportedAccountData,
    last_updated: isThirdPartyAccount
      ? state?.account?.thirdPartyLast_updated
      : state?.account?.last_updated,
    accountInformation: state?.account?.accountInformation,
    userDetail: state?.login?.userDetail,
    dashboardStatus: state?.dashboard?.dashboardStatus,
    totalAmountMonthThirdParty: state?.account?.totalAmountMonthThirdParty,
    totalAmountMonthThirdPartyLoading:
      state?.account?.totalAmountMonthThirdPartyLoading,
  }));
  const [selectedId, setSelectedId] = useState([]);

  useEffect(() => {
    if (dashboardStatus) {
      setFilters((prev) => ({
        ...prev,
        status: dashboardStatus,
      }));
    }
  }, []);

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getAllUser());
    dispatch(getTotalAmountPerMonthChart());
  }, []);

  useEffect(() => {
    let payload = {
      id: filter?.csn === "All CSN" ? "" : filter?.csn,
      isThirdParty: isThirdPartyAccount,
    };
    if (isThirdPartyAccount) {
      dispatch(getThirdPartyExportedAccount(payload));
    } else {
      dispatch(getExportedAccount(payload));
    }
  }, [filter?.csn, isThirdPartyAccount]);

  const handleFilters = (data = exportedAccountData) => {
    if (filters?.branch?.label) {
      data = data?.filter?.((item) => item?.branch === filters?.branch?.label);
    }
    if (filters?.searchValue) {
      const search = filters?.searchValue.toLowerCase();
      data = data?.filter((row) =>
        Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(search)
        )
      );
    }
    if (filters?.status && filters?.status !== "All Status") {
      data = data?.filter((item) => item?.contract_status === filters?.status);
    }
    return data;
  };
  useEffect(() => {
    let data = handleFilters(exportedAccountData);
    setFilteredData(data);
  }, [exportedAccountData, isThirdPartyAccount]);

  useEffect(() => {
    if (
      filters?.branch?.label ||
      filters?.status !== "All Status" ||
      filters?.searchValue
    ) {
      let data = handleFilters();
      setFilteredData(data);
    } else {
      setFilteredData(exportedAccountData);
    }
  }, [filters?.branch, filters?.status, filters?.searchValue]);

  const handleOpenModel = (id) => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
      id: id,
      isAssign: false,
      type: null,
    }));
    const defaultCsn = filter?.csn === "All CSN" ? "5102086717" : filter?.csn;
    let payload = {
      accountId: id,
      csn: defaultCsn,
    };
    dispatch(getAccount(payload));
    dispatch(getInsightMetricsCsn(payload));
    dispatch(getContracts(payload));
    dispatch(getEndCustomerAccount(payload));
  };

  const columns = [
    {
      field: "csn",
      headerName: "CSN",
      width: 150,
      renderCell: (params, index) => (
        <span
          onClick={() =>
            !isThirdPartyAccount && handleOpenModel(params?.row?.id)
          }
          className="action-button bg-white text-black px-3 py-1 rounded border-0"
        >
          {params?.value}
        </span>
      ),
    },
    {
      field: "user_assign",
      headerName: "BD Person Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {params?.value?.trim() ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Account Name",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""}>
          <button
            className="text-red-600 border-0 "
            onClick={() =>
              navigate(routesConstants?.UPDATE_ACCOUNT + "/" + params?.id)
            }
          >
            <span className="table-cell-truncate">{params?.value}</span>
          </button>
        </Tooltip>
      ),
    },
    {
      field: "account_group",
      headerName: "Acccount Group",
      width: 130,
    },
    ...(isThirdPartyAccount
      ? [
          {
            field: "associated_account",
            headerName: "Associated Account",
            width: 300,
            renderCell: (params) => (
              <Tooltip title={params?.value || ""}>
                <div>
                  {params?.value ? (
                    params?.value
                  ) : (
                    <span style={{ color: "red" }}>Undefined</span>
                  )}
                </div>
              </Tooltip>
            ),
          },
        ]
      : []),
    { field: "industryGroup", headerName: "Industry", width: 100 },
    {
      field: "industrySegment",
      headerName: "Segment",
      width: 160,
      renderCell: (params) => {
        const { value: industrySegment } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {industrySegment?.length > maxChars
              ? industrySegment
              : industrySegment?.slice(0, maxChars)}
          </div>
        );
      },
    },
    {
      field: "industrySubSegment",
      headerName: "Sub Segment",
      width: 160,
      renderCell: (params) => {
        const { value: industrySubSegment } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {industrySubSegment?.length > maxChars
              ? industrySubSegment
              : industrySubSegment?.slice(0, maxChars)}
          </div>
        );
      },
    },
    {
      field: "address1",
      headerName: "Address",
      width: 160,
      renderCell: (params) => {
        const { value: address1 } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {address1?.length > maxChars
              ? address1
              : address1?.slice(0, maxChars)}
          </div>
        );
      },
    },
    { field: "city", headerName: "City", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Contact No", width: 150 },
    { field: "status", headerName: "Autodesk Account Status", width: 120 },
    {
      field: "contract_status",
      headerName: "Trisita Account Status",
      width: 120,
    },
    { field: "buyingReadinessScore", headerName: "Rediness Score", width: 130 },
    {
      field: "renewal_person",
      headerName: "Renewal Person Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {params?.value ? (
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
    {
      field: "acv_price",
      headerName: "Total ACV Price",
      width: 130,
      renderCell: (params) => <div>{Number(params?.value).toFixed(2)}</div>,
      sortComparator: (v1, v2) => Number(v1) - Number(v2),
    },
    {
      field: "dtp_price",
      headerName: "Total DTP Price",
      width: 130,
      renderCell: (params) => <div>{Number(params?.value).toFixed(2)}</div>,
      sortComparator: (v1, v2) => Number(v1) - Number(v2),
    },
    {
      field: "total_seats",
      headerName: "Total Seats",
      width: 130,
      renderCell: (params) => <div>{Number(params?.value)}</div>,
      sortComparator: (v1, v2) => Number(v1) - Number(v2),
    },

    ...(isThirdPartyAccount
      ? [
          {
            field: "show_subscription",
            headerName: "Show subscription",
            width: 250,
            renderCell: (params, index) => (
              <span
                onClick={() => {
                  setModal({
                    isOpen: true,
                    type: 1,
                  });
                  dispatch(getSubscriptionByThirdParty(params?.row?.id));
                }}
                className="assign-button text-black px-3 py-1 rounded border-0"
              >
                Show subscription
              </span>
            ),
          },
        ]
      : []),
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params, index) => (
        <span
          onClick={() =>
            setModal((prev) => ({
              ...prev,
              id: params?.row?.id,
              isOpen: true,
              isAssign: true,
              type: null,
            }))
          }
          className="assign-button text-black px-3 py-1 rounded border-0"
        >
          Assign
        </span>
      ),
    },
  ];

  const handleCallback = () => {
    setModal({
      isOpen: false,
      id: "",
      isAssign: false,
      type: null,
    });
    dispatch(
      getExportedAccount({
        id: filter?.csn === "All CSN" ? "" : filter?.csn,
        isThirdParty: isThirdPartyAccount,
      })
    );
  };
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

  //Top 12 cities

  const handleCityBarClick = (cityName, clickedStatus) => {
    let data = handleFilters();
    if (cityName) {
      if (cityName === "Unknown") {
        data = data?.filter((item) => !item?.city);
      } else {
        data = data?.filter(
          (item) =>
            item?.city?.toString()?.toLowerCase() ===
            cityName?.toString()?.toLowerCase()
        );
      }
    }
    if (clickedStatus) {
      data = data?.filter((item) => item?.contract_status === clickedStatus);
    }

    setFilteredData(data);
  };

  const generateCityBarChartData = () => {
    const cityCounts = {};

    filteredData.forEach((item) => {
      const rawCity = item?.city || "Unknown";

      const city = rawCity.toLowerCase().trim(); // Normalize city name
      const displayCity =
        rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase(); // Proper case for display
      const status = item.contract_status;

      if (!cityCounts[city]) {
        cityCounts[city] = {
          displayName: displayCity,
          Active: 0,
          Expired: 0,
        };
      }

      if (status === "Active") {
        cityCounts[city].Active++;
      } else if (status === "Expired") {
        cityCounts[city].Expired++;
      }
    });

    const sortedCities = Object.entries(cityCounts)
      .sort((a, b) => {
        const totalA = a[1].Active + a[1].Expired;
        const totalB = b[1].Active + b[1].Expired;
        return totalB - totalA;
      })
      .slice(0, 12);

    const categories = sortedCities.map(([_, val]) => val.displayName);
    const activeData = sortedCities.map(([_, val]) => val.Active);
    const expiredData = sortedCities.map(([_, val]) => val.Expired);

    return {
      options: {
        ...barChartData.options,
        xaxis: {
          categories,
        },
        chart: {
          ...barChartData.options.chart,
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const city = categories[config.dataPointIndex];
              const clickedStatus =
                config.seriesIndex === 0
                  ? "Active"
                  : config.seriesIndex === 1
                  ? "Expired"
                  : "Unknown";
              handleCityBarClick(city, clickedStatus);
            },
          },
        },
      },

      series:
        filters.status === "Active"
          ? [{ name: "Active", data: activeData }]
          : filters.status === "Expired"
          ? [{ name: "Expired", data: expiredData }]
          : [
              { name: "Active", data: activeData },
              { name: "Expired", data: expiredData },
            ],
    };
  };

  // BD Person Graph
  const [bdPersonType, setBdPersonType] = useState("account");
  const [bdPersonLegend, setBdPersonLegend] = useState("");

  const handleBDPersonLegendClick = (data) => {
    let allData;
    const isSameColor = bdPersonLegend === data;
    if (isSameColor) {
      allData = handleFilters();
    } else {
      allData = filteredData;
    }
    setBdPersonLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown"
            ? item?.user_assign_Arr?.includes(data)
            : item?.user_assign_Arr?.length === 0
        );

    setFilteredData(updatedData);
  };

  const bdPersonPieChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by BD person based on selected type
      const bdPersonGroups = {};

      filteredData.forEach((item) => {
        const bdPersons =
          item?.user_assign_Arr?.length > 0
            ? item.user_assign_Arr
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
        case "account":
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
      case "account":
      default:
        return "Total Account as per BD Person";
    }
  };

  const handleBdPersonChange = (viewType) => {
    setBdPersonType(viewType);
  };

  // Associated Account
  const [associatedAccountType, setAssociatedAccountType] = useState("account");
  const [associatedAccountLegend, setAssociatedAccountLegend] = useState("");

  const handleAssociatedAccountLegendClick = (data) => {
    let allData;
    const isSameColor = associatedAccountLegend === data;
    if (isSameColor) {
      allData = handleFilters();
    } else {
      allData = filteredData;
    }
    setAssociatedAccountLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown" ? item?.name === data : item?.name
        );

    setFilteredData(updatedData);
  };

  const associatedAccountPieChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by BD person based on selected type
      const accountWiseSummary = {};

      filteredData?.forEach((item) => {
        const accountName = item?.name || "Unknown";
        const associatedList = item?.associated_account_arr || [];

        if (!accountWiseSummary[accountName]) {
          accountWiseSummary[accountName] = {
            name: accountName,
            count: 0,
            dtp: 0,
            acv: 0,
          };
        }

        accountWiseSummary[accountName].count += associatedList.length;
        accountWiseSummary[accountName].dtp += parseFloat(item?.dtp_price) || 0;
        accountWiseSummary[accountName].acv += parseFloat(item?.acv_price) || 0;
      });

      // Convert to arrays for the chart
      const groupValues = Object.values(accountWiseSummary);

      let series;
      switch (associatedAccountType) {
        case "dtp_price":
          series = groupValues.map((group) => parseFloat(group.dtp.toFixed(2)));
          break;
        case "acv_price":
          series = groupValues.map((group) => parseFloat(group.acv.toFixed(2)));
          break;
        case "account":
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

      const sortedLabels = sortedData.map((item) => item.label)?.splice(0, 25);
      const sortedSeries = sortedData.map((item) => item.value)?.splice(0, 25);
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
                  handleAssociatedAccountLegendClick(clickedLegend);
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
              const isHighlighted = seriesName === associatedAccountLegend;
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
              const isHighlighted = seriesName === associatedAccountLegend;
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
  }, [filteredData, associatedAccountType]);

  const getAssociatedAccountTitle = () => {
    switch (associatedAccountType) {
      case "dtp_price":
        return "Associated account (Top 25)";
      case "acv_price":
        return "Associated account (Top 25)";
      case "account":
      default:
        return "Associated account (Top 25)";
    }
  };

  const handleAssociatedAccountChange = (viewType) => {
    setAssociatedAccountType(viewType);
  };
  // Number of seats chart
  const [chartViewType, setChartViewType] = useState("byAccountName");
  const [numberOfSeatsBar, setNumberOfSeatsBar] = useState("");

  const handleNumberOfSeatsClick = (data) => {
    let allData;
    const isSameColor = numberOfSeatsBar === data;
    if (isSameColor) {
      allData = handleFilters();
    } else {
      allData = filteredData;
    }
    setNumberOfSeatsBar(isSameColor ? "" : data);
    let key;
    if (chartViewType === "byProductLine") {
      key = "productLineCodes";
    } else if (chartViewType === "byAccountName") {
      key = "name";
    }
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) => item[key] === data);
    setFilteredData(updatedData);
  };

  const numberOfSeats = useMemo(() => {
    if (filteredData?.length > 0) {
      let aggregationMap = new Map();
      let groupKey;
      let truncateLabels = false;
      let rotateLabels = false;
      let sortDescending = true;

      // Determine grouping key based on chart view type
      if (chartViewType === "byAccountName") {
        groupKey = "name";
        truncateLabels = true;
        rotateLabels = true;
      } else {
        truncateLabels = true;
        rotateLabels = true;
        groupKey = "productLineCodes"; // Default to product line
      }

      filteredData.forEach((item) => {
        if (groupKey === "productLineCodes") {
          const productLines = Array.isArray(item?.productLineCodes)
            ? item.productLineCodes
            : [];

          productLines.forEach(({ name, seats }) => {
            if (!name) return;
            const current = aggregationMap.get(name) || 0;
            aggregationMap.set(name, current + (seats || 0));
          });
        } else {
          const key = item[groupKey];
          if (!key) return;
          const current = aggregationMap.get(key) || 0;
          aggregationMap.set(key, current + (item.totalSeats || 0));
        }
      });

      // Convert to array and sort
      let sortedData = Array.from(aggregationMap.entries())
        .map(([key, total]) => ({ key, total }))
        .sort((a, b) => b.total - a.total);

      // Sort other views by total descending
      sortedData = sortedData.sort((a, b) => b.total - a.total);

      // Take top 50 (except for years which are limited)
      const topData = sortedData.slice(0, 50);

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
                  if (chartViewType === "byProductLine") {
                    return;
                  } else {
                    handleNumberOfSeatsClick(clickedCategory);
                  }
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
                if (truncateLabels && value.length > 15) {
                  return value.substring(0, 15) + "...";
                }
                return value;
              },
            },
            tooltip: {
              enabled: false, // disable native label tooltip
            },
          },
          tooltip: {
            enabled: true,
            shared: false,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const fullLabel = w.globals.labels[dataPointIndex]; // this is the full, untruncated category
              const value = series[seriesIndex][dataPointIndex];

              return `<div style="padding: 6px 10px;">
                <strong>${fullLabel}</strong>: ${value}
              </div>`;
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

  // Total Account count
  const [accountType, setAccountType] = useState("industry");
  const [accountBar, setAccountBar] = useState("");

  const handleAccountClick = (data) => {
    let allData;
    const isSameColor = accountBar === data;
    if (isSameColor) {
      allData = handleFilters();
    } else {
      allData = filteredData;
    }
    setAccountBar(isSameColor ? "" : data);
    let key;
    if (accountType === "industry") {
      key = "industryGroup";
    } else if (accountType === "segment") {
      key = "industrySegment";
    } else if (accountType === "subSegment") {
      key = "industrySubSegment";
    }
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) => item[key] === data);
    setFilteredData(updatedData);
  };

  const accountTypeChart = useMemo(() => {
    if (filteredData?.length > 0) {
      let aggregationMap = new Map();
      let groupKey;
      let truncateLabels = true;
      let rotateLabels = true;

      // Determine grouping key based on chart view type
      if (accountType === "industry") {
        groupKey = "industryGroup";
      } else if (accountType === "segment") {
        groupKey = "industrySegment";
      } else if (accountType === "subSegment") {
        groupKey = "industrySubSegment";
      }
      if (isThirdPartyAccount) {
        filteredData.forEach((item) => {
          const associatedAccounts = item.associated_account_details;

          if (
            Array.isArray(associatedAccounts) &&
            associatedAccounts.length > 0
          ) {
            associatedAccounts.forEach((account) => {
              const key = account[groupKey]; // industryGroup / industrySegment / industrySubSegment
              if (!key) return;

              const current = aggregationMap.get(key) || 0;
              aggregationMap.set(key, current + 1);
            });
          }
        });
      } else {
        filteredData.forEach((item) => {
          const key = item[groupKey];
          if (!key) return;
          const current = aggregationMap.get(key) || 0;
          aggregationMap.set(key, current + 1);
        });
      }

      // Convert to array and sort
      let sortedData = Array.from(aggregationMap.entries())
        .map(([key, total]) => ({ key, total }))
        .sort((a, b) => b.total - a.total);

      // Sort other views by total descending
      sortedData = sortedData.sort((a, b) => b.total - a.total);

      // Take top 50 (except for years which are limited)
      const topData = sortedData.slice(0, 50);

      // Extract categories and data values
      const categories = topData.map((item) => item.key);
      const seriesData = topData.map((item) => item.total);
      return {
        options: {
          chart: {
            events: {
              xAxisLabelClick: function (event, chartContext, config) {
                if (!isThirdPartyAccount) {
                  const clickedCategory =
                    config?.config?.xaxis?.categories[config.labelIndex];
                  if (clickedCategory) {
                    if (chartViewType === "byProductLine") {
                      return;
                    } else {
                      handleAccountClick(clickedCategory);
                    }
                  }
                }
              },
              legendClick: function (chartContext, seriesIndex, config) {
                if (!isThirdPartyAccount) {
                  const clickedCategory =
                    config?.config?.xaxis?.categories[seriesIndex];
                  if (clickedCategory) {
                    handleAccountClick(clickedCategory);
                  }
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
                if (truncateLabels && value.length > 15) {
                  return value.substring(0, 15) + "...";
                }
                return value;
              },
            },
          },
          yaxis: {
            title: { text: "Total Seats" },
          },
          plotOptions: {
            bar: {
              borderRadius: 5,
              columnWidth: "50%",
              distributed: true,
            },
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
  }, [filteredData, accountType]);

  const handleAccountChange = (viewType) => {
    setAccountType(viewType);
  };

  // Total account as per Account Type
  const [accountType_Type, setAccountType_Type] = useState("account");
  const [accountTypeLegend, setAccountTypeLegend] = useState("");

  const handleAccountTypeLegendClick = (data) => {
    let allData;
    const isSameColor = accountTypeLegend === data;
    if (isSameColor) {
      allData = handleFilters();
    } else {
      allData = filteredData;
    }
    setAccountTypeLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) => item?.account_group === data);

    setFilteredData(updatedData);
  };

  const accountTypePieChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const accountTypeGroups = {};

      filteredData.forEach((item) => {
        const group = item?.account_group || "Unknown";

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
        case "account":
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
      case "account":
      default:
        return "Total Accounts as per Account Type";
    }
  };

  const handleAccountTypeChange = (viewType) => {
    setAccountType_Type(viewType);
  };

  // Total Amount as per Months
  const chartData = useMemo(() => {
    const monthlyData = {};

    // Determine base month (start from selected startDate if available, else current month)
    const baseMonth = dayjs(); // fallback to current month

    // Previous 12 months
    for (let i = 0; i < 12; i++) {
      const monthKey = baseMonth.add(i, "month").format("YYYY-MM");
      monthlyData[monthKey] = { dtp_total: 0, acv_total: 0 };
    }

    // Aggregate DTP and ACV by endDate month
    (totalAmountMonthThirdParty || []).forEach((sub) => {
      const endMonth = dayjs(sub?.subsEndDate).format("YYYY-MM");
      if (monthlyData[endMonth]) {
        monthlyData[endMonth].dtp_total += Number(sub?.totalDTP) || 0;
        monthlyData[endMonth].acv_total += Number(sub?.totalAcv) || 0;
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
  }, [totalAmountMonthThirdParty]);

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

  return (
    <>
      <div className="account">
        <h5 className="commom-header-title mb-0">
          Account Information of the End Customers
        </h5>
        <span className="common-breadcrum-msg">
          List of all Autodesk End Customers. The boxes below show combined
          industry details.
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
              setFilteredData(exportedAccountData);
              setFilters({
                searchValue: "",
                branch: null,
                status: "All Status",
              });
            }}
          >
            All
          </CommonButton>

          <CommonAutocomplete
            onChange={(event, newValue) => {
              setFilters((prev) => ({ ...prev, branch: newValue }));
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
                status: e.target.value,
              }));
            }}
          />

          <CommonSearchInput
            value={filters?.searchValue}
            label="Search Accounts"
            loading={false}
            debounceTime={400}
            onChange={(text) => {
              setFilters((prev) => ({ ...prev, searchValue: text }));
            }}
          />
        </div>
        <div className="subscription-chart number-of-seasts-chart">
          {exportedAccountDataLoading ? (
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
              subCategory={["By Account names", "By Product line"]}
              onSubCategoryClick={(index) => {
                if (index === 0) handleChartViewChange("byAccountName");
                if (index === 1) handleChartViewChange("byProductLine");
              }}
            />
          )}
        </div>

        <div className="subscription-chart number-of-seasts-chart">
          {exportedAccountDataLoading ? (
            <SkeletonLoader />
          ) : (
            <CommonChart
              title={
                accountType === "industry"
                  ? "Total account by industry"
                  : accountType === "segment"
                  ? "Total account by segment"
                  : "Total account by sub-segment"
              }
              options={accountTypeChart?.options}
              series={accountTypeChart?.series}
              subCategory={["Industry", "Segment", "Sub-Segment"]}
              onSubCategoryClick={(index) => {
                if (index === 0) handleAccountChange("industry");
                if (index === 1) handleAccountChange("segment");
                if (index === 2) handleAccountChange("subSegment");
              }}
            />
          )}
        </div>
        {isThirdPartyAccount && (
          <div className="subscription-chart number-of-seasts-chart">
            {exportedAccountDataLoading ? (
              <SkeletonLoader />
            ) : (
              <CommonChart
                title={getAssociatedAccountTitle()}
                options={associatedAccountPieChart?.options}
                series={associatedAccountPieChart?.series}
                className="chart-data-2"
                subCategory={["Account", "DTP", "ACV"]}
                onSubCategoryClick={(index) => {
                  if (index === 0) handleAssociatedAccountChange("account");
                  if (index === 1) handleAssociatedAccountChange("dtp_price");
                  if (index === 2) handleAssociatedAccountChange("acv_price");
                }}
              />
            )}
          </div>
        )}
        {totalAmountMonthThirdPartyLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="subscription-chart number-of-seasts-chart">
            <CommonChart
              title="Total Amount as per Months"
              options={amountPerMonth.options}
              series={amountPerMonth.series}
              className="chart-data-2"
            />
          </div>
        )}

        {exportedAccountDataLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="opportunity-retention-account subscription-chart">
            <CommonChart
              title={getBdPersonTitle()}
              options={bdPersonPieChart?.options}
              series={bdPersonPieChart?.series}
              className="chart-data-2"
              subCategory={["Account", "DTP", "ACV"]}
              onSubCategoryClick={(index) => {
                if (index === 0) handleBdPersonChange("account");
                if (index === 1) handleBdPersonChange("dtp_price");
                if (index === 2) handleBdPersonChange("acv_price");
              }}
            />
            <CommonChart
              title={getAccountTypeTitle()}
              options={accountTypePieChart?.options}
              series={accountTypePieChart?.series}
              className="chart-data-2"
              subCategory={["Account", "DTP", "ACV"]}
              onSubCategoryClick={(index) => {
                if (index === 0) handleAccountTypeChange("account");
                if (index === 1) handleAccountTypeChange("dtp_price");
                if (index === 2) handleAccountTypeChange("acv_price");
              }}
            />
            <CommonChart
              title="Top 12 cities by number of account trend showing between active and inactive"
              options={generateCityBarChartData().options}
              className="chart-data-2"
              series={generateCityBarChartData().series}
            />
          </div>
        )}
        <div className="account-table mt-4">
          {exportedAccountDataLoading ? (
            <SkeletonLoader isDashboard height="350px" />
          ) : (
            <div className="">
              <ExportToExcel
                data={exportedData}
                columns={columns}
                fileName={`account_trisita_${userDetail?.first_name}_${
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
                exportFileName={`account_trisita`}
              />
            </div>
          )}
        </div>
      </div>
      <CommonModal
        isOpen={modal?.isOpen}
        handleClose={() => {
          setModal((prev) => ({
            ...prev,
            isOpen: false,
            isAssign: false,
            id: "",
            type: null,
          }));
        }}
        size={modal?.type === 1 ? "xl" : "lg"}
        scrollable
        title={
          modal?.type === 1
            ? "Subscription Details"
            : modal?.isAssign
            ? `Allocate User and Branch -- ${accountInformation?.name ?? ""}`
            : "Account information detail"
        }
      >
        {modal?.type === 1 ? (
          <SubscriptionDetail />
        ) : modal?.isAssign ? (
          <AssignUserBranch id={modal?.id} handleCallback={handleCallback} />
        ) : (
          <CustomTabs />
        )}
      </CommonModal>
    </>
  );
};

export default Account;
