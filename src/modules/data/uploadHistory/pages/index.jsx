import CommonTable from "@/components/common/dataTable/CommonTable";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { getUploadedFiles } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const UploadHistory = () => {
  const dispatch = useDispatch();
  const { uploadedFilesData, uploadedFilesDataLoading } = useSelector(
    (state) => ({
      uploadedFilesData: state?.insightMetrics?.uploadedFilesData,
      uploadedFilesDataLoading: state?.insightMetrics?.uploadedFilesDataLoading,
    })
  );
  useEffect(() => {
    dispatch(getUploadedFiles());
  }, []);

  const columns = [
    { field: "user_name", headerName: "User Name", flex: 1 },
    { field: "user_email", headerName: "User Email", flex: 1 },
    { field: "file_name", headerName: "File Name", flex: 1 },
    {
      field: "upload_date",
      headerName: "Uploaded At",
      flex: 1,
      renderCell: (params) => (
        <div>{moment(params?.value).format("MMMM DD, YYYY hh:mm:ss A")}</div>
      ),
    },
    {
      field: "uploaded_file",
      headerName: "Uploaded File",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <a href={`${params.value}`} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
        ) : (
          "No File"
        ),
    },
  ];
  return (
    <>
      <div className="manage-teams-container">
        <div className="manage-team-header">
          <div className="commom-header-title mb-0">Uploaded History</div>
          <span className="common-breadcrum-msg">
            Welcome to your Uploaded History
          </span>
        </div>
        <div className="manage-team-table">
          {uploadedFilesDataLoading ? (
            <SkeletonLoader />
          ) : (
            <CommonTable
              rows={uploadedFilesData?.length > 0 ? uploadedFilesData : []}
              columns={columns}
              getRowId={(row) => row.id}
              toolbar
              moduleName="Download History"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UploadHistory;
