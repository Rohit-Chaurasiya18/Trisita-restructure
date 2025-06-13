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
  getNewSubscriptionData,
  getNewSubscriptionDetail,
} from "../slice/subscriptionSlice";
import { Autocomplete, TextField, Typography } from "@mui/material";
import CommonButton from "@/components/common/buttons/CommonButton";
import useDebounce from "@/hooks/useDebounce";

const SetAction = () => {
  return (
    <>
      <div className="col-12 d-flex my-2">
        <div className="col-6 fw-bold">Subscription Acquired :</div>
        <div className="col-6">
          <Autocomplete
            disablePortal
            multiple
            options={[]}
            // value={filters?.account}
            getOptionLabel={(option) => option?.name}
            sx={{
              width: 300,
            }}
            onChange={(event, newValues) => {
              console.log(newValues);
            }}
            loading={false}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Type"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                      {false && (
                        <Typography variant="body2" color="textSecondary">
                          Loading...
                        </Typography>
                      )}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <CommonButton
          className={"w-auto"}
          style={{ background: "rgb(21, 149, 221)" }}
        >
          Action
        </CommonButton>
      </div>
    </>
  );
};

const NewSubscription = () => {
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState([null, null]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    id: null,
    isAssign: false,
  });
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: "All Status",
  });

  const {
    userDetail,
    filter,
    newSubscriptionDataLoading,
    newSubscriptionData,
  } = useSelector((state) => ({
    userDetail: state?.login?.userDetail,
    filter: state?.layout?.filter,
    newSubscriptionDataLoading: state?.subscription?.newSubscriptionDataLoading,
    newSubscriptionData: state?.subscription?.newSubscriptionData,
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
        ? newSubscriptionData
        : newSubscriptionData?.filter(
            (item) => item?.trisita_status === filters.status
          );
    setFilteredData(statusFiltered);
  }, [newSubscriptionData, filters.status]);

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
    dispatch(getNewSubscriptionData(payload));
  }, [filter?.csn, debounce]);

  // Handle modal open
  const handleOpenModel = (id, isAssign = false) => {
    setModal({ show: true, id, isAssign });
    dispatch(getNewSubscriptionDetail({ id }));
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
            onClick={() => handleOpenModel(params?.row.id, false)}
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
        field: "productLine",
        headerName: "Product Line",
        width: 250,
        renderCell: ({ value }) => (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>{value}</div>
        ),
      },
      {
        field: "created_date",
        headerName: "Created Date",
        width: 130,
        renderCell: ({ value }) => (
          <span>{new Date(value).toLocaleDateString()}</span>
        ),
      },
      {
        field: "action",
        headerName: "Action",
        width: 150,
        renderCell: (params) => (
          <span
            onClick={() => handleOpenModel(params?.row?.id, true)}
            className="assign-button text-black px-3 py-1 rounded border-0"
          >
            Assign Trigger
          </span>
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
            New Subscription Data (Newest)
          </h5>
          <div className="new-subscription-filter">
            <CommonDateRangePicker
              value={dateRange}
              onChange={handleChange}
              width="180px"
              placeholderStart="Start date"
              placeholderEnd="End date"
              disabled={newSubscriptionDataLoading}
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

        {newSubscriptionDataLoading ? (
          <SkeletonLoader isDashboard />
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
        handleClose={() => setModal({ show: false, id: null, isAssign: false })}
        scrollable
        title={modal.isAssign ? "Set Action" : "New Subscription Detail"}
      >
        {modal?.isAssign ? <SetAction /> : <SubscriptionDetail />}
      </CommonModal>
    </>
  );
};

export default NewSubscription;
