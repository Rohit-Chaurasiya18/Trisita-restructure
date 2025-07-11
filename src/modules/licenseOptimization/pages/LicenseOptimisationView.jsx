import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getLicenseOptimisation } from "../slice/LicenseOptimizationSlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import { Tooltip } from "@mui/material";
import CommonModal from "@/components/common/modal/CommonModal";

const LicenseOptimisationView = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { licenseOptimizationData, licenseOptimizationLoading } = useSelector(
    (state) => ({
      licenseOptimizationData:
        state?.LicenseOptimization?.licenseOptimizationData,
      licenseOptimizationLoading:
        state?.LicenseOptimization?.licenseOptimizationLoading,
    })
  );
  const [modal, setModal] = useState({
    show: false,
    features: [],
  });

  useEffect(() => {
    let payload = {
      branch_id: params?.branchId,
      account_ids: params?.accountId?.split(","),
      productLineCodes: params?.productId?.split(","),
      start_date: params?.startDate,
      end_date: params?.endDate,
    };
    dispatch(getLicenseOptimisation(payload));
  }, [params]);

  // Table column definition
  const columns = useMemo(
    () => [
      { field: "user_id", headerName: "User ID", width: 600 },
      { field: "account_csn", headerName: "CSN", width: 200 },
      {
        field: "account_name",
        headerName: "Account",
        width: 200,
        renderCell: ({ value }) => (
          <Tooltip title={value || ""}>
            <span className="text-gray-500">{value}</span>
          </Tooltip>
        ),
      },
      { field: "usage_type", headerName: "Usage Type", width: 200 },
      {
        field: "product_lines",
        headerName: "Product Line Code / Type of License Assigned",
        width: 320,
        renderCell: ({ value }) => {
          let Arr = value?.map((item) => `${item?.name} - (${item?.code})`);
          return (
            <div>
              <Tooltip title={Arr?.join(", ") || ""}>{Arr?.join(", ")}</Tooltip>
            </div>
          );
        },
      },
      { field: "team_name", headerName: "Team Name", width: 200 },
      {
        field: "primary_admin_email",
        headerName: "Primary Admin Email",
        width: 200,
      },
      {
        field: "type_of_actual_user",
        headerName: "Type of Actual User",
        width: 200,
      },
      {
        field: "features",
        headerName: "Features",
        width: 150,
        renderCell: ({ value }) => (
          <span
            onClick={() =>
              setModal((prev) => ({
                show: true,
                features: value,
              }))
            }
            className="assign-button text-black px-3 py-1 rounded border-0"
          >
            Show Features
          </span>
        ),
      },
    ],
    []
  );

  const featuresColumns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        width: 200,
        flex: 1,
      },
      {
        field: "count",
        headerName: "Count",
        width: 200,
        flex: 1,
      },
    ],
    []
  );
  return (
    <>
      <div className="commom-header-title mb-0">License Optimise</div>
      <span className="common-breadcrum-msg">Welcome to your Team</span>
      <div className="mt-4">
        {licenseOptimizationLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="unique-user-count-table">
            <CommonTable
              rows={licenseOptimizationData}
              columns={columns}
              getRowId={(row) => row?.user_id}
              toolbar
              exportFileName="license_optimise"
            />
          </div>
        )}
      </div>
      <CommonModal
        isOpen={modal?.show}
        handleClose={() =>
          setModal({
            show: false,
            features: [],
          })
        }
        title={"View Features"}
        scrollable
      >
        <CommonTable
          rows={modal?.features?.map((item, idx) => ({ ...item, id: idx + 1 }))}
          columns={featuresColumns}
          getRowId={(row) => row?.id}
          toolbar
          exportFileName="features"
        />
      </CommonModal>
    </>
  );
};

export default LicenseOptimisationView;
