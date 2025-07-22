export const ACCEPTED_FILE_TYPES = [
  ".png",
  ".jpg",
  ".jpeg",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  "image/*",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
].join(",");


export const getEmptyPieChartConfig = ({
  chartHeight = 350,
  noDataText = "No data available",
} = {}) => {
  return {
    options: {
      chart: {
        type: "pie",
        height: chartHeight,
      },
      labels: [],
      noData: {
        text: noDataText,
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
};

export const getEmptyBarChartConfig = ({
  chartHeight = 350,
  chartWidth = "100%",
  noDataText = "No data available",
} = {}) => {
  return {
    options: {
      chart: {
        type: "bar",
        height: chartHeight,
        width: chartWidth,
      },
      xaxis: {
        categories: [],
        labels: {
          rotate: 0,
        },
      },
      noData: {
        text: noDataText,
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
};
