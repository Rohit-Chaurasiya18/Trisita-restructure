import ReactApexChart from "react-apexcharts";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures, mockGeographyData } from "../constants/index";
import { useEffect, useState } from "react";

export const LineChart = ({ data }) => {
  const chartData = {
    options: {
      chart: {
        id: "seat-date-chart",
        type: "line",
      },
      xaxis: {
        categories: data?.map((item) => item["start Date"]),
        title: {
          text: "Start Date",
        },
      },
      yaxis: {
        title: {
          text: "Seats",
        },
      },
      title: {
        text: "Seats Over Time",
        align: "center",
      },
    },
    series: [
      {
        name: "Seats",
        data: data?.map((item) => item?.seats),
      },
    ],
  };
  return (
    <>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={400}
      />
    </>
  );
};

export const BarChart = ({ data }) => {
  const [seriesData, setSeriesData] = useState([]);
  const [productLines, setProductLines] = useState([]);

  useEffect(() => {
    if (data && typeof data === "object") {
      const productLineKeys = Object.keys(data);
      setProductLines(productLineKeys);

      // Collect all unique cities, excluding "null"
      const allCities = new Set();
      productLineKeys.forEach((line) => {
        Object.keys(data[line]).forEach((city) => {
          // if (city !== "null")
          allCities.add(city);
        });
      });

      // const cities = Array.from(allCities);
      const cities = ["Mumbai", "Kolkata", "Delhi", "Banglore", "null"];
      // console.log(cities);
      // Create series data for each city
      const series = cities.map((city) => ({
        name: city,
        data: productLineKeys.map((line) => data[line][city] || 0),
      }));

      setSeriesData(series);
    }
  }, [data]);

  const chartOptions = {
    chart: {
      id: "bar-chart",
      type: "bar",
      height: 400,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       legend: {
    //         position: "bottom",
    //       },
    //     },
    //   },
    // ],
    xaxis: {
      categories: productLines,
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <ReactApexChart
      options={chartOptions}
      series={seriesData}
      type="bar"
      height={400}
    />
  );
};

export const GeographyChart = ({ isDashboard = true }) => {
  return (
    <ResponsiveChoropleth
      theme={{
        axis: {
          domain: {
            line: {
              stroke: "#e0e0e0",
            },
          },
          legend: {
            text: {
              fill: "#e0e0e0",
            },
          },
          ticks: {
            line: {
              stroke: "#e0e0e0",
              strokeWidth: 1,
            },
            text: {
              fill: "#e0e0e0",
            },
          },
        },
        legends: {
          text: {
            fill: "#e0e0e0",
          },
        },
        tooltip: {
          container: {
            background: "#1F2A40",
            color: "#e0e0e0",
          },
        },
      }}
      data={mockGeographyData}
      features={geoFeatures.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors="nivo"
      domain={[0, 1000000]}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={isDashboard ? 40 : 100}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      enableGraticule={false}
      graticuleLineColor="#444444"
      borderWidth={0.5}
      borderColor="#fff"
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: "#e0e0e0",
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#4cceac",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};
