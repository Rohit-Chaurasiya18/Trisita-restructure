import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tooltip } from "@mui/material";

import {
  getLicenseOptimisation,
  getTaskLicenseData,
} from "../slice/LicenseOptimizationSlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonModal from "@/components/common/modal/CommonModal";

const LicenseOptimisationView = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {
    licenseOptimizationData,
    licenseOptimizationLoading,
    totalLicenseCount,
    totalUniqueUser,
    freeLicenseCount,
    totalLicenseOptimized,
  } = useSelector((state) => ({
    licenseOptimizationData:
      state?.LicenseOptimization?.licenseOptimizationData,
    licenseOptimizationLoading:
      state?.LicenseOptimization?.licenseOptimizationLoading,
    totalLicenseCount: state?.LicenseOptimization?.totalLicenseCount,
    totalUniqueUser: state?.LicenseOptimization?.totalUniqueUser,
    freeLicenseCount: state?.LicenseOptimization?.freeLicenseCount,
    totalLicenseOptimized: state?.LicenseOptimization?.totalLicenseOptimized,
  }));

  const [modal, setModal] = useState({ show: false, features: [] });

  const fetchLicenseOptimiseData = (taskId) => {
    const pollInterval = 3000; // 3 seconds interval, you can adjust

    const poll = () => {
      dispatch(getTaskLicenseData(taskId)).then((res) => {
        const status = res?.payload?.data?.status;

        if (status === "SUCCESS") {
          console.log("Task completed successfully");
          // setCurrentState("SUCCESS");
          return; // ✅ stop polling
        } else if (status === "FAILED") {
          console.error("Task failed");
          // setCurrentState("FAILED");
          return; // ✅ stop polling
        } else if (status === "PENDING") {
          console.log("Task still in process... polling again");
          setTimeout(poll, pollInterval); // ✅ keep polling
        }
      });
    };

    poll();
  };
  useEffect(() => {
    const payload = {
      branch_id: params?.branchId,
      account_csns: params?.accountId?.split(","),
      productLineCodes: params?.productId?.split(","),
      start_date: params?.startDate,
      end_date: params?.endDate,
    };
    dispatch(getLicenseOptimisation(payload)).then((res) => {
      if (
        res?.payload?.data?.task_id &&
        res?.payload?.data?.status === "PROCESSING"
      ) {
        fetchLicenseOptimiseData(res?.payload?.data?.task_id);
      }
    });
  }, []);

  const openModal = (features) =>
    setModal({ show: true, features: features || [] });

  const closeModal = () => setModal({ show: false, features: [] });

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
        field: "productLineCode",
        headerName: "Product Line Codes",
        width: 320,
      },
      { field: "team_name", headerName: "Team Name", width: 200 },

      {
        field: "primary_admin_email",
        headerName: "Primary Admin Email",
        width: 200,
      },
      {
        field: "total_days_count",
        headerName: "Product Feature Count",
        width: 200,
      },
      {
        field: "licensedType",
        headerName: "Licensed Type",
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
          <button
            onClick={() => openModal(value)}
            className="assign-button text-black px-3 py-1 rounded border-0"
          >
            Show Features
          </button>
        ),
      },
    ],
    []
  );

  const featuresColumns = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1 },
      { field: "count", headerName: "Count", flex: 1 },
    ],
    []
  );

  const dummyStats = useMemo(
    () => [
      { title: "Total License Count", value: totalLicenseCount },
      { title: "Total License Optimised", value: totalLicenseOptimized },
      { title: "Total Unique Count", value: totalUniqueUser },
      { title: "Free License Count", value: freeLicenseCount },
    ],
    [totalLicenseCount, totalUniqueUser, totalLicenseOptimized]
  );

  return (
    <>
      <div className="commom-header-title mb-0">License Optimization</div>
      <span className="common-breadcrum-msg">Welcome to your Team</span>

      <div className="license-optimise-widgets">
        {dummyStats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-card-left">
              <div className="stat-text">
                <div className="stat-title">{stat.title}</div>
              </div>
            </div>
            <div className="stat-progress">
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

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
              moduleName="License Optimization"
            />
          </div>
        )}
      </div>

      <CommonModal
        isOpen={modal?.show}
        handleClose={closeModal}
        title="View Features"
        scrollable
      >
        <CommonTable
          rows={modal?.features?.map((item, idx) => ({ ...item, id: idx + 1 }))}
          columns={featuresColumns}
          getRowId={(row) => row?.id}
          toolbar
          exportFileName="features"
          moduleName="License Optimization"
        />
      </CommonModal>
    </>
  );
};

export default LicenseOptimisationView;
