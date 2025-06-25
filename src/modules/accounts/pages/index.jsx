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
  getThirdPartyExportedAccount,
  setIndustryGroupCount,
} from "../slice/accountSlice";
import { Tooltip } from "@mui/material";
import CommonModal from "@/components/common/modal/CommonModal";
import CustomTabs from "../components/CustomTabs";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import AssignUserBranch from "../components/AssignUserBranch";
import moment from "moment";
import routesConstants from "@/routes/routesConstants";
import ExportToExcel from "@/components/common/buttons/ExportToExcel";

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

// Helper function to compute industry chart data
const computeIndustryChartData = (data, groupByKey) => {
  if (!data || data.length === 0) return { series: [], categories: [] };

  const groupCounts = data.reduce((acc, item) => {
    const key = item[groupByKey] || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sortedKeys = Object.keys(groupCounts).sort();
  const seriesData = sortedKeys.map((key) => groupCounts[key]);

  return {
    series: [{ name: "Accounts", data: seriesData }],
    categories: sortedKeys,
  };
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
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isThirdPartyAccount = useMemo(
    () => location.pathname.startsWith("/third_party_account"),
    [location?.pathname]
  );
  const {
    branchListLoading,
    branch_list,
    filter,
    last_updated,
    exportedAccountDataLoading,
    exportedAccountData,
    industryGroupCount,
    accountInformation,
    userDetail,
    dashboardStatus,
  } = useSelector((state) => ({
    branchListLoading: state?.insightMetrics?.branchListLoading,
    branch_list: state?.insightMetrics?.branchList,
    filter: state?.layout?.filter,
    exportedAccountDataLoading: isThirdPartyAccount
      ? state?.account?.thirdPartyExportedAccountDataLoading
      : state?.account?.exportedAccountDataLoading,
    exportedAccountData: isThirdPartyAccount
      ? state?.account?.thirdPartyExportedAccountData
      : state?.account?.exportedAccountData,
    last_updated: isThirdPartyAccount
      ? state?.account?.thirdPartyLast_updated
      : state?.account?.last_updated,
    industryGroupCount: isThirdPartyAccount
      ? state?.account?.thirdPartyIndustryGroupCount
      : state?.account?.industryGroupCount,
    accountInformation: state?.account?.accountInformation,
    userDetail: state?.login?.userDetail,
    dashboardStatus: state?.dashboard?.dashboardStatus,
  }));
  const [selectedId, setSelectedId] = useState([]);

  useEffect(() => {
    if (dashboardStatus) {
      setFilters((prev) => ({
        ...prev,
        status: dashboardStatus,
      }));
    }
  }, []);

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getAllUser());
  }, []);

  useEffect(() => {
    let payload = {
      id: filter?.csn === "All CSN" ? "" : filter?.csn,
      isThirdParty: isThirdPartyAccount,
    };
    if (isThirdPartyAccount) {
      dispatch(getThirdPartyExportedAccount(payload));
    } else {
      dispatch(getExportedAccount(payload));
    }
  }, [filter?.csn, isThirdPartyAccount]);

  const handleFilters = (data = exportedAccountData) => {
    // let data = exportedAccountData;
    if (filters?.branch?.label) {
      data = data?.filter?.((item) => item?.branch === filters?.branch?.label);
    }
    if (filters?.searchValue) {
      const search = filters?.searchValue.toLowerCase();
      data = data?.filter((row) =>
        Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(search)
        )
      );
    }
    if (filters?.status && filters?.status !== "All Status") {
      data = data?.filter((item) => item?.contract_status === filters?.status);
    }
    return data;
  };
  useEffect(() => {
    let data = handleFilters(exportedAccountData);
    dispatch(setIndustryGroupCount({ data, isThirdPartyAccount }));
    setFilteredData(data);
  }, [exportedAccountData, isThirdPartyAccount]);

  useEffect(() => {
    if (
      filters?.branch?.label ||
      filters?.status !== "All Status" ||
      filters?.searchValue
    ) {
      let data = handleFilters();
      setFilteredData(data);
      dispatch(setIndustryGroupCount({ data, isThirdPartyAccount }));
    } else {
      setFilteredData(exportedAccountData);
      dispatch(
        setIndustryGroupCount({
          data: exportedAccountData,
          isThirdPartyAccount,
        })
      );
    }
  }, [filters?.branch, filters?.status, filters?.searchValue]);

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
          {params?.value ? (
            params?.value
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
          {params?.value ? (
            params?.value
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
    setSelectedValue({ title, status });
    let data = handleFilters();
    if (title !== "All") {
      if (title === "Unknown") {
        data = data?.filter(
          (item) => !item?.industryGroup || item?.industryGroup === "Unknown"
        );
      } else {
        data = data?.filter(
          (item) =>
            item?.industryGroup?.toString()?.toLowerCase() ===
            title?.toString()?.toLowerCase()
        );
      }
    }
    if (status !== "Total") {
      data = data?.filter((item) => item?.contract_status === status);
    }
    setFilteredData(data);
  };

  const handleCityBarClick = (cityName, clickedStatus) => {
    let data = handleFilters();
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
    if (clickedStatus) {
      data = data?.filter((item) => item?.contract_status === clickedStatus);
    }
    dispatch(setIndustryGroupCount({ data, isThirdPartyAccount }));
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

  const handleCallback = () => {
    setModal({
      isOpen: false,
      id: "",
      isAssign: false,
    });
    dispatch(
      getExportedAccount({
        id: filter?.csn === "All CSN" ? "" : filter?.csn,
        isThirdParty: isThirdPartyAccount,
      })
    );
  };
  const handleSelectionChange = (selectedRows) => {
    const idArray = [...selectedRows?.ids];
    if (idArray?.length > 0) {
      setSelectedId(idArray);
    } else {
      setSelectedId([]);
    }
  };

  const exportedData = useMemo(
    () => filteredData?.filter((item) => selectedId.includes(item?.id)),
    [selectedId]
  );

  // Compute chart data based on selected grouping
  const industryChartData = useMemo(() => {
    const groupByKey =
      selectedIndex === 0
        ? "industryGroup"
        : selectedIndex === 1
        ? "industrySegment"
        : "industrySubSegment";

    return computeIndustryChartData(filteredData, groupByKey);
  }, [filteredData, selectedIndex]);

  // Handle chart grouping change
  const handleGroupChange = (index) => {
    setSelectedIndex(index);
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
              });
              dispatch(
                setIndustryGroupCount({
                  data: exportedAccountData,
                  isThirdPartyAccount,
                })
              );
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
            <SkeletonLoader />
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
            <div className="">
              <ExportToExcel
                data={exportedData}
                columns={columns}
                fileName={`account_trisita_${userDetail?.first_name}_${
                  userDetail?.last_name
                }_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`}
                className="account-export-btn"
              />
              <CommonTable
                rows={filteredData}
                columns={columns}
                getRowId={getRowId}
                checkboxSelection
                handleRowSelection={handleSelectionChange}
                toolbar
                exportFileName={`account_trisita`}
              />
            </div>
          )}
        </div>
        <div className="account-industry-chart mt-4">
          {!exportedAccountDataLoading ? (
            <CommonChart
              // title="Trend of number of accounts by Industry"
              // options={lineChartData.options}
              // series={lineChartData.series}
              // subCategory={[
              //   "By Industry Group",
              //   "By Segment",
              //   "By Sub Segment",
              // ]}
              // subCategoryChange={subCategoryChange}
              // setSelectedIndex={setSelectedIndex}
              // selectedIndex={selectedIndex}
              title="Trend of number of accounts by Industry"
              options={{
                chart: {
                  type: "line",
                  height: 350,
                  zoom: { enabled: false },
                },
                dataLabels: { enabled: false },
                stroke: { curve: "straight" },
                grid: {
                  row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
                },
                xaxis: { categories: industryChartData.categories },
                yaxis: { title: { text: "Number of Accounts" } },
              }}
              series={industryChartData.series}
              subCategory={[
                "By Industry Group",
                "By Segment",
                "By Sub Segment",
              ]}
              subCategoryChange={handleGroupChange}
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
        {modal?.isAssign ? (
          <AssignUserBranch id={modal?.id} handleCallback={handleCallback} />
        ) : (
          <CustomTabs />
        )}
      </CommonModal>
    </>
  );
};

export default Account;
