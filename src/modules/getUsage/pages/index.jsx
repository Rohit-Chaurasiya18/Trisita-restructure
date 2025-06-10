import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import { getAllAccount } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GetUsage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accountListLoading, account_list, filter } = useSelector((state) => ({
    account_list: state?.insightMetrics?.accountList,
    accountListLoading: state?.insightMetrics?.accountListLoading,
    filter: state?.layout?.filter,
  }));
  const [dateRange, setDateRange] = useState([null, null]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    account: null,
  });

  const handleChange = (newValue) => {
    const [start, end] = newValue;

    if (start) {
      setFilters((prev) => ({
        ...prev,
        startDate: start.format("YYYY-MM-DD"),
      }));
    }
    if (end) {
      setFilters((prev) => ({
        ...prev,
        endDate: end.format("YYYY-MM-DD"),
      }));
    }
    setDateRange(newValue);
  };

  useEffect(() => {
    dispatch(getAllAccount());
  }, []);

  const checkFilters = () => {
    if (!filters?.account?.value || !filters?.startDate || !filters?.endDate) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="commom-header-title mb-0">Get Usages</div>
      <span className="common-breadcrum-msg">Welcome to you Team</span>
      <div className="get-usuage-filter">
        <CommonAutocomplete
          onChange={(event, newValue) => {
            setFilters((prev) => ({
              ...prev,
              account: newValue,
            }));
          }}
          options={account_list}
          label="Select a Account"
          loading={accountListLoading}
          value={filters?.account}
          getOptionLabel={(option) => `${option?.label} (${option?.csn})`}
        />
        <CommonDateRangePicker
          value={dateRange}
          onChange={handleChange}
          width="180px"
          placeholderStart="Start date"
          placeholderEnd="End date"
        />
        <CommonButton
          className={`get-usuage-btn
            ${
              checkFilters()
                ? "get-usuage-btn-disabled"
                : "get-usuage-btn-active"
            }`}
          onClick={() =>
            navigate(
              `/get_usage/usage/${filters?.account?.csn}/${filters?.startDate}/${filters?.endDate}`
            )
          }
          // isDisabled={checkFilters()}
        >
          Get Usuage
        </CommonButton>
      </div>
    </>
  );
};

export default GetUsage;
