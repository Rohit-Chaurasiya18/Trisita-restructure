import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import { getAllAccount } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { Autocomplete, TextField, Typography } from "@mui/material";
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
    account: [],
  });

  const handleChange = (newValue) => {
    const [start, end] = newValue;
    setFilters((prev) => ({
      ...prev,
      startDate: start?.format("YYYY-MM-DD") || null,
      endDate: end ? end.format("YYYY-MM-DD") : "",
    }));

    setDateRange(newValue);
  };

  useEffect(() => {
    dispatch(getAllAccount());
  }, []);

  const checkFilters = () => {
    if (
      !filters?.account?.length > 0 ||
      !filters?.startDate ||
      !filters?.endDate
    ) {
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
        <Autocomplete
          value={filters?.account}
          onChange={(event, newValues) => {
            setFilters((prev) => ({
              ...prev,
              account: newValues,
            }));
          }}
          options={
            account_list?.filter(
              (item) =>
                !filters?.account
                  ?.map((item) => item?.value)
                  ?.includes(item?.value)
            ) || []
          }
          multiple
          getOptionLabel={(option) => `${option?.label} (${option?.csn})`}
          sx={{
            width: 300,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select an Account"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {accountListLoading && (
                      <Typography variant="body2" color="textSecondary">
                        Loading...
                      </Typography>
                    )}
                  </>
                ),
              }}
            />
          )}
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
              `/get_usage/usage/${filters?.account?.map((item) => item?.csn)}/${
                filters?.startDate
              }/${filters?.endDate}`
            )
          }
          isDisabled={checkFilters()}
        >
          Get Usage
        </CommonButton>
      </div>
    </>
  );
};

export default GetUsage;
