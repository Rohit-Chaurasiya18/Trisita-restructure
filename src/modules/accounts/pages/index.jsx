import React, { useEffect, useMemo, useState } from "react";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import CommonSearchInput from "@/components/common/inputTextField/CommonSearch";
import CommonCategoryGrid from "../components/CommonCategoryGrid";
import CommonTable from "@/components/common/dataTable/CommonTable";
import { barChartData, ChartData, LineChartData } from "../constants";
import ReactApexChart from "react-apexcharts";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import {
  getAccount,
  getAllUser,
  getContracts,
  getEndCustomerAccount,
  getExportedAccount,
  getInsightMetricsCsn,
} from "../slice/accountSlice";
import { Tooltip } from "@mui/material";
import CommonModal from "@/components/common/modal/CommonModal";
import CustomTabs from "../components/CustomTabs";

const CommonChart = ({ title, options, series, subCategory, className }) => {
  return (
    <div className={`insight-metrics-chart ${className}`}>
      <div className="chart-data">
        <div className="chart-data-header">
          <h3>{title}</h3>
          <div className="chart-data-subcategory">
            {subCategory?.map((item, index) => (
              <p key={index}>{item}</p>
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
  });
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
  });
  const location = useLocation();
  const dispatch = useDispatch();
  const { branchListLoading, branch_list, filter, exportedAccountData } =
    useSelector((state) => ({
      branchListLoading: state?.insightMetrics?.branchListLoading,
      branch_list: state?.insightMetrics?.branchList,
      filter: state?.layout?.filter,
      exportedAccountData: state?.account?.exportedAccountData,
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
      getExportedAccount({ id: filter?.csn === "All CSN" ? "" : filter?.csn })
    );
  }, [filter?.csn]);

  useEffect(() => {
    if (
      filters?.branch?.label ||
      filters?.status !== "All Status" ||
      filters?.searchValue
    ) {
      let data = exportedAccountData;
      if (filters?.branch?.label) {
        data = data?.filter?.(
          (item) => item?.branch === filters?.branch?.label
        );
      }
      if (filters?.status !== "All Status") {
        data = data?.filter(
          (item) => item?.contract_status === filters?.status
        );
      }
      if (filters?.searchValue) {
        data = data.filter((row) => {
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
    } else {
      setFilteredData(exportedAccountData);
    }
  }, [filters?.branch, filters?.status, filters?.searchValue]);

  const categories = [
    { title: "All", active: 1632, inactive: 2533, total: 4165 },
    { title: "AEC", active: 658, inactive: 1143, total: 1801 },
    { title: "MFG", active: 551, inactive: 648, total: 1199 },
    { title: "M&E", active: 63, inactive: 81, total: 144 },
    { title: "EDU", active: 9, inactive: 97, total: 106 },
    { title: "OTH", active: 157, inactive: 275, total: 432 },
    { title: "Unknown", active: 193, inactive: 288, total: 481 },
    { title: "Null", active: 1, inactive: 1, total: 2 },
  ];

  const thirdPartyCategories = [
    { title: "All", active: 17, inactive: 0, total: 17 },
    { title: "Null", active: 0, inactive: 0, total: 0 },
  ];

  const handleOpenModel = (id) => {
    setModal((prev) => ({ ...prev, isOpen: true }));
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
          onClick={() => handleOpenModel(params?.row?.id)}
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
            className="text-red-600 border-0"
            // onClick={() => navigate(`/update_account/${params.id}`)}
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
          className="assign-button text-black px-3 py-1 rounded border-0"
        >
          Assign
        </span>
      ),
    },
  ];

  const getRowId = (row) => row.id;
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
          <span>Last Updated</span>

          <CommonButton className="common-green-btn">All</CommonButton>

          <CommonAutocomplete
            onChange={(event, newValue) => {
              setFilters((prev) => ({ ...prev, branch: newValue }));
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
              setFilters((prev) => ({ ...prev, status: e.target.value }));
            }}
          />

          <CommonSearchInput
            value={filters?.searchValue}
            label="Search Accounts"
            loading={false}
            debounceTime={400}
            onChange={(text) => {
              setFilters((prev) => ({ ...prev, searchValue: text }));
            }}
          />
        </div>
        <div className="mt-4">
          <CommonCategoryGrid
            data={isThirdPartyAccount ? thirdPartyCategories : categories}
          />
        </div>
        <div className="account-table mt-4">
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={getRowId}
            checkboxSelection
            toolbar
            exportFileName={`account_trisita`}
          />
        </div>
        <div className="account-industry-chart mt-4">
          <CommonChart
            title="Trend of number of accounts by Industry"
            options={LineChartData.options}
            series={LineChartData.series}
            subCategory={["By Industry Group", "By Segment", "By Sub Segment"]}
          />
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
            options={barChartData.options}
            className="chart-data-2"
            series={barChartData.series}
          />
        </div>
      </div>
      <CommonModal
        isOpen={modal?.isOpen}
        handleClose={() => {
          setModal((prev) => ({ ...prev, isOpen: false }));
        }}
        title="Account information detail"
      >
        <CustomTabs />
      </CommonModal>
    </>
  );
};

export default Account;
