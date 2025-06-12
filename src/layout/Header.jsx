import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import routesConstants from "@/routes/routesConstants";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useDispatch, useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import { getLogout } from "@/modules/login/slice/loginSlice";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import { setLayoutCSNFilter, setLayoutYearFilter } from "./slice/layoutSlice";
import Logout from "@mui/icons-material/Logout";
import useOutsideClick from "@/hooks/useOutsideClick";
import { getAllNotifications } from "@/modules/notification/slice/notificationsSlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

const Header = ({ isOpen, setIsOpen, isMobileView, setIsMobileView }) => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const { filter, userDetail } = useSelector((state) => ({
    filter: state?.layout?.filter,
    userDetail: state?.login?.userDetail,
  }));

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
    setNotificationOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(getLogout());
  };

  // Handle Toogle Menu
  const handleToogleMenu = () => {};

  const handleFilterChange = (key) => (event) => {
    if (key === "csn") {
      dispatch(setLayoutCSNFilter(event.target.value));
    } else {
      dispatch(setLayoutYearFilter(event.target.value));
    }
  };
  useOutsideClick(profileRef, () => setProfileDropdownOpen(false));
  useOutsideClick(notificationRef, () => setNotificationOpen(false));

  // NOtification
  const [notificationsState, setNotificationsState] = useState({
    count: 0,
    notifications: [],
    loading: false,
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotificationsState((prev) => ({ ...prev, loading: true }));
      const res = await dispatch(getAllNotifications({ isUser: false }));
      const data = res?.payload?.data || {};

      setNotificationsState({
        count: data?.count || 0,
        notifications: data?.notifications || [],
        loading: false,
      });
    };

    fetchNotifications();
  }, []);

  return (
    <header className="header_block">
      <div className="header_content">
        <div className="header_logo">
          <Link
            onClick={() => {
              setIsOpen(!isOpen);
              setIsMobileView(false);
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </Link>
        </div>
        <div className="header_right d-flex">
          <div className="dashboard-filter">
            <CommonSelect
              value={filter?.year}
              onChange={handleFilterChange("year")}
              options={[
                { value: "All Year", label: "All Year" },
                { value: "ADSK FY 2025", label: "ADSK FY 2025" },
                { value: "ADSK FY 2024", label: "ADSK FY 2024" },
                { value: "ADSK FY 2023", label: "ADSK FY 2023" },
              ]}
            />
            <CommonSelect
              value={filter?.csn}
              onChange={handleFilterChange("csn")}
              options={[
                { value: "All CSN", label: "All CSN" },
                { value: "5102086717", label: "5102086717" },
                { value: "5117963549", label: "5117963549" },
                { value: "1234567890", label: "1234567890" },
              ]}
            />
          </div>
          <div className="profile_dropdown">
            <Badge
              badgeContent={notificationsState?.count}
              color="error"
              overlap="circular"
            >
              <NotificationsOutlinedIcon
                className="me-2 notification-icon"
                onClick={() => {
                  setNotificationOpen(!isNotificationOpen);
                  setProfileDropdownOpen(false);
                }}
              />
            </Badge>
            {isNotificationOpen && (
              <div
                className="dropdown_menu notification-menu"
                ref={notificationRef}
              >
                <label>Notifications</label>
                {notificationsState?.loading ? (
                  <SkeletonLoader isDashboard />
                ) : notificationsState?.notifications?.length > 0 ? (
                  notificationsState?.notifications
                    ?.slice(0, 5)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          notification?.is_read ? "read" : "unread"
                        }`}
                      >
                        <p className="notification-message">
                          {notification?.notification_message.slice(0, 20)}...
                        </p>
                        <span className="notification-date">
                          {new Date(notification?.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))
                ) : (
                  <p className="no-notifications">No new notifications.</p>
                )}
                <div className="text-end">
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(routesConstants?.NOTIFICATIONS);
                      setNotificationOpen(false);
                    }}
                  >
                    All Notifications <Logout />
                  </span>
                </div>
              </div>
            )}
            <button
              className="profile_icon ms-2"
              onClick={toggleProfileDropdown}
            >
              👤
            </button>
            {isProfileDropdownOpen && (
              <div className="dropdown_menu" ref={profileRef}>
                <button
                  className="dropdown_item logout"
                  onClick={() => {
                    navigate(routesConstants.PROFILE + `/${userDetail?.id}`);
                  }}
                >
                  <span className="logout_icon">
                    <ManageAccountsIcon />
                  </span>
                  <span className="logout_text">Profile</span>
                </button>
                <button
                  className="dropdown_item logout"
                  onClick={() => navigate(routesConstants.CHANGE_PASSWORD)}
                >
                  <span className="logout_icon">
                    <LockResetIcon />
                  </span>
                  <span className="logout_text">Change Password</span>
                </button>
                <button className="dropdown_item logout" onClick={handleLogout}>
                  <span className="logout_icon">🚪</span>
                  <span className="logout_text">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
