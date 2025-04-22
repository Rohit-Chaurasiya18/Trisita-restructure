export const options = [
  {
    label: "Mumbai",
    value: 1,
  },
  {
    label: "Kolkata",
    value: 2,
  },
  {
    label: "Delhi",
    value: 3,
  },
];

export const statusOption = [
  { value: "All Status", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Expired", label: "Expired" },
];

export const accountOption = [
  {
    label: "1 Architectural Consultants",
    csn: 5501593303,
    id: 6874,
  },
  {
    label: "2M RESEARCH PRIVATE Ltd",
    csn: 5501281536,
    id: 5858,
  },
  {
    label: "2M RESEARCH PVT. Ltd",
    csn: 5502185195,
    id: 6850,
  },
  {
    label: "2 Tettra School",
    csn: 5106985515,
    id: 5477,
  },
  {
    label: "3 Guys",
    csn: 5106740834,
    id: 6115,
  },
  {
    label: "4TH DIMENSION",
    csn: 5104091953,
    id: 4274,
  },
  {
    label: "99 Watts Energy Solutions Pvt. Ltd",
    csn: 5153000319,
    id: 4084,
  },
  {
    label: "A1 Jumbo Xerox",
    csn: 5114508998,
    id: 6255,
  },
  {
    label: "A2G CIVIL ENGINEERING SERVICES PVT. LTD",
    csn: 5122596593,
    id: 6163,
  },
  {
    label: "A4 Creation Pty Ltd",
    csn: 5100805535,
    id: 4013,
  },
  {
    label: "AABSYS INFORMATION TECHNOLOGY PVT",
    csn: 5138960616,
    id: 3021,
  },
  {
    label: "AABSYS INFORMATION TECHNOLOGY PVT. Ltd",
    csn: 5151235656,
    id: 6181,
  },
  {
    label: "AABSYSINFORMATIONTECHNOLOGYPVTLTD",
    csn: 5109908502,
    id: 5361,
  },
  {
    label: "AABSYS INFO TECH PVT. Ltd",
    csn: 5123161029,
    id: 5470,
  },
  {
    label: "AADHYA ANIMATICS PVT Ltd",
    csn: 5502315575,
    id: 6975,
  },
  {
    label: "AADITYA INNOVATIONS PVT. Ltd",
    csn: 5501755245,
    id: 6337,
  },
  {
    label: "AAKAAR",
    csn: 5125174500,
    id: 3009,
  },
  {
    label: "AAKAAR ARCHITECTS",
    csn: 5501676962,
    id: 6171,
  },
  {
    label: "AAKAR",
    csn: 5108569378,
    id: 5125,
  },
  {
    label: "Aakar Architects",
    csn: 5156470531,
    id: 6766,
  },
];

export const withoutProparated = {
  options: {
    chart: {
      height: 350,
      type: "bar",
    },
    xaxis: {
      labels: {},
      categories: [
        "MAYA",
        "AECCOL",
        "NAVSIM",
        "3DSMAX",
        "ACDLT",
        "PDCOLL",
        "VLTM",
        "BM36DP",
        "RVT",
        "RVTLTS",
        "MECOLL",
        "ACDIST",
        "COLLRP",
        "CIV3D",
        "PREMSUB",
        "ADSTPR",
        "FSN",
        "SCFDM",
        "F360PMU",
        "BLD5K",
        "F360PS",
        "F360PMS",
        "CAMDCT",
        "SPCMKR",
        "F36FCS",
        "ACDLTM",
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
        "INFDU",
        "INFWP",
        "QNTFY",
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
        124, 2061, 299, 114, 2106, 823, 235, 650, 48, 15, 73, 1360, 580, 187,
        47, 11, 36, 1, 5, 4, 22, 34, 1, 1, 1, 3, 42, 12, 6, 2, 1, 4, 10004, 3,
        1, 1, 17, 2, 3, 2, 2, 3, 2, 1,
      ],
    },
    {
      name: "User Assigned",
      data: [
        95, 1944, 192, 102, 1898, 771, 212, 533, 43, 15, 72, 1236, 507, 178, 0,
        11, 33, 1, 4, 4, 20, 33, 1, 1, 1, 3, 42, 11, 6, 2, 1, 3, 7, 3, 1, 0, 16,
        0, 3, 2, 0, 2, 2, 1,
      ],
    },
    {
      name: "Seats In Use",
      data: [
        71, 1622, 150, 69, 1249, 551, 125, 317, 26, 10, 62, 924, 368, 142, 0, 8,
        26, 1, 3, 3, 14, 28, 1, 0, 0, 0, 32, 6, 4, 1, 1, 2, 3, 3, 0, 0, 4, 0, 1,
        0, 0, 0, 0, 1,
      ],
    },
  ],
};
export const withProparated = {
  options: {
    chart: {
      height: 350,
      type: "bar",
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
      categories: [
        "MAYA",
        "AECCOL",
        "NAVSIM",
        "3DSMAX",
        "ACDLT",
        "PDCOLL",
        "VLTM",
        "RVT",
        "RVTLTS",
        "MECOLL",
        "ACDIST",
        "COLLRP",
        "CIV3D",
        "ADSTPR",
        "INVPROSA",
        "BLD550",
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
        9, 1612, 33, 69, 1532, 1064, 113, 37, 25, 18, 590, 521, 96, 13, 22, 8,
      ],
    },
    {
      name: "User Assigned ProRated",
      data: [
        "9.00",
        "1545.37",
        "33.00",
        "68.00",
        "1487.93",
        "981.31",
        "85.84",
        "35.01",
        "22.99",
        "14.01",
        "569.31",
        "500.62",
        "96.00",
        "13.00",
        "22.00",
        "8.00",
      ],
    },
    {
      name: "Seats In Use ProRated",
      data: [
        "9.00",
        "1366.05",
        "33.00",
        "54.01",
        "1190.00",
        "837.63",
        "43.07",
        "14.69",
        "10.03",
        "12.07",
        "414.92",
        "350.24",
        "71.05",
        "12.00",
        "22.00",
        "8.00",
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
      data: [1870, 339, 667, 0],
    },
  ],
};
