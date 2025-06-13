import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonTable from "@/components/common/dataTable/CommonTable";
import DatePickerFilter from "@/components/common/date/DatePickerFilter";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAlertSubscription,
  getRORAlertData,
} from "../slice/alertSubscription";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonModal from "@/components/common/modal/CommonModal";
import CustomTabs from "../components/CustomTabs";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import useDebounce from "@/hooks/useDebounce";

const AlertSubscription = () => {
  const dispatch = useDispatch();

  const {
    filter,
    alertSubscriptionLoading,
    alertSubscriptionList,
    userDetail,
    branch_list,
    branchListLoading,
  } = useSelector((state) => ({
    filter: state?.layout?.filter,
    alertSubscriptionLoading:
      state?.alertSubscription?.alertSubscriptionLoading,
    alertSubscriptionList: state?.alertSubscription?.alertSubscriptionList,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    userDetail: state?.login?.userDetail,
  }));
  
  const [dateRange, setDateRange] = useState([null, null]);
  const [pageFilter, setPageFilter] = useState({
    rorFilter: "All",
    status: "All Status",
    startDate: "",
    endDate: "",
    branch: null,
  });
  const [modal, setModal] = useState({
    isOpen: false,
  });
  const [subscriptionType, setSubscriptionType] = useState("Backup");
  const [selectedId, setSelectedId] = useState([]);

  const debounce = useDebounce(pageFilter?.endDate, 1000);

  // Single useEffect to fetch data on any relevant filter change
  useEffect(() => {
    const { rorFilter, startDate } = pageFilter;
    const csn = filter?.csn === "All CSN" ? "" : filter?.csn;

    let payload = {
      id: csn,
      status: rorFilter,
    };

    if (debounce) {
      payload.startDate = startDate;
      payload.endDate = debounce;
    } else {
      payload.startDate = null;
      payload.endDate = null;
    }

    dispatch(getRORAlertData(payload));
  }, [filter?.csn, pageFilter?.rorFilter, debounce]);

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  const filteredData = useMemo(() => {
    if (!alertSubscriptionList) return [];

    const { status, branch } = pageFilter;

    let data = [...alertSubscriptionList];

    if (branch?.label) {
      data = data?.filter((item) => item.branch === branch.label);
    }

    if (status && status !== "All Status") {
      data = data?.filter((item) => item.trisita_status === status);
    }

    return data;
  }, [alertSubscriptionList, pageFilter?.status, pageFilter?.branch]);

  const renderFallback = (value, fallback = "Undefined") =>
    value ? (
      typeof value === "string" && value.trim().length > 0 ? (
        value
      ) : (
        <span style={{ color: "red" }}>{fallback}</span>
      )
    ) : (
      <span style={{ color: "red" }}>{fallback}</span>
    );

  const renderLimitedText = (value, maxChars = 20) => (
    <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
      {value?.length > maxChars ? value : value?.slice(0, maxChars)}
    </div>
  );

  const handleOpenModel = (id, type) => {
    setModal((prev) => ({ ...prev, isOpen: true }));
    dispatch(getAlertSubscription(id)).then((res) => {
      console.log(res);
    });
  };

  const columns = [
    {
      field: "subscriptionReferenceNumber",
      headerName: "Subscription",
      width: 150,
      renderCell: ({ value, row }) => (
        <span
          className="action-button bg-white text-black px-3 py-1 rounded border-0"
          onClick={() => handleOpenModel(row?.id, subscriptionType)}
        >
          {value}
        </span>
      ),
    },
    {
      field: "account_name",
      headerName: "Account Name",
      width: 200,
      renderCell: ({ value }) => renderLimitedText(value),
    },
    { field: "account_csn", headerName: "Account CSN", width: 100 },
    {
      field: "bd_person",
      headerName: "BD Person Name",
      width: 200,
      renderCell: ({ value }) => renderFallback(value),
    },
    {
      field: "renewal_person",
      headerName: "Renewal Person Name",
      width: 200,
      renderCell: ({ value }) => renderFallback(value),
    },
    {
      field: "branch",
      headerName: "Branch",
      width: 100,
      renderCell: ({ value }) => renderFallback(value),
    },
    {
      field: "contract_manager_email",
      headerName: "Contract Mgr. Email",
      width: 200,
      renderCell: ({ value }) => renderLimitedText(value),
    },
    { field: "seats", headerName: "Seats", width: 70 },
    { field: "endDate", headerName: "Subs End Date", width: 130 },
    { field: "startDate", headerName: "Subs Start Date", width: 130 },
    { field: "trisita_status", headerName: "Trisita Status", width: 130 },
    { field: "subscriptionStatus", headerName: "Status", width: 100 },
    { field: "lastPurchaseDate", headerName: "Last Purchase date", width: 130 },
    { field: "account_group", headerName: "Account Group", width: 100 },
    { field: "subscriptionType", headerName: "Subscription Type", width: 100 },
    { field: "contract_end_date", headerName: "Contract EndDate", width: 130 },
    {
      field: "productLine",
      headerName: "Product Line",
      width: 250,
      renderCell: ({ value }) => renderLimitedText(value),
    },
    {
      field: "created_date",
      headerName: "Created Date",
      width: 130,
      renderCell: ({ value }) => (
        <span>{new Date(value).toLocaleDateString()}</span>
      ),
      sortable: true,
      filterable: true,
    },
  ];

  const fileName = `subs_trisita_${userDetail?.first_name}_${
    userDetail?.last_name
  }_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`;

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

  const handleDateChange = (newValue) => {
    const [start, end] = newValue;
    setPageFilter((prev) => ({
      ...prev,
      startDate: start?.format("YYYY-MM-DD") || null,
      endDate: end ? end.format("YYYY-MM-DD") : "",
    }));

    setDateRange(newValue);
  };

  return (
    <>
      <div className="alert-subscription">
        <div className="commom-header-title">
          ROR Change Alert / Lost to Competition
        </div>
      </div>
      <div className="subscription-header">
        <div className="subscription-filter">
          <CommonDateRangePicker
            value={dateRange}
            onChange={handleDateChange}
            width="180px"
            placeholderStart="Start date"
            placeholderEnd="End date"
          />
          <CommonSelect
            value={pageFilter?.rorFilter}
            options={[
              { value: "All", label: "All" },
              { value: "ROR", label: "ROR Change Alert" },
              { value: "LTC", label: "LTC (Lost to Competition)" },
            ]}
            onChange={(e) => {
              setPageFilter((prev) => ({
                ...prev,
                rorFilter: e?.target?.value,
              }));
            }}
          />
          <CommonSelect
            value={pageFilter?.status}
            options={[
              { value: "All Status", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Expired", label: "Expired" },
            ]}
            onChange={(e) => {
              setPageFilter((prev) => ({
                ...prev,
                status: e?.target?.value,
              }));
            }}
          />
          <CommonAutocomplete
            onChange={(event, newValue) => {
              setPageFilter((prev) => ({
                ...prev,
                branch: newValue,
              }));
            }}
            options={branch_list}
            label="Select a Branch"
            loading={branchListLoading}
            value={pageFilter?.branch}
          />
        </div>
      </div>

      {alertSubscriptionLoading ? (
        <div className="mt-4">
          <SkeletonLoader isDashboard height="50vh" />
        </div>
      ) : (
        <div className="alert-subscription-table">
          <ExportToExcel
            data={exportedData}
            columns={columns}
            fileName={fileName}
            className="insight-export-btn"
          />
          <h3 className="common-insight-title">Deleted Data</h3>
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row.id}
            checkboxSelection
            toolbar
            exportFileName={fileName}
            handleRowSelection={handleSelectionChange}
          />
        </div>
      )}
      <CommonModal
        isOpen={modal?.isOpen}
        handleClose={() => {
          setModal((prev) => ({ ...prev, isOpen: false }));
        }}
        title="Alert subscription detail"
      >
        <CustomTabs />
      </CommonModal>
    </>
  );
};

export default AlertSubscription;
