import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNotifications,
  updateMarkAllAsRead,
  updateMarkAsRead,
} from "../slice/notificationsSlice";
import { getAllUser } from "@/modules/accounts/slice/accountSlice";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonButton from "@/components/common/buttons/CommonButton";
import { fetchNotifications } from "@/layout/slice/layoutSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { allUserData, count, notificationsData, notificationsDataLoading } =
    useSelector((state) => ({
      allUserData: state?.account?.allUserData?.User,
      count: state?.notifications?.count,
      notificationsData: state?.notifications?.notificationsData,
      notificationsDataLoading: state?.notifications?.notificationsDataLoading,
    }));

  const [filters, setFilters] = useState({
    user: null,
  });

  useEffect(() => {
    dispatch(
      getAllNotifications({
        isUser: filters?.user ? filters?.user?.value : false,
      })
    );
    dispatch(getAllUser());
  }, [filters?.user]);

  const userArray = useMemo(
    () =>
      allUserData?.map((item) => ({
        label: `${item?.first_name} ${item?.last_name}`,
        value: item?.id,
      })),
    [allUserData]
  );

  const handleMarkAsRead = (id) => {
    dispatch(updateMarkAsRead({ id, data: notificationsData })).then((res) => {
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        dispatch(fetchNotifications());
      }
    });
  };

  const handleMarkAllAsRead = () => {
    dispatch(updateMarkAllAsRead({ data: notificationsData })).then((res) => {
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        dispatch(fetchNotifications());
      }
    });
  };

  return (
    <>
      <div className="notification-header">
        <div className="commom-header-title">All Notifications</div>
        <div className="notification-filter">
          <CommonAutocomplete
            onChange={(event, newValue) => {
              setFilters((prev) => ({ ...prev, user: newValue }));
            }}
            options={userArray}
            label="Select a User"
            value={filters?.user}
          />
          {!filters?.user && (
            <CommonButton
              className="mark-read-all-button"
              onClick={() => handleMarkAllAsRead()}
              isDisabled={notificationsData?.every((n) => n?.is_read)}
            >
              Mark All as Read
            </CommonButton>
          )}
        </div>
      </div>
      {notificationsDataLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="notification-container">
          {notificationsData.length > 0 ? (
            notificationsData.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${
                  notification.is_read ? "read" : "unread"
                }`}
              >
                <div className="notification-content">
                  <div className="notification-message">
                    {notification.notification_message}
                  </div>
                  <div className="notification-date">
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </div>

                {!filters?.user && !notification.is_read && (
                  <CommonButton
                    className="mark-read-button"
                    onClick={() => handleMarkAsRead(notification?.id)}
                  >
                    Mark as Read
                  </CommonButton>
                )}
              </div>
            ))
          ) : (
            <div className="no-notification">No notifications available.</div>
          )}
        </div>
      )}
    </>
  );
};

export default Notification;
