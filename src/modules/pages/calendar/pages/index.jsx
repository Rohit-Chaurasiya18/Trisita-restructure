import React, { useEffect, useMemo } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { getCalendarList } from "../../slice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

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

  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      views: Object.keys(Views).map((k) => Views[k]),
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
        <div className="" style={{ height: "100vh", padding: "10px" }}>
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
          />
        </div>
      )}
    </>
  );
};

export default CalendarComponent;
