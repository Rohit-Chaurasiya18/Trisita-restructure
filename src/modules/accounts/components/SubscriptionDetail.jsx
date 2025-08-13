import CommonTable from "@/components/common/dataTable/CommonTable";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import moment from "moment";
import { useSelector } from "react-redux";

const SubscriptionDetail = ({ moduleName = "" }) => {
  const { subscriptionByThirdParty, subscriptionByThirdPartyLoading } =
    useSelector((state) => ({
      subscriptionByThirdParty: state?.account?.subscriptionByThirdParty,
      subscriptionByThirdPartyLoading:
        state?.account?.subscriptionByThirdPartyLoading,
    }));

  const columns = [
    {
      field: "subscriptionReferenceNumber",
      headerName: "subscription",
      width: 150,
      renderCell: (params, index) => (
        <span
          //   onClick={() => handleOpenModel(params?.row.id)}
          className="action-button bg-white text-black px-3 py-1 rounded border-0"
        >
          {params?.value}
        </span>
      ),
    },
    {
      field: "account_name",
      headerName: "Account Name",
      width: 250,
      renderCell: (params) => {
        const { value: account } = params;

        return <div>{account}</div>;
      },
    },
    { field: "part_number", headerName: "Part Number", width: 200 },
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
    { field: "account_csn", headerName: "Account CSN", width: 100 },
    {
      field: "retention_health_riskBand",
      headerName: "Retention health riskBand",
      width: 100,
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
        return <div>{email}</div>;
      },
    },
    { field: "account_type", headerName: "Account Type", width: 130 },
    { field: "seats", headerName: "Seats", width: 70 },
    {
      field: "startDate",
      headerName: "Subs Start Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params?.value
              ? moment(params?.value).format("DD/MM/YYYY")
              : params?.value}
          </div>
        );
      },
    },
    {
      field: "endDate",
      headerName: "Subs End Date ",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}
          </div>
        );
      },
    },
    { field: "trisita_status", headerName: "Trisita Status", width: 130 },
    { field: "subscriptionStatus", headerName: "Status", width: 100 },
    {
      field: "lastPurchaseDate",
      headerName: "Last Purchase date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}
          </div>
        );
      },
    },
    { field: "account_group", headerName: "Account Group", width: 150 },
    { field: "programType", headerName: "Program Type", width: 200 },
    { field: "subscriptionType", headerName: "Subscription Type", width: 200 },
    {
      field: "contract_end_date",
      headerName: "Contract End Date",
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}
          </div>
        );
      },
    },
    { field: "productLineCode", headerName: "Product Line Code", width: 130 },
    { field: "contract_term", headerName: "Contract Term", width: 130 },
    { field: "switchType", headerName: "Switch Type", width: 130 },
    { field: "switchYear", headerName: "Switch Year", width: 130 },
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
      renderCell: (params) => {
        const { value: productLine } = params;

        return <>{productLine}</>;
      },
    },
  ];
  return (
    <>
      {subscriptionByThirdPartyLoading ? (
        <SkeletonLoader />
      ) : (
        <CommonTable
          rows={subscriptionByThirdParty}
          columns={columns}
          getRowId={(row) => row?.id}
          toolbar
          moduleName={moduleName}
        />
      )}
    </>
  );
};

export default SubscriptionDetail;
