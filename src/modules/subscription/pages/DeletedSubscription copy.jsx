import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonModal from "@/components/common/modal/CommonModal";
import SubscriptionDetail from "../components/SubscriptionDetail";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeletedSubscriptionData,
  getDeletedSubscriptionDetail,
} from "../slice/subscriptionSlice";
import useDebounce from "@/hooks/useDebounce";

const DeletedSubscription = () => {
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState([null, null]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    id: null,
  });
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: "All Status",
  });

  const {
    userDetail,
    filter,
    deletedSubscriptionDataLoading,
    deletedSubscriptionData,
  } = useSelector((state) => ({
    userDetail: state?.login?.userDetail,
    filter: state?.layout?.filter,
    deletedSubscriptionDataLoading:
      state?.subscription?.deletedSubscriptionDataLoading,
    deletedSubscriptionData: state?.subscription?.deletedSubscriptionData,
  }));

  // Date filter handler
  const handleChange = ([start, end]) => {
    setFilters((prev) => ({
      ...prev,
      startDate: start?.format("YYYY-MM-DD") || null,
      endDate: end?.format("YYYY-MM-DD") || null,
    }));
    setDateRange([start, end]);
  };

  // Status filtering
  useEffect(() => {
    const statusFiltered =
      filters.status === "All Status"
        ? deletedSubscriptionData
        : deletedSubscriptionData?.filter(
            (item) => item?.trisita_status === filters.status
          );
    setFilteredData(statusFiltered);
  }, [deletedSubscriptionData, filters.status]);

  const debounce = useDebounce(filters?.endDate, 500);

  // API fetch on filters
  useEffect(() => {
    let dateFilter;
    if (debounce) {
      dateFilter = {
        from_date: filters?.startDate,
        to_date: debounce,
      };
    } else {
      dateFilter = {
        from_date: null,
        to_date: null,
      };
    }
    const payload = {
      csn: filter?.csn === "All CSN" ? "" : filter?.csn,
      payload: dateFilter,
    };
    dispatch(getDeletedSubscriptionData(payload));
  }, [filter?.csn, debounce]);

  // Handle modal open
  const handleOpenModel = (id) => {
    setModal({ show: true, id });
    dispatch(getDeletedSubscriptionDetail({ id }));
  };

  // Get unique ID for rows
  const getRowId = (row) => row?.id;

  // Table row selection
  const handleSelectionChange = ({ ids }) => {
    setSelectedId([...ids]);
  };

  // Prepare data for export
  const exportedData = useMemo(
    () => filteredData?.filter((item) => selectedId.includes(item?.id)),
    [filteredData, selectedId]
  );

  // Table column definitions
  const columns = useMemo(
    () => [
      {
        field: "subscriptionReferenceNumber",
        headerName: "Subscription",
        width: 150,
        renderCell: (params) => (
          <span
            onClick={() => handleOpenModel(params?.row.id)}
            className="action-button bg-white text-black px-3 py-1 rounded border-0"
          >
            {params?.value}
          </span>
        ),
      },
      {
        field: "account_name",
        headerName: "Account Name",
        width: 200,
        renderCell: (params) => (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {params?.value}
          </div>
        ),
      },
      {
        field: "third_party",
        headerName: "Third Party Name",
        width: 200,
        renderCell: (params) => {
          const { value: third_party_name } = params;
          const maxChars = 20;

          return (
            <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
              {third_party_name?.length > maxChars
                ? third_party_name
                : third_party_name?.slice(0, maxChars)}
            </div>
          );
        },
      },
      { field: "part_number", headerName: "Part Number", width: 200 },
      { field: "account_csn", headerName: "Account CSN", width: 100 },
      {
        field: "bd_person",
        headerName: "BD Person Name",
        width: 200,
        renderCell: ({ value }) =>
          value ? value : <span style={{ color: "red" }}>Undefined</span>,
      },
      {
        field: "renewal_person",
        headerName: "Renewal Person Name",
        width: 200,
        renderCell: ({ value }) =>
          value ? value : <span style={{ color: "red" }}>Undefined</span>,
      },
      {
        field: "branch",
        headerName: "Branch",
        width: 100,
        renderCell: ({ value }) =>
          value ? value : <span style={{ color: "red" }}>Undefined</span>,
      },
      {
        field: "contract_manager_email",
        headerName: "Contract Mgr. Email",
        width: 200,
        renderCell: ({ value }) => (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>{value}</div>
        ),
      },
      { field: "seats", headerName: "Seats", width: 70 },
      { field: "startDate", headerName: "Subs Start Date", width: 130 },
      { field: "endDate", headerName: "Subs End Date", width: 130 },
      { field: "trisita_status", headerName: "Trisita Status", width: 130 },
      { field: "subscriptionStatus", headerName: "Status", width: 100 },
      {
        field: "lastPurchaseDate",
        headerName: "Last Purchase Date",
        width: 130,
      },
      { field: "account_group", headerName: "Account Group", width: 100 },
      {
        field: "subscriptionType",
        headerName: "Subscription Type",
        width: 100,
      },
      {
        field: "contract_end_date",
        headerName: "Contract End Date",
        width: 130,
      },
      {
        field: "acv_price",
        headerName: "Total ACV Price",
        width: 130,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "dtp_price",
        headerName: "Total DTP Price",
        width: 130,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "productLine",
        headerName: "Product Line",
        width: 250,
        renderCell: ({ value }) => (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>{value}</div>
        ),
      },
      {
        field: "deleted_date",
        headerName: "Created Date",
        width: 130,
        renderCell: ({ value }) => (
          <span>{new Date(value).toLocaleDateString()}</span>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div>
        <div className="new-subscription-header">
          <h5 className="commom-header-title mb-0">
            Old Subscription Data (Deleted)
          </h5>
          <div className="new-subscription-filter">
            <CommonDateRangePicker
              value={dateRange}
              onChange={handleChange}
              width="180px"
              placeholderStart="Start date"
              placeholderEnd="End date"
              disabled={deletedSubscriptionDataLoading}
            />
            <CommonSelect
              value={filters.status}
              options={[
                { value: "All Status", label: "All Status" },
                { value: "Active", label: "Active" },
                { value: "Expired", label: "Expired" },
              ]}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            />
          </div>
        </div>

        {deletedSubscriptionDataLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="new-subscription-table">
            <ExportToExcel
              data={exportedData}
              columns={columns}
              fileName={`subs_trisita_${userDetail?.first_name}_${userDetail?.last_name}`}
              className="insight-export-btn"
            />
            <h3 className="common-insight-title">Table Data</h3>
            <CommonTable
              rows={filteredData}
              columns={columns}
              getRowId={getRowId}
              checkboxSelection
              handleRowSelection={handleSelectionChange}
              toolbar
              exportFileName={`subs_trisita_${userDetail?.first_name}_${userDetail?.last_name}`}
            />
          </div>
        )}
      </div>

      <CommonModal
        isOpen={modal.show}
        handleClose={() => setModal({ show: false, id: null })}
        scrollable
        title={"Deleted Subscription Detail"}
      >
        <SubscriptionDetail />
      </CommonModal>
    </>
  );
};

export default DeletedSubscription;
