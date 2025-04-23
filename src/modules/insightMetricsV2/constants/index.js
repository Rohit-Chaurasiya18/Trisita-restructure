export const product_aggrement = {
  options: {
    chart: {
      height: 350,
      type: "bar",
    },
    xaxis: {
      labels: {},
      categories: [
        "MAYA",
        "PDCOLL",
        "VLTM",
        "ACDIST",
        "ACDLT",
        "3DSMAX",
        "AECCOL",
        "COLLRP",
        "CIV3D",
        "MECOLL",
        "PREMSUB",
        "RVT",
        "ADSTPR",
        "FSN",
        "SCFDM",
        "F360PMU",
        "BLD5K",
        "F360PS",
        "NAVSIM",
        "F360PMS",
        "CAMDCT",
        "SPCMKR",
        "BM36DP",
        "F36FCS",
        "ACDLTM",
        "RVTLTS",
        "INVPROSA",
        "BIMCOLL",
        "BLD550",
        "F360",
        "F360PD",
        "NAVMAN",
        "BLDUNLT",
        "A250",
        "F36MEIA",
        "PCOFFI",
        "DOCS",
        "CADMEP",
        "IWICMU",
        "INFWP",
        "QNTFY",
        "INFDU",
        "IWWSPRO",
        "F36FC",
      ],
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
    colors: ["#007BFF", "#28A745", "#FFC107"],
    plotOptions: {
      bar: {
        borderRadius: 0,
        columnWidth: "80%",
      },
    },
  },
  series: [
    {
      name: "Seats Purchased",
      data: [
        133, 1880, 348, 1953, 3643, 183, 3536, 1061, 283, 90, 27, 84, 24, 36, 1,
        5, 4, 22, 331, 34, 1, 13, 650, 1, 3, 39, 65, 12, 14, 2, 1, 4, 10004, 3,
        1, 1, 17, 2, 3, 2, 3, 2, 2, 1,
      ],
    },
    {
      name: "User Assigned",
      data: [
        104, 1695, 298, 1664, 3233, 165, 3274, 893, 274, 85, 0, 69, 24, 33, 1,
        4, 4, 20, 224, 33, 1, 1, 538, 1, 3, 23, 63, 11, 14, 2, 1, 3, 7, 3, 1, 0,
        16, 0, 1, 0, 2, 0, 0, 1,
      ],
    },
    {
      name: "Seats In Use",
      data: [
        80, 1337, 169, 1265, 2348, 119, 2784, 647, 216, 75, 0, 37, 20, 26, 1, 3,
        3, 14, 183, 28, 1, 0, 319, 0, 0, 17, 53, 6, 12, 1, 1, 2, 3, 3, 0, 0, 4,
        0, 1, 0, 0, 0, 0, 1,
      ],
    },
  ],
};
export const risk = {
  options: {
    chart: {
      type: "bar",
      height: 350,
      width: "100%",
      events: {},
    },
    xaxis: {
      categories: ["Green", "Yellow", "Red", "Unknown"],
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
      name: "contracts",
      data: [1427, 261, 542, 0],
    },
  ],
};
