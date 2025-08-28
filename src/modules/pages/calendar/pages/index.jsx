import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { getCalendarList, getSubscriptionByCalendar } from "../../slice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonModal from "@/components/common/modal/CommonModal";
import SubscriptionDetail from "@/modules/subscription/components/SubscriptionDetail";

const mLocalizer = momentLocalizer(moment);
const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "lightblue",
    },
  });

const CalendarComponent = () => {
  const dispatch = useDispatch();
  const { calendarList, calendarListLoading } = useSelector((state) => ({
    calendarList: state.pages.calendarList,
    calendarListLoading: state.pages.calendarListLoading,
  }));
  const [currentView, setCurrentView] = useState("month");
  const [modal, setModal] = useState({
    data: null,
    isOpen: false,
  });

  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      views: ["month", "week", "day"],
    }),
    []
  );
  useEffect(() => {
    dispatch(getCalendarList());
  }, []);

  return (
    <>
      <div className="mb-4">
        <div className="commom-header-title mb-0">Calendar View</div>
        <span className="common-breadcrum-msg">
          check data in calendar view
        </span>
      </div>
      {calendarListLoading ? (
        <SkeletonLoader />
      ) : (
        <div
          className=""
          style={{
            height: currentView === "month" ? "100vh" : "100%",
            padding: "10px",
          }}
        >
          <Calendar
            components={components}
            defaultDate={defaultDate}
            events={
              calendarList?.length > 0
                ? calendarList?.map((item) => {
                    return {
                      ...item,
                      start: new Date(item?.date),
                      end: new Date(item?.date),
                      allDay: true,
                    };
                  })
                : []
            }
            localizer={mLocalizer}
            max={max}
            showMultiDayTimes
            step={60}
            views={views}
            onSelectEvent={(event) => {
              setModal({ data: event, isOpen: true });
              dispatch(
                getSubscriptionByCalendar({
                  id: event?.id,
                  status: event?.status,
                })
              );
            }}
            eventPropGetter={(event) => {
              const backgroundColor =
                event?.status === 1
                  ? "green"
                  : event?.status === 2
                  ? "yellow"
                  : "red";
              return {
                style: {
                  backgroundColor,
                  color: event?.status === 2 ? "black" : "white", // keep text readable
                  borderRadius: "4px",
                  padding: "2px 4px",
                },
              };
            }}
            view={currentView}
            onView={(view) => setCurrentView(view)}
          />
        </div>
      )}
      <CommonModal
        handleClose={() => {
          setModal({ data: null, isOpen: false });
        }}
        isOpen={modal?.isOpen}
        title="Subscription Details"
      >
        <SubscriptionDetail />
      </CommonModal>
    </>
  );
};

export default CalendarComponent;
