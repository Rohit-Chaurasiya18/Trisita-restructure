import { Autocomplete, TextField, Typography } from "@mui/material";
import { getAllAccount } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContactInformation } from "../slice/ContactInfoSlice";

const ContactInformation = () => {
  const dispatch = useDispatch();
  const {
    accountList,
    accountListLoading,
    ContactInformationLoading,
    ContactInformationList,
  } = useSelector((state) => ({
    accountList: state?.insightMetrics?.accountList,
    accountListLoading: state?.insightMetrics?.accountListLoading,
    ContactInformationLoading:
      state?.ContactInformation?.ContactInformationLoading,
    ContactInformationList: state?.ContactInformation?.ContactInformationList,
  }));

  const [selectedValue, setSelectedValue] = useState(null);
  const { account, contract_manager } = ContactInformationList;
  useEffect(() => {
    dispatch(getAllAccount());
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
        <Autocomplete
          value={selectedValue}
          onChange={(event, newValues) => {
            handleChange(newValues);
          }}
          options={accountList || []}
          getOptionLabel={(option) => `${option?.label} (${option?.csn})`}
          loading={accountListLoading}
          disabled={accountListLoading || !accountList?.length}
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
        <label>Please select an account to show contact info.</label>
      </div>
      {selectedValue?.value && (
        <div className="contact-information-container">
          <div className="bd-person-info">
            <label>BD Person Contact</label>
          </div>
          <div className="contact-manager-info">
            <label>Contract Manager</label>
            <div>
              <div className="col-12">
                <div className="col-2">Name</div>
                <div className="col-10">
                  {contract_manager?.endCustomer_contractManager?.first +
                    contract_manager?.endCustomer_contractManager?.last ||
                    "N/A"}
                </div>
              </div>
              <div className="col-12">
                <div className="col-2">Email</div>
                <div className="col-10">
                  {contract_manager?.endCustomer_contractManager?.email ||
                    "N/A"}
                </div>
              </div>
              <div className="col-12">
                <div className="col-2">Phone</div>
                <div className="col-10">
                  {contract_manager?.endCustomer_contractManager?.phone ||
                    "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactInformation;
