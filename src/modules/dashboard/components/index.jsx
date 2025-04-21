import ReactApexChart from "react-apexcharts";
import { ResponsiveChoropleth } from "@nivo/geo";
import {
  chartData,
  ColoumnCharts,
  geoFeatures,
  mockGeographyData,
} from "../constants/index";

export const LineChart = () => (
  <ReactApexChart
    options={chartData.options}
    series={chartData.series}
    type="line"
    height={400}
  />
);
export const BarChart = () => (
  <ReactApexChart
    options={ColoumnCharts.options}
    series={ColoumnCharts.series}
    type="bar"
    height={400}
  />
);
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
