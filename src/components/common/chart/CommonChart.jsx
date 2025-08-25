import Cookies from "@/services/cookies";
import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

const CommonChart = ({
  title,
  options,
  series,
  className,
  subCategory,
  onSubCategoryClick,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isDownloadAllow = useMemo(
    () => Cookies.get("user")?.is_download_allow,
    []
  );
  const updatedOptions = {
    ...options,
    chart: {
      ...options.chart,
      toolbar: {
        show: isDownloadAllow,
      },
    },
  };
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
          options={updatedOptions}
          series={series}
          type={options.chart.type}
          height={options.chart.height}
        />
      </div>
    </div>
  );
};
export default CommonChart;
