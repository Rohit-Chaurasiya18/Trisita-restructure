import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllUsuages } from "../slice/UsuagesSlice";
import CommonTable from "@/components/common/dataTable/CommonTable";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import ReactApexChart from "react-apexcharts";

const CommonChart = ({ title, options, series }) => (
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

const Usuage = () => {
  const { csn, from_date, to_date } = useParams();
  const dispatch = useDispatch();

  const { filter, usuagesData, usuagesDataLoading, login_counts } = useSelector(
    (state) => ({
      filter: state?.layout?.filter,
      usuagesData: state?.usuages?.usuagesData,
      usuagesDataLoading: state?.usuages?.usuagesDataLoading,
      login_counts: state?.usuages?.login_counts,
    })
  );

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(usuagesData);
  }, [usuagesData]);

  useEffect(() => {
    const payload = {
      ccsn: csn,
      from_date,
      product_line_code: "",
      to_date,
    };

    dispatch(
      getAllUsuages({
        csn: filter?.csn !== "All CSN" ? filter?.csn : "",
        payload,
      })
    );
  }, [filter?.csn, csn, from_date, to_date, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const columns = useMemo(
    () => [
      { field: "end_Customer_CSN", headerName: "CSN", flex: 1 },
      { field: "account_name", headerName: "Account", flex: 1 },
      { field: "usage_Type", headerName: "Usage Type", flex: 1 },
      {
        field: "usage_date",
        headerName: "Usage Date",
        flex: 1,
        renderCell: (params) => formatDate(params.row["usage_date"]),
      },
      { field: "product_line_code", headerName: "Product Line Code", flex: 1 },
      { field: "feature_id", headerName: "Feature Id", flex: 1 },
      { field: "feature_name", headerName: "Feature Name", flex: 1 },
      { field: "team_name", headerName: "Team Name", flex: 1 },
      {
        field: "primary_admin_email",
        headerName: "Primary Admin Email",
        flex: 1,
      },
    ],
    []
  );

  const getRowId = useMemo(() => {
    let uniqueIdCounter = 1;
    return () => uniqueIdCounter++;
  }, []);

  const { chartOptions, series } = useMemo(() => {
    const uniqueProductLineCodes = [
      ...new Set(login_counts?.map((count) => count["Product Line Code"])),
    ];
    const productLineData = {};

    uniqueProductLineCodes.forEach((code) => {
      const entries = login_counts?.filter(
        (item) => item["Product Line Code"] === code
      );
      if (entries?.length) {
        productLineData[code] = {
          categories: entries.map((item) => item["Usage Date"]),
          data: entries.map((item) =>
            isNaN(item["Count"]) ? 0 : item["Count"]
          ),
        };
      }
    });

    const mergedData = (
      productLineData[uniqueProductLineCodes[0]]?.categories || []
    ).map((date, index) => {
      const entry = { Date: date };
      uniqueProductLineCodes.forEach((code) => {
        entry[code] = productLineData[code]?.data[index] || 0;
      });
      return entry;
    });

    const series = uniqueProductLineCodes.map((code) => ({
      name: code,
      data: mergedData.map((item) => item[code]),
    }));

    const chartOptions = {
      series,
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
      title: {
        text: "Login Counts Over Time",
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
      },
      markers: { size: 1 },
      xaxis: {
        categories: mergedData.map((item) => item.Date),
        title: { text: "Date" },
      },
      yaxis: {
        title: { text: "Login Count" },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    };

    return { chartOptions, series };
  }, [login_counts]);

  return (
    <>
      <div className="commom-header-title mb-0">Usages</div>
      <span className="common-breadcrum-msg">Welcome to your Team</span>
      {usuagesDataLoading ? (
        <SkeletonLoader isDashboard />
      ) : (
        <CommonChart
          title="Data of direct seat metrics i.e. 1:1 association between product pool and agreement (without prorated)"
          options={chartOptions}
          series={series}
        />
      )}
      {usuagesDataLoading ? (
        <SkeletonLoader isDashboard />
      ) : (
        <div className="usages-table-container">
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={getRowId}
            toolbar
            exportFileName="usuages"
          />
        </div>
      )}
    </>
  );
};

export default Usuage;
