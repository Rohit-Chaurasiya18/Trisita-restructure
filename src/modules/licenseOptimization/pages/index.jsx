import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import {
  getAllAccount,
  getAllBranch,
} from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getLicenseOptimisation,
  getLicenseOptimizationData,
} from "../slice/LicenseOptimizationSlice";
import { Autocomplete, TextField, Typography } from "@mui/material";
import routesConstants from "@/routes/routesConstants";

const LicenseOptization = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filter, branch_list, branchListLoading } = useSelector((state) => ({
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    filter: state?.layout?.filter,
  }));
  const [dateRange, setDateRange] = useState([null, null]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [productLineCodeOptions, setProductLineCodeOptions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    account: [],
    branch: null,
    productLineCode: [],
  });
  const [isSubmit, setIsSubmit] = useState(false);

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
    dispatch(getAllBranch());
  }, []);

  useEffect(() => {
    if (filters?.branch?.value) {
      let payload = {
        branch: filters?.branch?.value || "",
        account: filters?.account?.map((account) => account?.value) || "",
      };
      dispatch(getLicenseOptimizationData(payload)).then((res) => {
        if (res?.payload?.data?.accounts?.length > 0) {
          let seen = new Set();
          let data = res?.payload?.data?.accounts?.reduce((acc, item) => {
            const labelKey = `${item?.name} (${item?.csn})`;
            if (!seen.has(labelKey)) {
              acc.push({
                label: item?.name,
                value: item?.id,
                csn: item?.csn,
              });
              seen.add(labelKey);
            }
            return acc;
          }, []);
          setAccountOptions(data);
        } else {
          setAccountOptions([]);
        }

        if (res?.payload?.data?.productLineCodes?.length > 0) {
          let data = res?.payload?.data?.productLineCodes?.map((item, idx) => ({
            label: item,
            value: item,
          }));
          setProductLineCodeOptions(data);
        } else {
          setProductLineCodeOptions([]);
        }
        setTotalCount(res?.payload?.data?.totalCount);
      });
    } else {
      setAccountOptions([]);
      setProductLineCodeOptions([]);
    }
  }, [filters]);

  const checkFilters = () => {
    if (
      filters?.account?.length > 0 &&
      filters?.branch?.value &&
      filters?.productLineCode?.length > 0 &&
      filters?.startDate &&
      filters?.endDate
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleLicenseOptimisation = () => {
    if (
      filters?.account?.length > 0 &&
      filters?.branch?.value &&
      filters?.productLineCode?.length > 0 &&
      filters?.startDate &&
      filters?.endDate
    ) {
      setIsSubmit(true);
      let payload = {
        branch_id: filters?.branch?.value,
        account_ids: filters?.account?.map((item) => item?.value),
        productLineCodes: filters?.productLineCode?.map((item) => item?.value),
        start_date: filters?.startDate,
        end_date: filters?.endDate,
      };
      dispatch(getLicenseOptimisation(payload)).then((res) => {
        if (res?.payload?.status === 200) {
          navigate(
            routesConstants?.LICENSE_OPTIMIZATION +
              routesConstants?.VIEW_LICENSE_OPTIMIZATION +
              `/${filters?.account?.map((item) => item?.value)}` +
              `/${filters?.branch?.value}` +
              `/${filters?.productLineCode?.map((item) => item?.value)}` +
              `/${filters?.startDate}` +
              `/${filters?.endDate}`
          );
        }

        setIsSubmit(false);
      });
    }
  };
  return (
    <>
      <div className="commom-header-title mb-0">License Optization</div>
      <span className="common-breadcrum-msg">Welcome to you Team</span>
      <div className="get-usuage-filter license-optimise">
        <CommonAutocomplete
          onChange={(event, newValue) => {
            setFilters((prev) => ({
              ...prev,
              branch: newValue,
              account: [],
              productLineCode: [],
            }));
          }}
          options={branch_list}
          label="Select a Branch"
          loading={branchListLoading}
          value={filters?.branch}
        />
        <Autocomplete
          value={filters?.account}
          onChange={(event, newValues) => {
            setFilters((prev) => ({
              ...prev,
              account: newValues,
              productLineCode: [],
            }));
          }}
          options={
            accountOptions?.filter(
              (item) =>
                !filters?.account
                  ?.map((item) => item?.label)
                  ?.includes(item?.label)
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
                    {false && (
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

        {totalCount > 0 && (
          <TextField
            disabled
            id="outlined-disabled"
            label="Total Count"
            defaultValue={totalCount}
            sx={{
              width: "100px",
              marginTop: "9px",
            }}
          />
        )}
        <Autocomplete
          value={filters?.productLineCode}
          onChange={(event, newValues) => {
            setFilters((prev) => ({ ...prev, productLineCode: newValues }));
          }}
          options={
            productLineCodeOptions?.filter(
              (item) =>
                !filters?.productLineCode
                  ?.map((item) => item?.label)
                  ?.includes(item?.label)
            ) || []
          }
          multiple
          getOptionLabel={(option) => `${option?.label}`}
          sx={{
            width: 300,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select an Product Line"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {false && (
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
            checkFilters() ? "get-usuage-btn-disabled" : "get-usuage-btn-active"
          }`}
          onClick={() => {
            handleLicenseOptimisation();
          }}
          isDisabled={checkFilters() || isSubmit}
        >
          License Optization
        </CommonButton>
      </div>
    </>
  );
};

export default LicenseOptization;
