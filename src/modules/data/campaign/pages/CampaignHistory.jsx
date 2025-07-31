import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCampaignHistory,
  getCampaignHistoryById,
} from "../slice/CampaignSlice";
import CommonTable from "@/components/common/dataTable/CommonTable";
import moment from "moment";
import CommonModal from "@/components/common/modal/CommonModal";

const CampaignHistory = () => {
  const dispatch = useDispatch();
  const {
    CampaignHistoryList,
    CampaignHistoryLoading,
    campaignHistoryById,
    campaignHistoryByIdLoading,
  } = useSelector((state) => ({
    CampaignHistoryList: state.Campaign.CampaignHistoryListList,
    CampaignHistoryLoading: state.Campaign.CampaignHistoryListLoading,
    campaignHistoryById: state.Campaign.campaignHistoryById,
    campaignHistoryByIdLoading: state.Campaign.campaignHistoryByIdLoading,
  }));
  const [modal, setModal] = useState(false);

  useEffect(() => {
    dispatch(getCampaignHistory());
  }, []);

  const FormattedDateCell = ({ value }) => {
    const formattedDate = moment(value).format("MMMM DD, YYYY hh:mm:ss A");
    return <div>{formattedDate}</div>;
  };
  const HandleViewDetails = (id) => {
    setModal(true);
    dispatch(getCampaignHistoryById(id));
  };

  const columns = [
    {
      field: "subscription",
      headerName: "#Subscriptionr",
      width: 180,
      renderCell: (params, index) => (
        <span
          // onClick={() => handleOpenModel(params?.row.subscription_id)}
          className="action-button bg-white text-black px-3 py-1 rounded border-0"
        >
          {params.value}
        </span>
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
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params, index) => (
        <span
          onClick={() => HandleViewDetails(params?.row.id)}
          className="assign-button text-black px-3 py-1 rounded border-0"
        >
          View Details
        </span>
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
            disableSelection
          />
        </div>
      </div>
      <CommonModal
        isOpen={modal}
        title={"Campaign detail"}
        handleClose={() => setModal(false)}
      >
        <div className="final-campaign-data">
          {[
            {
              key: "Recipient",
              value: campaignHistoryById?.recipient || "N/A",
            },
            {
              key: "Subject",
              value: campaignHistoryById?.subject || "N/A",
            },
            {
              key: "Message",
              value: campaignHistoryById?.message_body || "N/A",
            },
            {
              key: "Status",
              value: campaignHistoryById?.status || "N/A",
            },
          ]?.map((item) => (
            <div className="selected-data-item">
              <span className="selected-data-label">{item?.key}:</span>
              <span className="selected-data-value">
                {item?.value || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </CommonModal>
    </>
  );
};

export default CampaignHistory;
