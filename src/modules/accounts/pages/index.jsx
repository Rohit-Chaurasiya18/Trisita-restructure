import React, { useEffect, useMemo, useState } from "react";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import CommonSearchInput from "@/components/common/inputTextField/CommonSearch";
import CommonCategoryGrid from "../components/CommonCategoryGrid";
import CommonTable from "@/components/common/dataTable/CommonTable";
import { barChartData, ChartData } from "../constants";
import ReactApexChart from "react-apexcharts";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import {
  getAccount,
  getAllUser,
  getContracts,
  getEndCustomerAccount,
  getExportedAccount,
  getInsightMetricsCsn,
  setIndustryGroupCount,
} from "../slice/accountSlice";
import { Tooltip } from "@mui/material";
import CommonModal from "@/components/common/modal/CommonModal";
import CustomTabs from "../components/CustomTabs";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import AssignUserBranch from "../components/AssignUserBranch";
import moment from "moment";
import routesConstants from "@/routes/routesConstants";

const CommonChart = ({
  title,
  options,
  series,
  subCategory,
  className,
  subCategoryChange,
  setSelectedIndex,
  selectedIndex,
}) => {
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
                  subCategoryChange(index);
                  setSelectedIndex(index);
                }}
                style={{ color: `${selectedIndex === index ? "#1800ee" : ""}` }}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <ReactApexChart
          options={options}
          series={series}
          type={options.chart.type}
          height={options.chart.height}
        />
      </div>
    </div>
  );
};

const Account = () => {
  const [filters, setFilters] = useState({
    searchValue: "",
    branch: null,
    status: "All Status",
    industryCategory: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedValue, setSelectedValue] = useState({
    title: "All",
    status: "Total",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modal, setModal] = useState({
    isOpen: false,
    id: "",
    isAssign: false,
  });
  const [lineChartData, setLineChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "line",
        width: "100%",
        height: 350,
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      title: { text: "", align: "left" },
      grid: {
        row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
      },
      xaxis: { categories: [] },
    },
  });

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    branchListLoading,
    branch_list,
    filter,
    last_updated,
    exportedAccountDataLoading,
    exportedAccountData,
    industryGroupCount,
    accountInformation,
  } = useSelector((state) => ({
    branchListLoading: state?.insightMetrics?.branchListLoading,
    branch_list: state?.insightMetrics?.branchList,
    filter: state?.layout?.filter,
    exportedAccountDataLoading: state?.account?.exportedAccountDataLoading,
    exportedAccountData: state?.account?.exportedAccountData,
    last_updated: state?.account?.last_updated,
    industryGroupCount: state?.account?.industryGroupCount,
    accountInformation: state?.account?.accountInformation,
  }));

  useEffect(() => {
    setFilteredData(exportedAccountData);
  }, [exportedAccountData]);

  const isThirdPartyAccount = useMemo(
    () => location.pathname.startsWith("/third_party_account"),
    [location?.pathname]
  );

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getAllUser());
  }, []);

  useEffect(() => {
    dispatch(
      getExportedAccount({
        id: filter?.csn === "All CSN" ? "" : filter?.csn,
        isThirdParty: isThirdPartyAccount,
      })
    );
  }, [filter?.csn, isThirdPartyAccount]);

  useEffect(() => {
    if (
      filters?.branch?.label ||
      filters?.status !== "All Status" ||
      filters?.searchValue ||
      filters?.industryCategory
    ) {
      let data = exportedAccountData;
      let industryGroup = exportedAccountData;
      if (filters?.branch?.label) {
        data = data?.filter?.(
          (item) => item?.branch === filters?.branch?.label
        );
        industryGroup = data?.filter?.(
          (item) => item?.branch === filters?.branch?.label
        );
      }
      if (filters?.status !== "All Status") {
        data = data?.filter(
          (item) => item?.contract_status === filters?.status
        );
      }
      if (filters?.searchValue) {
        data = data?.filter((row) => {
          return Object.values(row).some(
            (value) =>
              value &&
              value
                .toString()
                .toLowerCase()
                .includes(filters?.searchValue.toLowerCase())
          );
        });
        industryGroup = data?.filter((row) => {
          return Object.values(row).some(
            (value) =>
              value &&
              value
                .toString()
                .toLowerCase()
                .includes(filters?.searchValue.toLowerCase())
          );
        });
      }
      setFilteredData(data);
      dispatch(setIndustryGroupCount(industryGroup));
    } else {
      setFilteredData(exportedAccountData);
    }
  }, [filters?.branch, filters?.status, filters?.searchValue]);

  useEffect(() => {
    let data = exportedAccountData;

    if (filters?.industryCategory && filters?.industryCategory !== "All") {
      data = data?.filter(
        (item) =>
          item?.industryGroup?.toString()?.toLowerCase() ===
          filters?.industryCategory?.toString()?.toLowerCase()
      );
    }

    if (filters?.branch?.label) {
      data = data?.filter((item) => item?.branch === filters?.branch?.label);
    }

    if (filters?.status && filters?.status !== "All Status") {
      data = data?.filter((item) => item?.contract_status === filters?.status);
    }

    if (filters?.searchValue) {
      const search = filters?.searchValue.toLowerCase();
      data = data?.filter((row) =>
        Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(search)
        )
      );
    }

    setFilteredData(data);
  }, [
    filters?.industryCategory,
    filters?.branch,
    filters?.status,
    filters?.searchValue,
    exportedAccountData,
  ]);

  const thirdPartyCategories = [
    { title: "All", active: 17, inactive: 0, total: 17 },
    { title: "Null", active: 0, inactive: 0, total: 0 },
  ];

  const handleOpenModel = (id) => {
    setModal((prev) => ({ ...prev, isOpen: true, id: id, isAssign: false }));
    const defaultCsn = filter?.csn === "All CSN" ? "5102086717" : filter?.csn;
    let payload = {
      accountId: id,
      csn: defaultCsn,
    };
    dispatch(getAccount(payload));
    dispatch(getInsightMetricsCsn(payload));
    dispatch(getContracts(payload));
    dispatch(getEndCustomerAccount(payload));
  };

  const columns = [
    {
      field: "csn",
      headerName: "CSN",
      width: 150,
      renderCell: (params, index) => (
        <span
          onClick={() =>
            !isThirdPartyAccount && handleOpenModel(params?.row?.id)
          }
          className="action-button bg-white text-black px-3 py-1 rounded border-0"
        >
          {params?.value}
        </span>
      ),
    },
    {
      field: "user_assign",
      headerName: "BD Person Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {params?.value && params?.value != " " ? (
            params?.value.join(", ")
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Account Name",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""}>
          <button
            className="text-red-600 border-0 "
            onClick={() =>
              navigate(routesConstants?.UPDATE_ACCOUNT + "/" + params?.id)
            }
          >
            <span className="table-cell-truncate">{params?.value}</span>
          </button>
        </Tooltip>
      ),
    },
    { field: "industryGroup", headerName: "Industry", width: 100 },
    {
      field: "industrySegment",
      headerName: "Segment",
      width: 160,
      renderCell: (params) => {
        const { value: industrySegment } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {industrySegment?.length > maxChars
              ? industrySegment
              : industrySegment?.slice(0, maxChars)}
          </div>
        );
      },
    },
    {
      field: "industrySubSegment",
      headerName: "Sub Segment",
      width: 160,
      renderCell: (params) => {
        const { value: industrySubSegment } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {industrySubSegment?.length > maxChars
              ? industrySubSegment
              : industrySubSegment?.slice(0, maxChars)}
          </div>
        );
      },
    },
    {
      field: "address1",
      headerName: "Address",
      width: 160,
      renderCell: (params) => {
        const { value: address1 } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {address1?.length > maxChars
              ? address1
              : address1?.slice(0, maxChars)}
          </div>
        );
      },
    },
    { field: "city", headerName: "City", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Contact No", width: 150 },
    { field: "status", headerName: "Autodesk Account Status", width: 120 },
    {
      field: "contract_status",
      headerName: "Trisita Account Status",
      width: 120,
    },
    { field: "buyingReadinessScore", headerName: "Rediness Score", width: 130 },
    {
      field: "renewal_person",
      headerName: "Renewal Person Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {params?.value && params?.value != " " ? (
            params?.value.join(", ")
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "branch",
      headerName: "Branch",
      width: 100,
      renderCell: (params) => (
        <div>
          {params?.value && params?.value ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params, index) => (
        <span
          // onClick={() => handleAssignModel(params?.row.id)}
          onClick={() =>
            setModal((prev) => ({
              ...prev,
              id: params?.row?.id,
              isOpen: true,
              isAssign: true,
            }))
          }
          className="assign-button text-black px-3 py-1 rounded border-0"
        >
          Assign
        </span>
      ),
    },
  ];

  const getRowId = (row) => row.id;

  const handleClick = (title, status) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "Total" ? "All Status" : status,
      industryCategory: title === "All" ? "All" : title,
    }));

    setSelectedValue({ title, status });
  };

  // Function to compute chart data by group (groupByKey = "industryGroup", etc.)
  const computeChartData = (groupByKey = "industryGroup") => {
    const groupCounts = filteredData.reduce((acc, curr) => {
      const key = curr[groupByKey] || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const sortedKeys = Object.keys(groupCounts).sort();
    const data = sortedKeys.map((key) => groupCounts[key]);

    setLineChartData({
      series: [{ name: "Accounts", data }],
      options: {
        ...lineChartData.options,
        xaxis: {
          ...lineChartData.options.xaxis,
          categories: sortedKeys,
        },
      },
    });
  };

  // On initial data load, generate the default industryGroup chart
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      computeChartData("industryGroup");
      setSelectedIndex(0);
    }
  }, [filteredData]);

  // Handle chart switch: 0 = industryGroup, 1 = segment, 2 = subsegment
  const subCategoryChange = (index) => {
    if (index === 0) computeChartData("industryGroup");
    else if (index === 1) computeChartData("industrySegment");
    else if (index === 2) computeChartData("industrySubSegment");
  };
  const handleCityBarClick = (cityName, clickedStatus) => {
    let data = exportedAccountData;
    if (filters?.industryCategory && filters?.industryCategory !== "All") {
      data = data?.filter(
        (item) =>
          item?.industryGroup?.toString()?.toLowerCase() ===
          filters?.industryCategory?.toString()?.toLowerCase()
      );
    }
    if (cityName) {
      if (cityName === "Unknown") {
        data = data?.filter((item) => !item?.city);
      } else {
        data = data?.filter(
          (item) =>
            item?.city?.toString()?.toLowerCase() ===
            cityName?.toString()?.toLowerCase()
        );
      }
    }

    if (filters?.branch?.label) {
      data = data?.filter((item) => item?.branch === filters?.branch?.label);
    }

    if (clickedStatus) {
      data = data?.filter((item) => item?.contract_status === clickedStatus);
    }

    if (filters?.searchValue) {
      const search = filters?.searchValue.toLowerCase();
      data = data?.filter((row) =>
        Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(search)
        )
      );
    }

    setFilteredData(data);
  };

  const generateCityBarChartData = () => {
    const cityCounts = {};

    filteredData.forEach((item) => {
      // const rawCity = item?.city || "Unknown";
      const rawCity = item?.city || "Unknown";

      const city = rawCity.toLowerCase().trim(); // Normalize city name
      const displayCity =
        rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase(); // Proper case for display
      const status = item.contract_status;

      if (!cityCounts[city]) {
        cityCounts[city] = {
          displayName: displayCity,
          Active: 0,
          Expired: 0,
        };
      }

      if (status === "Active") {
        cityCounts[city].Active++;
      } else if (status === "Expired") {
        cityCounts[city].Expired++;
      }
    });

    // Sort by total and get top 12
    const sortedCities = Object.entries(cityCounts)
      .sort((a, b) => {
        const totalA = a[1].Active + a[1].Expired;
        const totalB = b[1].Active + b[1].Expired;
        return totalB - totalA;
      })
      .slice(0, 12);

    const categories = sortedCities.map(([_, val]) => val.displayName);
    const activeData = sortedCities.map(([_, val]) => val.Active);
    const expiredData = sortedCities.map(([_, val]) => val.Expired);

    return {
      options: {
        ...barChartData.options,
        xaxis: {
          categories,
        },
        chart: {
          ...barChartData.options.chart,
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const city = categories[config.dataPointIndex];
              const clickedStatus =
                config.seriesIndex === 0
                  ? "Active"
                  : config.seriesIndex === 1
                  ? "Expired"
                  : "Unknown";
              handleCityBarClick(city, clickedStatus);
            },
          },
        },
      },

      series:
        filters.status === "Active"
          ? [{ name: "Active", data: activeData }]
          : filters.status === "Expired"
          ? [{ name: "Expired", data: expiredData }]
          : [
              { name: "Active", data: activeData },
              { name: "Expired", data: expiredData },
            ],
    };
  };

  return (
    <>
      <div className="account">
        <h5 className="commom-header-title mb-0">
          Account Information of the End Customers
        </h5>
        <span className="common-breadcrum-msg">
          List of all Autodesk End Customers. The boxes below show combined
          industry details.
        </span>

        <div className="account-filter">
          <Tooltip
            title={moment(last_updated).format("MMMM D, YYYY [at] h:mm:ss A")}
            placement="top"
          >
            <span>Last Updated</span>
          </Tooltip>

          <CommonButton
            className="common-green-btn"
            onClick={() => {
              setFilteredData(exportedAccountData);
              setFilters({
                searchValue: "",
                branch: null,
                status: "All Status",
                industryCategory: "",
              });
              dispatch(setIndustryGroupCount(exportedAccountData));
              setSelectedValue({
                title: "All",
                status: "Total",
              });
            }}
          >
            All
          </CommonButton>

          <CommonAutocomplete
            onChange={(event, newValue) => {
              setFilters((prev) => ({ ...prev, branch: newValue }));
              setSelectedValue({
                title: "",
                status: "",
              });
            }}
            options={branch_list}
            label="Select a Branch"
            loading={branchListLoading}
            value={filters?.branch}
          />

          <CommonSelect
            value={filters?.status}
            options={[
              { value: "All Status", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Expired", label: "Expired" },
            ]}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                status: e.target.value,
                industryCategory: "All",
              }));
              // setSelectedValue({
              //   title: "All",
              //   status:
              //     e.target.value === "All Status" ? "Total" : e.target.value,
              // });
              setSelectedValue({
                title: "",
                status: "",
              });
            }}
          />

          <CommonSearchInput
            value={filters?.searchValue}
            label="Search Accounts"
            loading={false}
            debounceTime={400}
            onChange={(text) => {
              setFilters((prev) => ({ ...prev, searchValue: text }));
              setSelectedValue({
                title: "",
                status: "",
              });
              setSelectedIndex(0);
            }}
          />
        </div>
        <div className="mt-4">
          {exportedAccountDataLoading ? (
            <SkeletonLoader isDashboard />
          ) : (
            industryGroupCount?.length > 0 && (
              <CommonCategoryGrid
                data={industryGroupCount}
                handleClick={handleClick}
                selectedValue={selectedValue}
              />
            )
          )}
        </div>
        <div className="account-table mt-4">
          {exportedAccountDataLoading ? (
            <SkeletonLoader isDashboard height="350px" />
          ) : (
            <CommonTable
              rows={filteredData}
              columns={columns}
              getRowId={getRowId}
              checkboxSelection
              toolbar
              exportFileName={`account_trisita`}
            />
          )}
        </div>
        <div className="account-industry-chart mt-4">
          {filteredData?.length > 0 &&
          lineChartData?.series[0]?.data?.length > 0 ? (
            <CommonChart
              title="Trend of number of accounts by Industry"
              options={lineChartData.options}
              series={lineChartData.series}
              subCategory={[
                "By Industry Group",
                "By Segment",
                "By Sub Segment",
              ]}
              subCategoryChange={subCategoryChange}
              setSelectedIndex={setSelectedIndex}
              selectedIndex={selectedIndex}
            />
          ) : (
            <SkeletonLoader isDashboard height="350px" />
          )}
        </div>
        <div className="account-industry-chart-2 mt-4">
          <CommonChart
            title="Show by rediness scores"
            options={ChartData.options}
            series={ChartData.series}
            className="chart-data-1"
          />
          <CommonChart
            title="Top 12 cities by number of account trend showing between active and inactive"
            options={generateCityBarChartData().options}
            className="chart-data-2"
            series={generateCityBarChartData().series}
          />
        </div>
      </div>
      <CommonModal
        isOpen={modal?.isOpen}
        handleClose={() => {
          setModal((prev) => ({
            ...prev,
            isOpen: false,
            isAssign: false,
            id: "",
          }));
        }}
        scrollable
        title={
          modal?.isAssign
            ? `Allocate User and Branch -- ${accountInformation?.name ?? ""}`
            : "Account information detail"
        }
      >
        {modal?.isAssign ? <AssignUserBranch id={modal?.id} /> : <CustomTabs />}
      </CommonModal>
    </>
  );
};

export default Account;
