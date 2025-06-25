import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetRenewalEmailSentList } from "../slice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import ExportToExcel from "@/components/common/buttons/ExportToExcel";

const RenewalEmailSent = () => {
  const dispatch = useDispatch();
  const { renewalEmailSentList, renewalEmailSentListLoading, userDetail } =
    useSelector((state) => ({
      renewalEmailSentList: state?.dashboard?.renewalEmailSentList,
      renewalEmailSentListLoading:
        state?.dashboard?.renewalEmailSentListLoading,
      userDetail: state?.login?.userDetail,
    }));
  const [selectedId, setSelectedId] = useState([]);

  useEffect(() => {
    dispatch(GetRenewalEmailSentList());
  }, []);

  const columns = [
    {
      field: "subscription",
      headerName: "Subscription",
      width: 200,
      flex: 1,
    },
    { field: "account_name", headerName: "Account Name", width: 250 },
    { field: "AccountStatus", headerName: "Account Status", width: 200 },
    { field: "contract_status", headerName: "Contact Status", width: 200 },
    { field: "status", headerName: "Status", width: 200 },
    { field: "partnerCSN", headerName: "Partner CSN", width: 200 },
    { field: "recipient", headerName: "Recipient", width: 250 },
  ];

  const handleSelectionChange = (selectedRows) => {
    const idArray = [...selectedRows?.ids];
    if (idArray?.length > 0) {
      setSelectedId(idArray);
    } else {
      setSelectedId([]);
    }
  };

  const exportedData = useMemo(
    () => renewalEmailSentList?.filter((item) => selectedId.includes(item?.id)),
    [selectedId]
  );
  return (
    <>
      {renewalEmailSentListLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="renewal-email-sent-table">
          <ExportToExcel
            data={exportedData}
            columns={columns}
            fileName={`renewal_email_sent_${userDetail?.first_name}_${
              userDetail?.last_name
            }_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`}
            className="account-export-btn"
          />
          <CommonTable
            rows={renewalEmailSentList}
            columns={columns}
            getRowId={(row) => row?.id}
            checkboxSelection
            handleRowSelection={handleSelectionChange}
            toolbar
            exportFileName={`renewal_email_sent_${userDetail?.first_name}_${userDetail?.last_name}`}
          />
        </div>
      )}
    </>
  );
};
export default RenewalEmailSent;
