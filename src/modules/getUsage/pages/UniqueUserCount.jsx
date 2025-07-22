import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tooltip } from "@mui/material";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import { getUniqueUsageUserCount } from "../slice/UsuagesSlice";
import CommonChart from "@/components/common/chart/CommonChart";

const UniqueUserCount = () => {
  const dispatch = useDispatch();
  const { csn, from_date, to_date } = useParams();

  const {
    filter,
    uniqueUsageUserLoginCounts = [],
    uniqueUsageUserCount = [],
    uniqueUsageUserCountLoading,
  } = useSelector((state) => ({
    filter: state.layout?.filter,
    uniqueUsageUserLoginCounts: state.usuages?.uniqueUsageUserLoginCounts,
    uniqueUsageUserCount: state.usuages?.uniqueUsageUserCount,
    uniqueUsageUserCountLoading: state.usuages?.uniqueUsageUserCountLoading,
  }));

  useEffect(() => {
    dispatch(
      getUniqueUsageUserCount({
        csn: filter?.csn !== "All CSN" ? filter?.csn : "",
        ccsn: csn?.split(","),
        from_date,
        to_date,
      })
    );
  }, [dispatch, csn, from_date, to_date, filter?.csn]);

  // Memoized chart data
  const { series, categories } = useMemo(() => {
    const productMap = {};

    uniqueUsageUserLoginCounts.forEach(
      ({ "Product Line Code": code, "Usage Date": date, Count }) => {
        if (!productMap[code]) productMap[code] = {};
        productMap[code][date] = isNaN(Count) ? 0 : Count;
      }
    );

    const allDates = [
      ...new Set(uniqueUsageUserLoginCounts.map((d) => d["Usage Date"])),
    ].sort((a, b) => new Date(a) - new Date(b));

    const series = Object.entries(productMap).map(([code, values]) => ({
      name: code,
      data: allDates.map((date) => values[date] || 0),
    }));

    return { series, categories: allDates };
  }, [uniqueUsageUserLoginCounts]);

  // ApexCharts config
  const options = useMemo(
    () => ({
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
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
      xaxis: { categories, title: { text: "Date" } },
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
    }),
    [categories]
  );

  // Table column definition
  const columns = useMemo(
    () => [
      { field: "user_id", headerName: "User ID", width: 600 },
      { field: "end_Customer_CSN", headerName: "CSN", width: 200 },
      {
        field: "account_name",
        headerName: "Account",
        width: 200,
        renderCell: ({ value }) => (
          <Tooltip title={value || ""}>
            <span className="text-gray-500">{value}</span>
          </Tooltip>
        ),
      },
      { field: "usage_Type", headerName: "Usage Type", width: 200 },
      {
        field: "usage_date",
        headerName: "Usage Date",
        width: 200,
        renderCell: ({ row }) =>
          new Date(row["usage_date"]).toLocaleDateString(),
      },
      {
        field: "product_line_code",
        headerName: "Product Line Code",
        width: 200,
      },
      {
        field: "feature_id",
        headerName: "Feature ID",
        width: 300,
        renderCell: ({ value }) => (
          <Tooltip title={value || ""}>
            <span className="text-gray-500">{value}</span>
          </Tooltip>
        ),
      },
      {
        field: "feature_name",
        headerName: "Feature Name",
        width: 300,
        renderCell: ({ value }) => (
          <Tooltip title={value || ""}>
            <span className="text-gray-500">{value}</span>
          </Tooltip>
        ),
      },
      { field: "team_name", headerName: "Team Name", width: 200 },
      {
        field: "primary_admin_email",
        headerName: "Primary Admin Email",
        width: 200,
      },
    ],
    []
  );

  return (
    <>
      <div className="commom-header-title mb-0">Unique User Usages</div>
      <span className="common-breadcrum-msg">Welcome to your Team</span>

      <div className="mt-4">
        {uniqueUsageUserCountLoading ? (
          <SkeletonLoader />
        ) : (
          <CommonChart
            title="Data of direct seat metrics i.e. 1:1 association between product pool and agreement (without prorated)"
            options={options}
            series={series}
          />
        )}

        {uniqueUsageUserCountLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="unique-user-count-table">
            <CommonTable
              rows={uniqueUsageUserCount}
              columns={columns}
              getRowId={(row) => row?.id}
              toolbar
              exportFileName="unique_user_usages"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default UniqueUserCount;
