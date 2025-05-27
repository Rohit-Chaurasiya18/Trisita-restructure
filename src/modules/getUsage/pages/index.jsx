import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import { useState } from "react";

const GetUsage = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  return (
    <>
      <div className="">Get Usage</div>
      <CommonDateRangePicker
        value={dateRange}
        onChange={setDateRange}
        width="180px"
        placeholderStart="Start date"
        placeholderEnd="End date"
      />
    </>
  );
};

export default GetUsage;
