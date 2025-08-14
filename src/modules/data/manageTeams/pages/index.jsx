import CommonTable from "@/components/common/dataTable/CommonTable";
import {
  getAllUser,
  updateDownloadPermission,
} from "@/modules/accounts/slice/accountSlice";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import moment from "moment";
import { toast } from "react-toastify";

const ManageTeams = () => {
  const dispatch = useDispatch();
  const { User } = useSelector((state) => ({
    User: state?.account?.allUserData?.User,
  }));
  useEffect(() => {
    dispatch(getAllUser());
  }, []);

  const columns = [
    { field: "email", headerName: "Email", width: 250 },
    { field: "first_name", headerName: "First Name" },
    { field: "last_name", headerName: "Last Name" },
    { field: "phone", headerName: "Phone Number", width: 250 },
    { field: "designation", headerName: "Designation", width: 250 },
    {
      field: "is_download_allow",
      headerName: "Download Permission",
      width: 160,
      renderCell: (params) => {
        return (
          <input
            type="checkbox"
            style={{
              height: "20px",
              width: "100%",
              textAlign: "center  ",
            }}
            checked={params?.value}
            onChange={() => {
              dispatch(
                updateDownloadPermission({ user_id: params?.row?.id })
              ).then((res) => {
                if (res?.payload?.status === 200) {
                  toast.success("Download permission update.");
                }
              });
            }}
          />
        );
      },
    },

    {
      field: "user_type",
      headerName: "Access Level",
      width: 300,
      renderCell: (params) => {
        return (
          <label className="user-acces-level">
            {params?.row?.user_type === "Admin" ? (
              <AdminPanelSettingsOutlinedIcon />
            ) : params?.row?.user_type === "Superuser" ? (
              <SecurityOutlinedIcon />
            ) : params?.row?.user_type === "Primaryadmin" ? (
              <LockOpenOutlinedIcon />
            ) : (
              ""
            )}
            {params?.row?.user_type}
          </label>
        );
      },
    },
    {
      field: "last_login",
      headerName: "Last Login Details",
      width: 300,
      renderCell: ({ value }) => {
        const formattedDateTime = value
          ? moment(value).format("DD/MM/YYYY [at] hh:mm:ss A")
          : "-";
        return <Typography>{formattedDateTime}</Typography>;
      },
    },
  ];
  return (
    <>
      <div className="manage-teams-container">
        <div className="manage-team-header">
          <div className="commom-header-title mb-0">TEAM</div>
          <span className="common-breadcrum-msg">welcome to you Team</span>
        </div>
        <div className="manage-team-table">
          <CommonTable
            rows={User?.length > 0 ? User : []}
            columns={columns}
            getRowId={(row) => row.id}
            toolbar
            moduleName="Manage Team"
          />
        </div>
      </div>
    </>
  );
};

export default ManageTeams;
