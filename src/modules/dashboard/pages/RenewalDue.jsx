import { getAllAccount } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRenewalDue } from "../slice";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonTable from "@/components/common/dataTable/CommonTable";

const RenewalDue = () => {
  const dispatch = useDispatch();
  const {
    account_list,
    accountListLoading,
    renewalDueList,
    renewalDueListLoading,
  } = useSelector((state) => ({
    accountListLoading: state?.insightMetrics?.accountListLoading,
    account_list: state?.insightMetrics?.accountList,
    renewalDueList: state?.dashboard?.renewalDueList,
    renewalDueListLoading: state?.dashboard?.renewalDueListLoading,
  }));
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    account: [],
    status: "All Status",
  });

  useEffect(() => {
    setFilteredData(renewalDueList);
  }, [renewalDueList]);

  useEffect(() => {
    dispatch(getRenewalDue());
    dispatch(getAllAccount());
  }, []);

  const columns = [
    {
      field: "subscriptionReferenceNumber",
      headerName: "subscription",
      width: 150,
      renderCell: (params, index) => (
        <div>
          <button
            // onClick={() => handleOpenModel(params?.row.id)}
            className="action-button bg-white text-black px-3 py-1 rounded"
          >
            {params?.value}
          </button>
        </div>
      ),
    },
    {
      field: "account_name",
      headerName: "Account Name",
      width: 200,
      renderCell: (params) => {
        const { value: account } = params;
        return <div>{account}</div>;
      },
    },
    // { field: "bd_person", headerName: "BD Person Name", width: 200 },
    // { field: "renewal_person", headerName: "Renewal Person Name", width: 200 },
    // ...(user.user_type !== "Client"
    //   ? [
    //       {
    //         field: "bd_person",
    //         headerName: "BD Person Name",
    //         width: 200,
    //         renderCell: (params) => (
    //           <div>
    //             {params.value && params.value ? (
    //               params.value
    //             ) : (
    //               <span style={{ color: "red" }}>Undefined</span>
    //             )}
    //           </div>
    //         ),
    //       },
    //       {
    //         field: "renewal_person",
    //         headerName: "Renewal Person Name",
    //         width: 200,
    //         renderCell: (params) => (
    //           <div>
    //             {params.value && params.value ? (
    //               params.value
    //             ) : (
    //               <span style={{ color: "red" }}>Undefined</span>
    //             )}
    //           </div>
    //         ),
    //       },
    //     ]
    //   : []),
    { field: "account_csn", headerName: "Account CSN", width: 200 },
    {
      field: "retention_health_riskBand",
      headerName: "Retention health riskBand",
      width: 200,
    },
    // ...(user.user_type !== "Client"
    //   ? [
    //       {
    //         field: "branch",
    //         headerName: "Branch",
    //         width: 100,
    //         renderCell: (params) => (
    //           <div>
    //             {params.value && params.value ? (
    //               params.value
    //             ) : (
    //               <span style={{ color: "red" }}>Undefined</span>
    //             )}
    //           </div>
    //         ),
    //       },
    //     ]
    //   : []),
    {
      field: "contract_manager_email",
      headerName: "Contract Mgr. Email",
      width: 200,
      renderCell: (params) => {
        const { value: email } = params;
        return <div>{email}</div>;
      },
    },
    { field: "seats", headerName: "Seats", width: 100 },
    { field: "startDate", headerName: "Subs Start Date", width: 150 },
    { field: "endDate", headerName: "Subs End Date ", width: 150 },
    { field: "trisita_status", headerName: "Trisita Status", width: 150 },
    { field: "subscriptionStatus", headerName: "Status", width: 150 },
    { field: "lastPurchaseDate", headerName: "Last Purchase date", width: 200 },

    { field: "account_group", headerName: "Account Group", width: 150 },
    { field: "programType", headerName: "Program Type", width: 150 },
    { field: "subscriptionType", headerName: "Subscription Type", width: 150 },
    { field: "contract_end_date", headerName: "Contract EndDate", width: 150 },
    {
      field: "productLine",
      headerName: "Product Line",
      width: 250,
      renderCell: (params) => {
        const { value: productLine } = params;
        return <div>{productLine}</div>;
      },
    },
    // ...(userType && userType === "Superadmin"
    //   ? [
    //       {
    //         field: "",
    //         headerName: "Set Trigger",
    //         width: 150,
    //         renderCell: (params, index) => (
    //           <div className="flex items-center w-full justify-center">
    //             <button
    //               onClick={() => handleTriggerModel(params?.row.id)}
    //               className="action-button bg-[#8dbe86] text-black px-3 py-1 rounded"
    //             >
    //               Assign Trigger
    //             </button>
    //           </div>
    //         ),
    //       },
    //     ]
    //   : []),
  ];

  return (
    <>
      <div className="renewal-email-sent-header mb-4">
        <div>
          <h3 className="mb-0 commom-header-title">Renewal Due</h3>
          <span className="common-breadcrum-msg">
            Welcome to your Renewal Due
          </span>
        </div>
        <div className="subscription-filter">
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
                status: e?.target?.value,
              }));
            }}
          />
          <div
            className={`${
              filters?.account?.length > 0 && "multiple-select-container"
            }`}
          >
            <Autocomplete
              value={filters?.account}
              onChange={(event, newValues) => {
                setFilters((prev) => ({
                  ...prev,
                  account: newValues,
                }));
              }}
              options={
                account_list?.filter(
                  (item) =>
                    !filters?.account
                      ?.map((i) => i?.value)
                      ?.includes(item?.value)
                ) || []
              }
              multiple
              getOptionLabel={(option) => `${option?.label} (${option?.csn})`}
              loading={accountListLoading}
              disabled={accountListLoading || !account_list?.length}
              sx={{
                width: 300,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select an Account"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        {accountListLoading && (
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
      </div>
      {renewalDueListLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="payments-overdue-table">
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row?.id}
            toolbar
            moduleName="Renewal Due"
          />
        </div>
      )}
    </>
  );
};
export default RenewalDue;
