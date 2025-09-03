import CommonButton from "@/components/common/buttons/CommonButton";
import CommonChart from "@/components/common/chart/CommonChart";
import CustomSweetAlert from "@/components/common/customSweetAlert/CustomSweetAlert";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { getEmptyPieChartConfig, userType } from "@/constants";
import useDebounce from "@/hooks/useDebounce";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { getSalesStage } from "@/modules/newQuotation/slice/quotationSlice";
import {
  generateQuotation,
  getNewOpportunityData,
  lockUnlockOpportunity,
} from "@/modules/opportunity/slice/opportunitySlice";
import routesConstants from "@/routes/routesConstants";
import { FaLock, FaUnlock } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NewOpportunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    newOpportunityData,
    newOpportunityDataLoading,
    branch_list,
    branchListLoading,
    salesStageList,
    salesStageListLoading,
    last_updated,
    userDetail,
  } = useSelector((state) => ({
    newOpportunityData: state?.opportunity?.newOpportunityData,
    newOpportunityDataLoading: state?.opportunity?.newOpportunityDataLoading,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    salesStageList: state?.quotation?.salesStage,
    salesStageListLoading: state?.quotation?.salesStageLoading,
    last_updated: state?.opportunity?.newOpportunityDataLastUpdated,
    userDetail: state?.login?.userDetail,
  }));

  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [opportunityBarChart, SetOpportunityBarChart] = useState([]);
  const [opportunityAccountDataSecondGraph, SetOpportunityDataSecondGraph] =
    useState([]);

  const [filters, setFilters] = useState({
    branch: null,
    salesStage: null,
    from_date: "",
    to_date: "",
  });
  const [generateQuotationItem, setGenerateItemQuotation] = useState({
    loading: false,
    id: null,
  });

  const handleDateChange = (newValue) => {
    const [start, end] = newValue;
    setFilters((prev) => ({
      ...prev,
      from_date: start?.format("YYYY-MM-DD") || null,
      to_date: end ? end.format("YYYY-MM-DD") : "",
    }));

    setDateRange(newValue);
  };

  useEffect(() => {
    setFilteredData(newOpportunityData);
  }, [newOpportunityData]);

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getSalesStage());
  }, []);

  const debounce = useDebounce(filters?.to_date, 500);

  const handleFetchData = () => {
    const payload = {
      branch: filters?.branch?.value,
      salesStage: filters?.salesStage?.value,
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
    dispatch(getNewOpportunityData(payload));
  };

  useEffect(() => {
    handleFetchData();
  }, [filters?.branch, filters?.salesStage, debounce]);

  const handleLockUnlock = (row, is_locked) => {
    dispatch(lockUnlockOpportunity({ id: row?.id, status: !is_locked })).then(
      (res) => {
        if (res?.payload?.status === 200) {
          handleFetchData();
          toast.success(
            `Quotation ${!is_locked ? "locked" : "unlocked"} successfully.`
          );
        }
      }
    );
  };

  // Table column definitions
  const columns = useMemo(
    () => [
      {
        field: "contract_no",
        headerName: "Opportunity No",
        width: 250,
        renderCell: (params) => (
          <Tooltip title={params?.value || ""}>
            <button
              className={`text-red-600  border-0`}
              onClick={() => {
                navigate(
                  routesConstants?.NEW_OPPORTUNITY + `/${params?.row?.id}`
                );
              }}
            >
              <span className="table-cell-truncate">{params.value}</span>
            </button>
          </Tooltip>
        ),
      },
      {
        field: "contract_date",
        headerName: "Opportunity Date",
        width: 200,
        renderCell: (params) => (
          <div>
            {params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}
          </div>
        ),
      },

      {
        field: "is_locked",
        headerName: "Lock / Unlock",
        width: 150,
        renderCell: (params) => (
          <div className="flex items-center w-full justify-center">
            {!params?.row.is_locked ? (
              <button
                onClick={() => {
                  handleLockUnlock(params?.row, params?.row?.is_locked);
                }}
                className={
                  "action-button bg-transparent text-center px-3 py-1 rounded border-0"
                }
              >
                <FaUnlock color="rgb(34 197 94 / 1)" />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLockUnlock(params?.row, params?.row?.is_locked);
                }}
                className={
                  "action-button bg-transparent text-center px-3 py-1 rounded border-0"
                }
              >
                <FaLock color="rgb(239 68 68 / 1)" />
              </button>
            )}
          </div>
        ),
      },

      { field: "branch_name", headerName: "Branch", width: 200 },
      {
        field: "bd_person_details",
        headerName: "BD Person",
        width: 200,
        renderCell: ({ value }) => {
          let Arr = value?.join(", ");
          return <div>{Arr}</div>;
        },
      },
      { field: "account_name", headerName: "Account Name", width: 250 },
      { field: "segment", headerName: "Account Group", width: 250 },
      { field: "account_type", headerName: "Account Type", width: 250 },
      {
        field: "ews_retention_health",
        headerName: "Retention Health",
        width: 250,
      },
      { field: "customer_type", headerName: "Customer Type", width: 250 },
      {
        field: "location",
        headerName: "Location",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "opportunity_category",
        headerName: "Opportunity Category",
        width: 250,
      },
      { field: "opportunity_type", headerName: "Opportunity Type", width: 250 },
      { field: "product_name", headerName: "Product", width: 250 },
      { field: "industry_group", headerName: "Industry", width: 250 },
      {
        field: "quantity",
        headerName: "Quantity",
        width: 150,
        renderCell: (params) => <div>{Number(params.value)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "acv_price",
        headerName: "ACV Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "acv_total",
        headerName: "Total ACV Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "dtp_price",
        headerName: "DTP Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "dtp_total",
        headerName: "Total DTP Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "last_quoated_price",
        headerName: "Last Quoated Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "total_last_quotated_price",
        headerName: "Total Last Quoated Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "purchase_amount",
        headerName: "Purchase Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "total_purchase_amount",
        headerName: "Total Purchase Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "total_gp",
        headerName: "Total GP",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "sales_name",
        headerName: "Sales Stage",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "oem_quarter",
        headerName: "OEM Quarter",
        width: 200,
        renderCell: (params) => {
          return (
            <div>{params?.row?.financial_year + " " + params?.row?.quater}</div>
          );
        },
      },
      {
        field: "month",
        headerName: "Month",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "week",
        headerName: "Week",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "sales_update_date",
        headerName: "Closure date",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "created_at",
        headerName: "Created At",
        width: 200,
        renderCell: (params) => (
          <div>{moment(params?.value).format("DD MMM YYYY [at] hh:mm A")}</div>
        ),
      },
      {
        field: "updated_at",
        headerName: "Updated At",
        width: 200,
        renderCell: (params) => (
          <div>{moment(params?.value).format("DD MMM YYYY [at] hh:mm A")}</div>
        ),
      },
      {
        field: "action",
        headerName: "Action",
        width: 180,
        renderCell: (params, index) => (
          <>
            {params?.row?.opportunity_type !== "Renewal" && (
              <span
                onClick={() => {
                  if (params?.row?.is_genrated_quota) {
                    return;
                  } else {
                    CustomSweetAlert(
                      "Generate Quotation?",
                      "Are you sure you want to generate quotation for this opportunity?",
                      "Warning",
                      true,
                      "Yes, Generate Quotation",
                      "Cancel",
                      (result) => {
                        if (result.isConfirmed) {
                          setGenerateItemQuotation({
                            loading: true,
                            id: params?.row?.opportunity_number,
                          });
                          let payload = {
                            id: params?.row?.id,
                            branch: params?.row?.branch,
                            bd_person: params?.row?.bd_person_ids,
                            account: params?.row?.account,
                            opportunity_type: params?.row?.opportunity_type,
                            product_master_ids: [params?.row?.product_master],
                          };
                          dispatch(generateQuotation(payload)).then((res) => {
                            if (
                              res?.payload?.status === 201 ||
                              res?.payload?.status === 200
                            ) {
                              toast.success(
                                "New quotation generated successfully"
                              );
                              handleFetchData();
                            }
                            setGenerateItemQuotation({
                              loading: false,
                              id: null,
                            });
                          });
                        }
                      }
                    );
                  }
                }}
                className={`assign-button text-black px-3 py-1 rounded border-0 ${
                  params?.row?.is_genrated_quota && "cursor-not-allowed"
                }`}
                aria-disabled={
                  (generateQuotationItem?.loading &&
                    generateQuotationItem?.id ===
                      params?.row?.opportunity_number) ||
                  params?.row?.is_genrated_quota
                }
              >
                {generateQuotationItem?.loading &&
                generateQuotationItem?.id === params?.row?.opportunity_number
                  ? "Generating..."
                  : "Generate Quotation"}
              </span>
            )}
          </>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (filteredData) {
      processChartData(filteredData);
    }
  }, [filteredData]);

  const processChartData = (data) => {
    const accountNameCounts = {};

    const hasToDate = !!filters?.to_date;
    const baseMonth = hasToDate ? dayjs(filters.to_date) : dayjs();

    const last12Months = [];
    const monthlyOpportunityCountMap = {};

    if (hasToDate) {
      // If end date is present: show previous 12 months ending with to_date
      for (let i = 11; i >= 0; i--) {
        const month = baseMonth.subtract(i, "month");
        const monthKey = month.format("YYYY-MM");
        const monthLabel = month.format("MMM YYYY");
        last12Months.push({ key: monthKey, label: monthLabel });
        monthlyOpportunityCountMap[monthKey] = 0;
      }
    } else {
      // No end date: center current month (5 before, 6 after)
      for (let i = -5; i <= 6; i++) {
        const month = baseMonth.add(i, "month");
        const monthKey = month.format("YYYY-MM");
        const monthLabel = month.format("MMM YYYY");
        last12Months.push({ key: monthKey, label: monthLabel });
        monthlyOpportunityCountMap[monthKey] = 0;
      }
    }

    // Count opportunities per month
    data.forEach((item) => {
      const contractMonth = dayjs(item.contract_date).format("YYYY-MM");

      if (monthlyOpportunityCountMap.hasOwnProperty(contractMonth)) {
        monthlyOpportunityCountMap[contractMonth] += 1;
      }

      if (item?.account_name) {
        accountNameCounts[item.account_name] =
          (accountNameCounts[item.account_name] || 0) + 1;
      }
    });

    // Final chart data
    const modifiedData = last12Months.map((month) => ({
      label: month.label,
      value: monthlyOpportunityCountMap[month.key],
    }));

    SetOpportunityBarChart(modifiedData);

    // Top 25 accounts
    const top25 = Object.entries(accountNameCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25);

    SetOpportunityDataSecondGraph(Object.fromEntries(top25));
  };

  // All Opportunity data
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
          name: "Opportunity Count",
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
      allData = newOpportunityData;
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
            const isHighlighted = seriesName === accountNameLegend;
            const count = opts.w.globals.series[opts.seriesIndex];
            return `<span style="color: ${
              isHighlighted ? "red" : "black"
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
      series: secondgraphdata,
    }),
    [secondgraphlabel]
  );

  // Opportunity Category
  const [opportunityCategoryType, setOpportunityCategoryType] =
    useState("opportunity");
  const [opportunityCategoryLegend, setOpportunityCategoryLegend] =
    useState("");

  const handleRiskRetentionLegendClick = (data) => {
    let allData;
    const isSameColor = opportunityCategoryLegend === data;
    if (isSameColor) {
      allData = newOpportunityData;
    } else {
      allData = filteredData;
    }
    setOpportunityCategoryLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown"
            ? item?.opportunity_category === data
            : !item?.opportunity_category
        );

    setFilteredData(updatedData);
  };
  const opportunityCategoryBarChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const retentionRiskGroups = {};
      filteredData.forEach((item) => {
        const group = item?.opportunity_category || "Unknown";
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
        retentionRiskGroups[group].dtp += parseFloat(item.dtp_total) || 0;
        retentionRiskGroups[group].acv += parseFloat(item.acv_total) || 0;
      });
      // Convert to arrays for the chart
      const labels = Object.keys(retentionRiskGroups);
      let series;

      switch (opportunityCategoryType) {
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
        case "opportunity":
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
              const isHighlighted = seriesName === opportunityCategoryLegend;
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
  }, [filteredData, opportunityCategoryType]);

  const getOpportunityCategoryTitle = () => {
    switch (opportunityCategoryType) {
      case "dtp_price":
        return "Total opportunity as per Opportunity Category for the dtp price";
      case "acv_price":
        return "Total opportunity as per Opportunity Category for the acv price";
      case "opportunity":
      default:
        return "Total opportunity as per Opportunity Category";
    }
  };

  const handleOpportunityCategoryChange = (viewType) => {
    setOpportunityCategoryType(viewType);
  };

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
      const endMonth = dayjs(sub?.contract_date).format("YYYY-MM");
      if (monthlyData[endMonth]) {
        monthlyData[endMonth].dtp_total += Number(sub?.acv_total) || 0;
        monthlyData[endMonth].acv_total += Number(sub?.dtp_total) || 0;
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

  //GP Graph
  const GPChartData = useMemo(() => {
    const monthlyData = {};

    // Determine base month (start from selected startDate if available, else current month)
    const baseMonth = filters?.to_date ? dayjs(filters.to_date) : dayjs(); // fallback to current month

    // Previous 12 months
    for (let i = 11; i >= 0; i--) {
      const monthKey = baseMonth.subtract(i, "month").format("YYYY-MM");
      monthlyData[monthKey] = { gp_total: 0 };
    }

    // Aggregate DTP and ACV by endDate month
    (filteredData || []).forEach((sub) => {
      const endMonth = dayjs(sub?.contract_date).format("YYYY-MM");
      if (monthlyData[endMonth]) {
        monthlyData[endMonth].gp_total += Number(sub?.total_gp) || 0;
      }
    });

    const categories = Object.keys(monthlyData);
    const GPData = categories.map((month) =>
      parseFloat(monthlyData[month].gp_total.toFixed(2))
    );

    return { categories, GPData };
  }, [filteredData, filters?.startDate]);

  const GPMonth = {
    options: {
      chart: { height: 350, type: "bar" },
      xaxis: {
        categories: GPChartData.categories,
        title: { text: "Months" },
      },
      yaxis: {
        title: { text: "Price" },
      },
      colors: ["#007BFF"],
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "50%",
        },
      },
    },
    series: [{ name: "GP Price", data: GPChartData.GPData }],
  };
  // Total Opportunity as per Account Group
  const [accountGroupType, setAccountGroupType] = useState("opportunity");
  const [accountGroupLegend, setAccountGroupLegend] = useState("");

  const handleAccountGroupLegendClick = (data) => {
    let allData;
    const isSameColor = accountGroupLegend === data;
    if (isSameColor) {
      allData = newOpportunityData;
    } else {
      allData = filteredData;
    }
    setAccountGroupLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown" ? item?.segment === data : !item?.segment
        );

    setFilteredData(updatedData);
  };
  const accountGroupBarChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by account_group based on selected type
      const accountGroups = {};

      filteredData.forEach((item) => {
        const group = item?.segment || "Unknown";

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
        accountGroups[group].dtp += parseFloat(item.dtp_total) || 0;
        accountGroups[group].acv += parseFloat(item.acv_total) || 0;
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
        case "opportunity":
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
      case "opportunity":
      default:
        return "Total Opportunity as per Account Group";
    }
  };

  const handleAccountGroupChange = (viewType) => {
    setAccountGroupType(viewType);
  };

  // Total Opportunity as per BD Person
  const [bdPersonType, setBdPersonType] = useState("opportunity");
  const [bdPersonLegend, setBdPersonLegend] = useState("");

  const handleBDPersonLegendClick = (data) => {
    let allData;
    const isSameColor = bdPersonLegend === data;
    if (isSameColor) {
      allData = newOpportunityData;
    } else {
      allData = filteredData;
    }
    setBdPersonLegend(isSameColor ? "" : data);
    const updatedData = isSameColor
      ? allData
      : allData?.filter((item) =>
          data !== "Unknown"
            ? item?.bd_person_details?.includes(data)
            : item?.bd_person_details?.length === 0
        );

    setFilteredData(updatedData);
  };

  const bdPersonPieChart = useMemo(() => {
    if (filteredData?.length) {
      // Aggregate data by BD person based on selected type
      const bdPersonGroups = {};

      filteredData.forEach((item) => {
        const bdPersons =
          item?.bd_person_details?.length > 0
            ? item?.bd_person_details
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
            parseFloat(item.dtp_total) || 0;
          bdPersonGroups[normalizedPerson].acv +=
            parseFloat(item.acv_total) || 0;
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
        case "opportunity":
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
      case "opportunity":
      default:
        return "Total Opportunity as per BD Person";
    }
  };

  const handleBdPersonChange = (viewType) => {
    setBdPersonType(viewType);
  };

  // Total Opportunity as per Account Type
  const [accountType_Type, setAccountType_Type] = useState("opportunity");
  const [accountTypeLegend, setAccountTypeLegend] = useState("");

  const handleAccountTypeLegendClick = (data) => {
    let allData;
    const isSameColor = accountTypeLegend === data;
    if (isSameColor) {
      allData = newOpportunityData;
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
        accountTypeGroups[group].dtp += parseFloat(item.dtp_total) || 0;
        accountTypeGroups[group].acv += parseFloat(item.acv_total) || 0;
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
        case "opportunity":
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
      case "opportunity":
      default:
        return "Total Opportunity as per Account Type";
    }
  };

  const handleAccountTypeChange = (viewType) => {
    setAccountType_Type(viewType);
  };

  const showGpGraph = useMemo(() => {
    return [userType.superadmin, userType.bdManager].includes(
      userDetail?.user_type
    );
  }, [userDetail]);

  return (
    <div className="opportunity-container">
      <div className="quotation-header mb-5">
        <div>
          <h5 className="commom-header-title mb-0">New Opportunity</h5>
          <span className="common-breadcrum-msg">
            Manage your new opportunity
          </span>
        </div>
        <div className="quotation-filter">
          <CommonButton
            className="common-green-btn"
            style={{ width: "fit-content" }}
            onClick={() => {
              navigate(
                `${
                  routesConstants?.NEW_OPPORTUNITY +
                  routesConstants?.ADD_NEW_OPPORTUNITY
                }`
              );
            }}
          >
            Add New Opportunity
          </CommonButton>
        </div>
      </div>
      <div className="subscription-header mb-4 opportunity-filter">
        <div className="subscription-filter">
          {/* <Tooltip
            title={moment(last_updated).format("MMMM D, YYYY [at] h:mm:ss A")}
            placement="top"
          >
            <span>Last Updated</span>
          </Tooltip> */}
          <CommonButton
            className="common-green-btn"
            onClick={() => {
              setFilters({
                branch: null,
                from_date: null,
                to_date: null,
                salesStage: null,
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
            disabled={newOpportunityDataLoading}
          />
          <CommonAutocomplete
            onChange={(event, newValue) => {
              setFilters((prev) => ({
                ...prev,
                salesStage: newValue,
              }));
            }}
            options={salesStageList?.map((item) => ({
              label: item?.name,
              value: item?.id,
            }))}
            label="Select a Sales Stage"
            loading={salesStageListLoading}
            value={filters?.salesStage}
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

      {newOpportunityDataLoading ? (
        <div className="mt-2">
          <SkeletonLoader />
        </div>
      ) : (
        <div className="opportunity-chart-section">
          <CommonChart
            title="All Opportunity data"
            options={LineChartData.options}
            series={LineChartData.series}
          />
          <div className="opportunity-retention-account subscription-chart">
            <CommonChart
              title={getOpportunityCategoryTitle()}
              options={opportunityCategoryBarChart?.options}
              series={opportunityCategoryBarChart?.series}
              className="chart-data-2"
              subCategory={["Opportunity", "DTP", "ACV"]}
              onSubCategoryClick={(index) => {
                if (index === 0) handleOpportunityCategoryChange("opportunity");
                if (index === 1) handleOpportunityCategoryChange("dtp_price");
                if (index === 2) handleOpportunityCategoryChange("acv_price");
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
      {newOpportunityDataLoading ? (
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
      {showGpGraph && (
        <>
          {newOpportunityDataLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="account-industry-chart-2 mt-4 new-subs-amountPerMonth">
              <CommonChart
                title="Total GP as per Months"
                options={GPMonth.options}
                series={GPMonth.series}
                className="chart-data-2"
              />
            </div>
          )}
        </>
      )}

      {newOpportunityDataLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="account-industry-chart-2 mt-4 subscription-chart">
          <CommonChart
            title={getAccountGroupTitle()}
            options={accountGroupBarChart?.options}
            series={accountGroupBarChart?.series}
            className="chart-data-1"
            subCategory={["Opportunity", "DTP", "ACV"]}
            onSubCategoryClick={(index) => {
              if (index === 0) handleAccountGroupChange("opportunity");
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
              subCategory={["Opportunity", "DTP", "ACV"]}
              onSubCategoryClick={(index) => {
                if (index === 0) handleBdPersonChange("opportunity");
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
                if (index === 0) handleAccountTypeChange("opportunity");
                if (index === 1) handleAccountTypeChange("dtp_price");
                if (index === 2) handleAccountTypeChange("acv_price");
              }}
            />
          </div>
        </div>
      )}

      {newOpportunityDataLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="new-opp-table">
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row?.id}
            // checkboxSelection
            toolbar
            exportFileName={`new_opp_trisita`}
            moduleName="New Opportunity"
          />
        </div>
      )}
    </div>
  );
};
export default NewOpportunity;
