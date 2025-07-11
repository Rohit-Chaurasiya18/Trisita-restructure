import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonModal from "@/components/common/modal/CommonModal";
import useDebounce from "@/hooks/useDebounce";
import CustomTabs from "@/modules/alertSubscription/components/CustomTabs";
import { getAlertSubscription } from "@/modules/alertSubscription/slice/alertSubscription";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRaOrderData } from "../slice/RAOrderSlice";
import { getDeletedSubscriptionDetail } from "@/modules/subscription/slice/subscriptionSlice";

const RAOrder = () => {
  const dispatch = useDispatch();

  const {
    filter,
    raOrderListLoading,
    raOrderList,
    userDetail,
    branch_list,
    branchListLoading,
  } = useSelector((state) => ({
    filter: state?.layout?.filter,
    raOrderListLoading: state?.RaOrder?.raOrderListLoading,
    raOrderList: state?.RaOrder?.raOrderList,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    userDetail: state?.login?.userDetail,
  }));

  const [dateRange, setDateRange] = useState([null, null]);
  const [pageFilter, setPageFilter] = useState({
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

  const debounce = useDebounce(pageFilter?.endDate, 500);

  // Single useEffect to fetch data on any relevant filter change
  useEffect(() => {
    const { startDate } = pageFilter;
    const csn = filter?.csn === "All CSN" ? "" : filter?.csn;

    let payload = {
      id: csn,
    };

    if (debounce) {
      payload.from_date = startDate;
      payload.to_date = debounce;
    } else {
      payload.from_date = null;
      payload.to_date = null;
    }

    dispatch(getRaOrderData(payload));
  }, [filter?.csn, debounce]);

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  const filteredData = useMemo(() => {
    if (!raOrderList) return [];

    const { status, branch } = pageFilter;

    let data = [...raOrderList];

    if (branch?.label) {
      data = data?.filter((item) => item?.branch === branch?.label);
    }

    if (status && status !== "All Status") {
      data = data?.filter((item) => item?.trisita_status === status);
    }

    return data;
  }, [raOrderList, pageFilter?.status, pageFilter?.branch]);

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
    dispatch(getDeletedSubscriptionDetail({ id })).then((res) => {});
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
    {
      field: "third_party_name",
      headerName: "Third Party Name",
      width: 200,
      renderCell: ({ value }) => value,
    },
    { field: "part_number", headerName: "Part Number", width: 200 },
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
      field: "acv_price",
      headerName: "Total ACV Price",
      width: 130,
      renderCell: (params) => (
        <div>{Number(params?.value || 0).toFixed(2)}</div>
      ),
      sortComparator: (v1, v2) => Number(v1) - Number(v2),
    },
    {
      field: "dtp_price",
      headerName: "Total DTP Price",
      width: 130,
      renderCell: (params) => (
        <div>{Number(params?.value || 0).toFixed(2)}</div>
      ),
      sortComparator: (v1, v2) => Number(v1) - Number(v2),
    },
    {
      field: "productLine",
      headerName: "Product Line",
      width: 250,
      renderCell: ({ value }) => renderLimitedText(value),
    },
    {
      field: "deleted_date",
      headerName: "Created Date",
      width: 130,
      renderCell: ({ value }) => (
        <span>{new Date(value).toLocaleDateString()}</span>
      ),
      sortable: true,
      filterable: true,
    },
  ];

  const fileName = `ra_order_trisita_${userDetail?.first_name}_${
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
        <div className="commom-header-title">RA Order Data</div>
      </div>
      <div className="subscription-header">
        <div className="subscription-filter">
          <CommonDateRangePicker
            value={dateRange}
            onChange={handleDateChange}
            width="180px"
            placeholderStart="Start date"
            placeholderEnd="End date"
            disabled={raOrderListLoading}
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

      {raOrderListLoading ? (
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
          <h3 className="common-insight-title">RA Order Data</h3>
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
        title="RA order subscription detail"
      >
        <CustomTabs />
      </CommonModal>
    </>
  );
};

export default RAOrder;
