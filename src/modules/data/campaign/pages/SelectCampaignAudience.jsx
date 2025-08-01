import { useLocation, useNavigate } from "react-router-dom";
import { getCampaignAudience } from "../slice/CampaignSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CommonTable from "@/components/common/dataTable/CommonTable";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonButton from "@/components/common/buttons/CommonButton";
import routesConstants from "@/routes/routesConstants";

const SelectCampaignAudience = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);

  const handleSelectionChange = (selectedRows) => {
    const idArray = [...selectedRows?.ids];
    if (idArray?.length > 0) {
      setSelectedId(idArray);
    } else {
      setSelectedId([]);
    }
  };
  useEffect(() => {
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
      const rows = res?.payload?.data?.data || [];
      setFilteredData(rows);
      setLoading(false);
    });
  }, [state]);

  const columns = [
    {
      field: "subscriptionReferenceNumber",
      headerName: "Subscription",
      width: 150,

      renderCell: (params) => (
        <span className="action-button bg-white text-black px-3 py-1 rounded border-0">
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
        const maxChars = 20;

        return (
          <div style={{ whiteSpace: "normal", maxWidth: "200px" }}>
            {email?.length > maxChars ? email : email?.slice(0, maxChars)}
          </div>
        );
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
          // onClick={() => handleAccountContactModel(params?.row.account_id)}
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
          {selectedId?.length > 0 && (
            <div className="d-flex justify-content-start">
              <CommonButton
                className="run-campaign-btn"
                onClick={() => {
                  let payload = {
                    selected_rows: selectedId,
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
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectCampaignAudience;
