import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCampaignHistory } from "../slice/CampaignSlice";
import CommonTable from "@/components/common/dataTable/CommonTable";

const CampaignHistory = () => {
  const dispatch = useDispatch();
  const { CampaignHistoryList, CampaignHistoryLoading } = useSelector(
    (state) => ({
      CampaignHistoryList: state.Campaign.CampaignHistoryListList,
      CampaignHistoryLoading: state.Campaign.CampaignHistoryListLoading,
    })
  );

  useEffect(() => {
    dispatch(getCampaignHistory());
  }, []);

  const FormattedDateCell = ({ value }) => {
    const formattedDate = moment(value).format("MMMM DD, YYYY hh:mm:ss A");
    return <div>{formattedDate}</div>;
  };

  const columns = [
    {
      field: "subscription",
      headerName: "#Subscriptionr",
      width: 180,
      renderCell: (params, index) => (
        <div>
          <button
            onClick={() => handleOpenModel(params?.row.subscription_id)}
            className="action-button bg-white text-black px-3 py-1 rounded"
          >
            {params.value}
          </button>
        </div>
      ),
    },
    {
      field: "user_assign",
      headerName: "BD Person Name",
      width: 180,
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
      field: "account_name",
      headerName: "Account",
      width: 250,
      renderCell: (params) => {
        const { value: Account } = params;
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "300px" }}>
            {Account?.length > maxChars ? Account : Account?.slice(0, maxChars)}
          </div>
        );
      },
    },
    {
      field: "sent_at",
      headerName: "Sent at",
      width: 200,
      renderCell: (params) => <FormattedDateCell {...params} />,
    },
    { field: "recipient", headerName: "Recipient", width: 200 },
    {
      field: "AccountStatus",
      headerName: "Autodesk Account Status",
      width: 140,
    },
    {
      field: "contract_status",
      headerName: "Trisita Account Status",
      width: 140,
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
    { field: "status", headerName: "Message Status", width: 140 },
    {
      field: "",
      headerName: "Action",
      width: 150,
      renderCell: (params, index) => (
        <div className="flex items-center w-full justify-center">
          <button
            // onClick={() => HandleViewDetails(params?.row.id)}
            className="action-button bg-[#8dbe86] text-black px-3 py-1 rounded"
          >
            View Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="manage-teams-container">
        <div className="manage-team-header">
          <div className="commom-header-title mb-0">Campaign History</div>
          <span className="common-breadcrum-msg">
            Welcome to you campaign history
          </span>
        </div>
        <div className="manage-team-table">
          <CommonTable
            rows={CampaignHistoryList?.length > 0 ? CampaignHistoryList : []}
            columns={columns}
            getRowId={(row) => row?.id}
            toolbar
          />
        </div>
      </div>
    </>
  );
};

export default CampaignHistory;
