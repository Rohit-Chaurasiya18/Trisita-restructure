import CommonTable from "@/components/common/dataTable/CommonTable";
import { getAllUser } from "@/modules/accounts/slice/accountSlice";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

const ManageTeams = () => {
  const dispatch = useDispatch();
  const { User } = useSelector((state) => ({
    User: state?.account?.allUserData?.User,
  }));
  useEffect(() => {
    dispatch(getAllUser());
  }, []);

  const columns = [
    { field: "id", headerName: "Id" },
    { field: "email", headerName: "Email", width: 250 },
    { field: "first_name", headerName: "First Name" },
    { field: "last_name", headerName: "Last Name" },
    { field: "phone", headerName: "Phone Number", width: 250 },
    { field: "designation", headerName: "Designation", width: 250 },
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
        const formattedDateTime = new Date(value).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
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
          />
        </div>
      </div>
    </>
  );
};

export default ManageTeams;
