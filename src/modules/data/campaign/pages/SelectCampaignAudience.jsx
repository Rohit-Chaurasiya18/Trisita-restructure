import { useLocation, useNavigate } from "react-router-dom";
import { getCampaignAudience } from "../slice/CampaignSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CommonTable from "@/components/common/dataTable/CommonTable";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonButton from "@/components/common/buttons/CommonButton";
import routesConstants from "@/routes/routesConstants";
import { getBackupSubscriptionDetail } from "@/modules/subscription/slice/subscriptionSlice";
import CommonModal from "@/components/common/modal/CommonModal";
import SubscriptionDetail from "@/modules/subscription/components/SubscriptionDetail";
import SetContent from "../components/SetContent";

const SelectCampaignAudience = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    type: null,
    id: null,
    data: null,
  });

  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: "include",
    ids: new Set(),
  });

  const handleSelectionChange = (selectedRows) => {
    setRowSelectionModel(selectedRows);
  };

  const handleData = () => {
    let payload = {
      branch: state?.branch,
      accountGroup: state?.accountGroup,
      pcsn: "",
      industryGroup: state?.industryGroup,
      segmentGroup: state?.segmentGroup,
      subSegmentGroup: state?.subSegmentGroup,
      productLine: state?.productLine,
      status: state?.status,
    };
    setLoading(true);
    dispatch(getCampaignAudience(payload)).then((res) => {
      const rows =
        res?.payload?.data?.data?.map((item) => ({
          ...item,
          bd_person_label: item?.bd_person?.join(", "),
          renewal_person_label: item?.renewal_person?.join(", "),
        })) || [];
      if (state?.selected_rows) {
        setRowSelectionModel((prev) => ({
          ...prev,
          ids: new Set(state?.selected_rows),
        }));
      } else {
        setRowSelectionModel((prev) => ({
          ...prev,
          ids: new Set(rows?.map((i) => i?.id)),
        }));
      }
      setFilteredData(rows);
      setLoading(false);
    });
  };

  useEffect(() => {
    handleData();
  }, [state]);

  const handleOpenModel = (subscription_id) => {
    setModal({ show: true, type: 1, id: subscription_id });
    dispatch(
      getBackupSubscriptionDetail({ id: subscription_id, isSubscription: true })
    );
  };

  const columns = [
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
      renderCell: (params) => {
        const { value: account } = params;
        return <div>{account}</div>;
      },
    },
    {
      field: "bd_person_label",
      headerName: "BD Person Name",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.value ? (
            params.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "renewal_person_label",
      headerName: "Renewal Person Name",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.value ? (
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
      headerName: "Retention Risk",
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
    { field: "seats", headerName: "Seats", width: 70 },
    { field: "startDate", headerName: "Subs Start Date", width: 130 },
    { field: "endDate", headerName: "Subs End Date ", width: 130 },
    { field: "trisita_status", headerName: "Trisita Status", width: 130 },
    { field: "subscriptionStatus", headerName: "Status", width: 100 },
    { field: "lastPurchaseDate", headerName: "Last Purchase date", width: 130 },

    { field: "account_group", headerName: "Account Group", width: 100 },
    { field: "programType", headerName: "Program Type", width: 100 },
    { field: "subscriptionType", headerName: "Subscription Type", width: 100 },
    { field: "contract_end_date", headerName: "Contract EndDate", width: 130 },
    { field: "productLineCode", headerName: "Product Line Code", width: 130 },

    {
      field: "productLine",
      headerName: "Product Line",
      width: 250,
      renderCell: (params) => {
        const { value: productLine } = params;
        return <div>{productLine}</div>;
      },
    },
    {
      field: "action",
      headerName: "Set Contact",
      width: 150,
      renderCell: (params, index) => (
        <span
          onClick={() =>
            setModal({
              show: true,
              type: 2,
              id: params?.row?.id,
              data: params?.row,
            })
          }
          className="assign-button text-black px-3 py-1 rounded border-0"
        >
          Assign Contact
        </span>
      ),
    },
  ];
  return (
    <div>
      <div className="manage-teams-container">
        <div className="manage-team-header d-flex flex-wrap justify-content-between">
          <div>
            <div className="commom-header-title mb-0">
              Select Campaign Audience
            </div>
            <span className="common-breadcrum-msg">
              Welcome to you campaign audience
            </span>
          </div>
          {rowSelectionModel?.ids?.size > 0 && (
            <div className="d-flex justify-content-start">
              <CommonButton
                className="run-campaign-btn"
                onClick={() => {
                  let payload = {
                    selected_rows: [...rowSelectionModel?.ids],
                    branch: state?.branch,
                    accountGroup: state?.accountGroup,
                    pcsn: "",
                    industryGroup: state?.industryGroup,
                    segmentGroup: state?.segmentGroup,
                    subSegmentGroup: state?.subSegmentGroup,
                    productLine: state?.productLine,
                    status: state?.status,
                  };
                  navigate(routesConstants?.FINAL_CAMPAIGN, {
                    state: payload,
                  });
                }}
              >
                Select Campaign Audience
              </CommonButton>
            </div>
          )}
        </div>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="manage-team-table">
            <CommonTable
              rows={filteredData?.length > 0 ? filteredData : []}
              columns={columns}
              getRowId={(row) => row?.id}
              toolbar
              checkboxSelection
              handleRowSelection={handleSelectionChange}
              isCustomRowSelection={true}
              rowSelectionModel={rowSelectionModel}
            />
          </div>
        )}
      </div>
      <CommonModal
        isOpen={modal?.show}
        title={modal?.type === 1 ? "Subscription Detail" : "Set Content"}
        handleClose={() => setModal({ show: false, type: null, id: null })}
      >
        {modal?.type === 1 ? (
          <SubscriptionDetail />
        ) : (
          <SetContent
            modal={modal}
            handleClose={() => {
              setModal({ data: null, id: null, show: false, type: null });
              handleData();
            }}
          />
        )}
      </CommonModal>
    </div>
  );
};

export default SelectCampaignAudience;
