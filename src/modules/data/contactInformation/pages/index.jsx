import { Autocomplete, TextField, Typography } from "@mui/material";
import {
  getAllAccount,
  getAllBranch,
} from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContactInformation } from "../slice/ContactInfoSlice";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import { getAllAccountByBranchId } from "@/modules/licenseOptimization/slice/LicenseOptimizationSlice";

const ContactInformation = () => {
  const dispatch = useDispatch();
  const {
    ContactInformationLoading,
    ContactInformationList,
    branch_list,
    branchListLoading,
  } = useSelector((state) => ({
    ContactInformationLoading:
      state?.ContactInformation?.ContactInformationLoading,
    ContactInformationList: state?.ContactInformation?.ContactInformationList,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
  }));

  const [selectedValue, setSelectedValue] = useState(null);
  const [accountListBranch, setAccountListBranch] = useState([]);
  const { account, contract_manager } = ContactInformationList;

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  const handleChange = (newValues) => {
    setSelectedValue(newValues);
    if (newValues?.value) {
      dispatch(getContactInformation(newValues?.value));
    }
  };
  return (
    <>
      <div className="alert-subscription">
        <div className="commom-header-title">Contact Information</div>
      </div>
      <div className="mt-5">
        <div className="d-flex mb-2 gap-3">
          <CommonAutocomplete
            onChange={(event, newValue) => {
              if (newValue?.value) {
                dispatch(getAllAccountByBranchId(newValue?.value)).then(
                  (res) => {
                    let data =
                      res?.payload?.data?.map((item) => ({
                        label: item?.name,
                        csn: item?.csn,
                        value: item?.id,
                      })) || [];
                    setAccountListBranch(data);
                  }
                );
              } else {
                setSelectedValue(null);
                setAccountListBranch([]);
              }
            }}
            options={branch_list}
            label="Select a Branch"
            loading={branchListLoading}
          />
          <Autocomplete
            value={selectedValue}
            onChange={(event, newValues) => {
              handleChange(newValues);
            }}
            options={accountListBranch || []}
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
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          // sx={{ ml: 1 }}
                        >
                          Loading...
                        </Typography>
                      )}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>
        <label>Please select an account to show contact info.</label>
      </div>
      {selectedValue?.value && !ContactInformationLoading && (
        <>
          <div className="contact-information-container">
            <div className="bd-person-info">
              <label>BD Person Contact</label>
              {account?.user_assign?.length > 0 ? (
                account?.user_assign?.map((item) => (
                  <div className="mb-4">
                    <div className="col-12">
                      <div className="col-2">Name</div>
                      <div className="col-10">{item?.first_name || "N/A"}</div>
                    </div>
                    <div className="col-12">
                      <div className="col-2">Email</div>
                      <div className="col-10">{item?.email || "N/A"}</div>
                    </div>
                    <div className="col-12">
                      <div className="col-2">Phone</div>
                      <div className="col-10">{item?.phone || "N/A"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p>No data found!</p>
                </div>
              )}
            </div>

            <div className="contact-manager-info">
              <label>Contract Manager</label>
              {account?.contract_manager?.length > 0 ? (
                account?.contract_manager?.map((item) => (
                  <div className="mb-4">
                    <div className="col-12">
                      <div className="col-2">Name</div>
                      <div className="col-10">{item?.first_name || "N/A"}</div>
                    </div>
                    <div className="col-12">
                      <div className="col-2">Email</div>
                      <div className="col-10">{item?.email || "N/A"}</div>
                    </div>
                    <div className="col-12">
                      <div className="col-2">Phone</div>
                      <div className="col-10">{item?.phone || "N/A"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p>No data found!</p>
                </div>
              )}
            </div>
          </div>

          <div className="contact-information-container">
            <div className="bd-person-info">
              <label>Renewal Person Contact</label>
              {account?.renewal_person?.length > 0 ? (
                account?.renewal_person?.map((item) => (
                  <div className="mb-4">
                    <div className="col-12">
                      <div className="col-2">Name</div>
                      <div className="col-10">
                        {item?.first_name || "N/A"}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="col-2">Email</div>
                      <div className="col-10">{item?.email || "N/A"}</div>
                    </div>
                    <div className="col-12">
                      <div className="col-2">Phone</div>
                      <div className="col-10">{item?.phone || "N/A"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p>No data found!</p>
                </div>
              )}
            </div>

            <div className="contact-manager-info">
              <label>OEM Manager</label>
              {account?.oem_manager?.length > 0 ? (
                account?.oem_manager?.map((item) => (
                  <div className="mb-4">
                    <div className="col-12">
                      <div className="col-2">Name</div>
                      <div className="col-10">
                        {item?.first_name || "N/A"}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="col-2">Email</div>
                      <div className="col-10">{item?.email || "N/A"}</div>
                    </div>
                    <div className="col-12">
                      <div className="col-2">Phone</div>
                      <div className="col-10">{item?.phone || "N/A"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p>No data found!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ContactInformation;
