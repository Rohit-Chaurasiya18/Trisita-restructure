import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getAllUsuages,
  getTaskUsagesData,
  getUsageProductFeatureChart,
} from "../slice/UsuagesSlice";
import CommonTable from "@/components/common/dataTable/CommonTable";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonChart from "@/components/common/chart/CommonChart";

const Usuage = () => {
  const dispatch = useDispatch();
  const { csn, from_date, to_date } = useParams();
  const {
    filter,
    usuagesData,
    usuagesDataLoading,
    login_counts,
    productLineCode,
    userDetail,
  } = useSelector((state) => ({
    filter: state?.layout?.filter,
    usuagesData: state?.usuages?.usuagesData,
    usuagesDataLoading: state?.usuages?.usuagesDataLoading,
    login_counts: state?.usuages?.login_counts,
    productLineCode: state?.usuages?.productLineCode,
    userDetail: state?.login?.userDetail,
  }));
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ product_line_code: null });
  const [featureNameCharts, setFeatureNameCharts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Format date for table
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }, []);

  // Table columns
  const columns = [
    { field: "end_Customer_CSN", headerName: "CSN", width: 200 },
    { field: "account_name", headerName: "Account", width: 200 },
    { field: "usage_Type", headerName: "Usage Type", width: 200 },
    {
      field: "usage_date",
      headerName: "Usage Date",
      width: 200,
    },
    { field: "product_line_code", headerName: "Product Line Code", width: 200 },
    { field: "feature_id", headerName: "Feature Id", width: 200 },
    { field: "feature_name", headerName: "Feature Name", width: 200 },
    { field: "team_name", headerName: "Team Name", width: 200 },
    {
      field: "primary_admin_email",
      headerName: "Primary Admin Email",
      width: 200,
    },
  ];
  const getRowId = (row) => row?.id;

  // Effect: Set filtered data on data load
  useEffect(() => {
    setFilteredData(usuagesData);
  }, [usuagesData]);

  const fetchUsagesData = (taskId) => {
    const pollInterval = 3000; // 3 seconds interval, you can adjust

    const poll = () => {
      dispatch(getTaskUsagesData(taskId)).then((res) => {
        const status = res?.payload?.data?.status;

        if (status === "success") {
          console.log("Task completed successfully");
          // setCurrentState("SUCCESS");
          return; // ✅ stop polling
        } else if (status === "failed") {
          console.error("Task failed");
          // setCurrentState("FAILED");
          return; // ✅ stop polling
        } else if (status === "processing") {
          console.log("Task still in process... polling again");
          setTimeout(poll, pollInterval); // ✅ keep polling
        }
      });
    };

    poll();
  };

  // Effect: Initial data fetch
  useEffect(() => {
    const selectedCsn = filter?.csn !== "All CSN" ? filter?.csn : "";
    dispatch(
      getAllUsuages({
        csn: selectedCsn,
        payload: {
          csn: selectedCsn,
          ccsn: csn?.split(","),
          from_date,
          to_date,
          product_line_code: "",
          user_id: userDetail?.id,
        },
      })
    ).then((res) => {
      if (
        res?.payload?.data?.task_id &&
        res?.payload?.data?.status === "PENDING"
      ) {
        fetchUsagesData(res?.payload?.data?.task_id);
      }
    });
  }, [csn, from_date, to_date, filter?.csn]);

  // Login Chart data
  const { chartOptions, series } = useMemo(() => {
    const uniqueCodes = [
      ...new Set(login_counts?.map((item) => item["Product Line Code"])),
    ];
    const productLineData = {};
    uniqueCodes.forEach((code) => {
      const entries = login_counts?.filter(
        (item) => item["Product Line Code"] === code
      );
      productLineData[code] = {
        categories: entries.map((item) => item["Usage Date"]),
        data: entries.map((item) => (isNaN(item["Count"]) ? 0 : item["Count"])),
      };
    });

    // const mergedData = (productLineData[uniqueCodes[0]]?.categories || []).map(
    //   (date, i) => {
    //     const entry = { Date: date };
    //     uniqueCodes.forEach((code) => {
    //       entry[code] = productLineData[code]?.data[i] || 0;
    //     });
    //     return entry;
    //   }
    // );
    const mergedMap = new Map();

    // Step 1: Loop through each product line
    Object.entries(productLineData).forEach(
      ([productLine, { categories, data }]) => {
        categories.forEach((date, index) => {
          if (!mergedMap.has(date)) {
            mergedMap.set(date, { Date: date });
          }
          mergedMap.get(date)[productLine] = data[index];
        });
      }
    );

    // Step 2: Get all product lines (to fill 0s later)
    const allProductLines = Object.keys(productLineData);

    // Step 3: Fill missing product line values with 0
    const mergedData = Array.from(mergedMap.values()).map((entry) => {
      allProductLines.forEach((line) => {
        if (!(line in entry)) {
          entry[line] = 0;
        }
      });
      return entry;
    });

    return {
      chartOptions: {
        chart: {
          type: "line",
          height: 350,
          dropShadow: { enabled: true },
          toolbar: { show: false },
        },
        dataLabels: { enabled: true },
        stroke: { curve: "smooth" },
        title: { text: "Login Counts Over Time", align: "left" },
        grid: {
          borderColor: "#e7e7e7",
          row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
        },
        markers: { size: 1 },
        xaxis: {
          categories: mergedData.map((item) => item.Date),
          title: { text: "Date" },
        },
        yaxis: { title: { text: "Login Count" }, min: 0 },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
        responsive: [
          {
            breakpoint: 402,
            options: {
              legend: {
                position: "bottom",
                horizontalAlign: "center",
                offsetY: 25,
                offsetX: 0,
              },
            },
          },
        ],
      },
      series: uniqueCodes.map((code) => ({
        name: code,
        data: mergedData.map((item) => item[code]),
      })),
    };
  }, [login_counts]);

  // Fetch product line chart
  const handleSelect = useCallback(() => {
    const selectedCsn = filter?.csn !== "All CSN" ? filter?.csn : "";
    const productCode = filters?.product_line_code?.value || "";

    const payload = {
      csn: selectedCsn,
      ccsn: csn?.split(","),
      from_date,
      to_date,
      product_line_code: productCode,
    };

    setIsLoading(true);
    dispatch(getUsageProductFeatureChart(payload)).then((res) => {
      if (res?.payload?.status === 200) {
        setFeatureNameCharts(res?.payload?.data?.feature_name_counts || []);
      }
      setIsLoading(false);
    });

    setFilteredData(
      productCode
        ? usuagesData.filter((item) => item?.product_line_code === productCode)
        : usuagesData
    );
  }, [filters?.product_line_code, filter?.csn]);

  useEffect(() => {
    handleSelect();
  }, [handleSelect]);

  // Feature Chart data
  const productLineChart = useMemo(() => {
    const dates = [
      ...new Set(featureNameCharts?.map((item) => item["Usage Date"])),
    ];
    const features = [
      ...new Set(featureNameCharts?.map((item) => item["Feature Name"])),
    ];

    return {
      options: {
        chart: { type: "line", height: 350 },
        xaxis: { categories: dates, title: { text: "Usage Dates" } },
        yaxis: { title: { text: "Counts" } },
        title: { text: "Feature Name Metrics Over Time", align: "center" },
        tooltip: {
          shared: true,
          intersect: false,
          y: { formatter: (val) => `${val} counts` },
        },
      },
      series: features.map((name) => ({
        name,
        data: dates.map((date) => {
          const found = featureNameCharts?.find(
            (item) =>
              item["Usage Date"] === date && item["Feature Name"] === name
          );
          return found?.["Count"] || 0;
        }),
      })),
    };
  }, [featureNameCharts]);

  return (
    <>
      <div className="usuages-header-container">
        <div>
          <div className="commom-header-title mb-0">Usages</div>
          <span className="common-breadcrum-msg">Welcome to your Team</span>
        </div>
        <div>
          <CommonButton
            onClick={() => {
              window.open(
                `/get_usage/usage_user_count/${csn}/${from_date}/${to_date}`,
                "_blank"
              );
            }}
          >
            Unique User Count
          </CommonButton>
        </div>
      </div>

      {usuagesDataLoading ? (
        <SkeletonLoader />
      ) : (
        <CommonChart
          title="Data of direct seat metrics i.e. 1:1 association between product pool and agreement (without prorated)"
          options={chartOptions}
          series={series}
        />
      )}

      <div className="product-line-chart">
        <CommonAutocomplete
          onChange={(e, value) =>
            setFilters((prev) => ({ ...prev, product_line_code: value }))
          }
          options={productLineCode?.map((code) => ({
            label: code,
            value: code,
          }))}
          label="Select a product line"
          loading={usuagesDataLoading}
          value={filters?.product_line_code}
        />

        {isLoading ? (
          <SkeletonLoader />
        ) : featureNameCharts?.length ? (
          <CommonChart
            options={productLineChart.options}
            series={productLineChart.series}
          />
        ) : (
          <div className="no-data-available">No data available</div>
        )}
      </div>

      {usuagesDataLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="usages-table-container">
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={getRowId}
            toolbar
            exportFileName="usages"
            moduleName="Usages"
          />
        </div>
      )}
    </>
  );
};

export default Usuage;
