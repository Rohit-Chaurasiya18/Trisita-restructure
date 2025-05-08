import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonTable from "@/components/common/dataTable/CommonTable";
import DatePickerFilter from "@/components/common/date/DatePickerFilter";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import {
  //  columns,
  processedData,
} from "../constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRORAlertData } from "../slice/alertSubscription";

const AlertSubscription = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("All");

  const { filter, alertSubscriptionList } = useSelector((state) => ({
    filter: state?.layout?.filter,
    alertSubscriptionList: state?.alertSubscription?.alertSubscriptionList,
  }));

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const getRowId = (row) => row.id;

  useEffect(() => {
    dispatch(
      getRORAlertData({
        id: filter?.csn === "All CSN" ? "" : filter?.csn,
        status: status,
      })
    );
  }, [filter?.csn, status]);

  console.log(alertSubscriptionList);

  const columns = [
    {
      field: "subscriptionReferenceNumber",
      headerName: "subscription",
      width: 150,
      renderCell: (params, index) => (
        <div
          onClick={() => {
            // handleOpenModel(params?.row.id, subscriptionType);
          }}
          className="border-0"
        >
          <span className="action-button bg-white text-black px-3 py-1 rounded border-0">
            {params?.value}
          </span>
        </div>
      ),
    },
    {
      field: "account_name",
      headerName: "Account Name",
      width: 200,
      renderCell: (params) => {
        const { value: account } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {account?.length > maxChars ? account : account?.slice(0, maxChars)}
          </div>
        );
      },
    },
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
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {email?.length > maxChars ? email : email?.slice(0, maxChars)}
          </div>
        );
      },
    },
    { field: "seats", headerName: "Seats", width: 70 },
    { field: "endDate", headerName: "Subs End Date ", width: 130 },
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
      renderCell: (params) => {
        const { value: productLine } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {productLine?.length > maxChars
              ? productLine
              : productLine?.slice(0, maxChars)}
          </div>
        );
      },
    },
    {
      field: "created_date",
      headerName: "Created Date",
      width: 130,
      type: "date", // To indicate the data type
      renderCell: (params) => {
        // Custom render function to format the date
        const formattedDate = new Date(params.value).toLocaleDateString(); // Format date
        return <span>{formattedDate}</span>;
      },
      sortable: true, // Enable sorting
      filterable: true, // Enable filtering
    },
    // ...(userType && userType === "Superadmin"
    //   ? [{
    //     field: "",
    //     headerName: "Set Trigger",
    //     width: 150,
    //     renderCell: (params, index) => (
    //       <div className="flex items-center w-full justify-center">
    //         <button
    //           onClick={() => handleTriggerModel(params?.row.id)}
    //           className="action-button bg-[#8dbe86] text-black px-3 py-1 rounded"
    //         >
    //           Assign Trigger
    //         </button>
    //       </div>
    //     ),
    //   }] :
    //   []),
  ];
  return (
    <>
      <div className="alert-subscription">
        <div className="commom-header-title">
          ROR Change Alert / Lost to Competition
        </div>
        <div className="filter">
          <DatePickerFilter
            label="Start Date"
            onChange={(value) => console.log(value)}
          />
          <DatePickerFilter
            label="End Date"
            onChange={(value) => console.log(value)}
          />
          <CommonSelect
            onChange={handleStatusChange}
            value={status}
            options={[
              { value: "All", label: "All" },
              { value: "ROR", label: "ROR Change Alert" },
              { value: "LTC", label: "LTC (Lost to Competition)" },
            ]}
            sx={{
              width: "100px",
            }}
          />
          <CommonSelect
            // onChange={handleStatusChange}
            value={"All Status"}
            options={[
              { value: "All Status", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Expired", label: "Expired" },
            ]}
          />
        </div>
      </div>
      <div className="alert-subscription-table">
        <ExportToExcel
          data={alertSubscriptionList}
          columns={columns}
          fileName={`subs_trisita`}
          className="insight-export-btn"
        />
        <h3 className="common-insight-title">Deleted Data</h3>
        <CommonTable
          rows={alertSubscriptionList}
          columns={columns}
          getRowId={getRowId}
          checkboxSelection
          toolbar
          exportFileName={`subs_trisita`}
        />
      </div>
    </>
  );
};

export default AlertSubscription;
