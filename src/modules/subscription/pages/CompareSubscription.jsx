import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonModal from "@/components/common/modal/CommonModal";
import SubscriptionDetail from "../components/SubscriptionDetail";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBackupSubscriptionDetail,
  getChangedLogSubscriptionDetail,
  getCompareSubscriptionData,
} from "../slice/subscriptionSlice";
import CommonButton from "@/components/common/buttons/CommonButton";

const subscriptionTypeData = {
  Deleted: 1,
  New: 2,
};

const CompareSubscription = () => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState([]);
  const [selectedId2, setSelectedId2] = useState([]);

  const [modal, setModal] = useState({
    show: false,
    id: null,
    tableId: null,
  });

  const [filters, setFilters] = useState({
    status: "All Status",
    subscriptionType: subscriptionTypeData?.Deleted,
  });

  const {
    userDetail,
    filter,
    compareSubscriptionData,
    compareSubscriptionDataLoading,
  } = useSelector((state) => ({
    userDetail: state?.login?.userDetail,
    filter: state?.layout?.filter,
    compareSubscriptionData: state?.subscription?.compareSubscriptionData,
    compareSubscriptionDataLoading:
      state?.subscription?.compareSubscriptionDataLoading,
  }));

  // API fetch on filters
  useEffect(() => {
    const payload = {
      csn: filter?.csn === "All CSN" ? "" : filter?.csn,
    };
    dispatch(getCompareSubscriptionData(payload));
  }, [filter?.csn]);

  // Handle modal open
  const handleOpenModel = (id, tableId) => {
    setModal({ show: true, id, tableId });
    dispatch(getBackupSubscriptionDetail({ id, tableId }));
  };

  // Get unique ID for rows
  const getRowId = (row) => row?.id;

  // Table column definitions
  const columns = useMemo(
    () => [
      {
        field: "subscriptionReferenceNumber",
        headerName: "subscription",
        width: 150,
        renderCell: (params, index) => (
          <span
            onClick={() => handleOpenModel(params?.row.id, 1)}
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
        renderCell: (params) => {
          const { value: account } = params;
          return <> {account}</>;
        },
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
        renderCell: (params) => (
          <div>
            {params.value && params.value ? (
              params.value
            ) : (
              <span style={{ color: "red" }}>Undefined</span>
            )}
          </div>
        ),
      },
      {
        field: "renewal_person",
        headerName: "Renewal Person Name",
        width: 200,
        renderCell: (params) => (
          <div>
            {params.value && params.value ? (
              params.value
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
            {params.value && params.value ? (
              params.value
            ) : (
              <span style={{ color: "red" }}>Undefined</span>
            )}
          </div>
        ),
      },
      {
        field: "contract_manager_email",
        headerName: "Contract Mgr. Email",
        width: 200,
        renderCell: (params) => {
          const { value: email } = params;
          return <>{email}</>;
        },
      },
      { field: "seats", headerName: "Seats", width: 70 },
      { field: "startDate", headerName: "Subs Start Date", width: 130 },
      { field: "endDate", headerName: "Subs End Date ", width: 130 },

      {
        field: "trisita_new_status",
        headerName: "Trisita New Status",
        width: 130,
      },
      {
        field: "trisita_old_status",
        headerName: "Trisita Old Status",
        width: 100,
      },
      {
        field: "lastPurchaseDate",
        headerName: "Last Purchase date",
        width: 130,
      },
      { field: "account_group", headerName: "Account Group", width: 100 },
      {
        field: "subscriptionType",
        headerName: "CampareSubscription Type",
        width: 100,
      },
      {
        field: "contract_end_date",
        headerName: "Contract EndDate",
        width: 130,
      },
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
        renderCell: (params) => {
          const { value: productLine } = params;
          return <>{productLine}</>;
        },
      },
    ],
    []
  );

  // Second Table
  const status_columns = [
    {
      field: "subscriptionReferenceNumber",
      headerName: "Subscription",
      width: 150,
      renderCell: (params) => (
        <span
          onClick={() => handleOpenModel(params?.row?.id, 2)}
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
      renderCell: (params) => {
        return <>{params?.value}</>;
      },
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
    {
      field: "bd_person",
      headerName: "BD Person Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {Array.isArray(params.value) && params.value.length > 0 ? (
            params.value.join(", ")
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "renewal_person",
      headerName: "Renewal Person Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {Array.isArray(params.value) && params.value.length > 0 ? (
            params.value.join(", ")
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "branch",
      headerName: "Branch",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.value || <span style={{ color: "red" }}>Undefined</span>}
        </div>
      ),
    },
    { field: "old_status", headerName: "Trisita Old Status", width: 130 },
    { field: "new_status", headerName: "Trisita New Status", width: 130 },
    { field: "subs_start_date", headerName: "Subs Start Date", width: 130 },
    { field: "subs_end_date", headerName: "Subs End Date", width: 130 },
    { field: "seat", headerName: "Seats", width: 70 },
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
      field: "product_line_code",
      headerName: "Product Line",
      width: 250,
      renderCell: (params) => {
        return <>{params?.value}</>;
      },
    },
  ];

  const filteredData = useMemo(() => {
    let data;
    if (filters?.subscriptionType === subscriptionTypeData?.New) {
      data = compareSubscriptionData?.new_subscription;
    } else if (filters?.subscriptionType === subscriptionTypeData?.Deleted) {
      data = compareSubscriptionData?.old_subscription;
    }

    if (filters?.status !== "All Status") {
      data = data?.filter((item) => item?.trisita_status === filters?.status);
    }
    return data;
  }, [filters?.subscriptionType, compareSubscriptionData, filters?.status]);

  // Table no 1 row selection
  const handleSelectionChange = ({ ids }) => {
    setSelectedId([...ids]);
  };
  // Prepare data for export
  const exportedData = useMemo(
    () => filteredData?.filter((item) => selectedId.includes(item?.id)),
    [filteredData, selectedId]
  );

  // Table no 2 row selection
  const handleSelectionChange2 = ({ ids }) => {
    setSelectedId2([...ids]);
  };
  // Prepare data for export
  const exportedData2 = useMemo(
    () =>
      compareSubscriptionData?.changed_entries?.filter((item) =>
        selectedId2.includes(item?.id)
      ),
    [compareSubscriptionData?.changed_entries, selectedId2]
  );

  return (
    <>
      <div>
        <div className="new-subscription-header">
          <h5 className="commom-header-title mb-0">
            Subscription Data Comparison
          </h5>
          <div className="new-subscription-filter">
            <CommonButton
              className="compare-subscription-btn"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  subscriptionType:
                    filters?.subscriptionType === subscriptionTypeData?.Deleted
                      ? subscriptionTypeData?.New
                      : subscriptionTypeData?.Deleted,
                }));
              }}
            >
              {filters?.subscriptionType === subscriptionTypeData?.New
                ? "Deleted"
                : "New"}
            </CommonButton>
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

        {compareSubscriptionDataLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="new-subscription-table">
            <ExportToExcel
              data={exportedData}
              columns={columns}
              fileName={`subs_trisita_${userDetail?.first_name}_${userDetail?.last_name}`}
              className="insight-export-btn"
            />
            <h3 className="common-insight-title">
              {filters?.subscriptionType === subscriptionTypeData?.New
                ? "New Data"
                : "Deleted Data"}
            </h3>
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

        {compareSubscriptionDataLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="new-subscription-table mt-4">
            <ExportToExcel
              data={exportedData2}
              columns={status_columns}
              fileName={`subs_trisita_${userDetail?.first_name}_${userDetail?.last_name}`}
              className="insight-export-btn"
            />
            <h3 className="common-insight-title">Subscription Change Log</h3>
            <CommonTable
              rows={compareSubscriptionData?.changed_entries}
              columns={status_columns}
              getRowId={getRowId}
              checkboxSelection
              handleRowSelection={handleSelectionChange2}
              toolbar
              exportFileName={`subs_trisita_${userDetail?.first_name}_${userDetail?.last_name}`}
            />
          </div>
        )}
      </div>

      <CommonModal
        isOpen={modal.show}
        handleClose={() => setModal({ show: false, id: null, tableId: null })}
        scrollable
        title={
          modal?.tableId === 1
            ? filters?.subscriptionType === subscriptionTypeData?.New
              ? "New Data Detail"
              : "Deleted Data Detail"
            : "Subscription Change Log Detail"
        }
      >
        <SubscriptionDetail />
      </CommonModal>
    </>
  );
};

export default CompareSubscription;
