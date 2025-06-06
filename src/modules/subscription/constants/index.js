export const amountPerMOnth = {
  options: {
    chart: {
      height: 350,
      type: "bar",
    },
    xaxis: {
      categories: [
        "2025-05",
        "2025-06",
        "2025-07",
        "2025-08",
        "2025-09",
        "2025-10",
        "2025-11",
        "2025-12",
        "2026-01",
        "2026-02",
        "2026-03",
        "2026-04",
      ],
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Price",
      },
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
    {
      name: "DTP Price",
      data: [
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
      ],
    },
    {
      name: "ACV Price",
      data: [
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
      ],
    },
  ],
};

export const onBoardHealth = {
  options: {
    chart: {
      events: {},
      type: "bar",
      height: 350,
      width: "100%",
    },
    xaxis: {
      categories: [
        "Very High",
        "High",
        "Medium",
        "Low",
        "Very Low",
        "Undefined",
      ],
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    dataLabels: {
      position: "top",
    },
  },
  series: [
    {
      name: "Subscription",
      data: [812, 2111, 790, 198, 24, 2047],
    },
  ],
};

