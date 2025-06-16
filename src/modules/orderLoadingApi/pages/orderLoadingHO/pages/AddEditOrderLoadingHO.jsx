import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PreviewIcon from "@mui/icons-material/Preview";

const orderTypeOptions = [
  { value: "New", label: "New" },
  { value: "Renewal", label: "Renewal" },
];
const licenseActivationOptions = [
  { value: "Immediate", label: "Immediate" },
  { value: "Particular Date", label: "Particular Date" },
];

const AddEditOrderLoadingHO = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { allBranch, branchListLoading } = useSelector((state) => ({
    allBranch: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
  }));

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  return (
    <div className="">
      <div className="">
        <div>
          <div className="commom-header-title mb-0">Order Loading PO</div>
          <span className="common-breadcrum-msg">we are in the same team</span>
        </div>
        <CommonButton className="back-btn" onClick={() => {}}>
          Back
        </CommonButton>
      </div>
      <div className="add-edit-orderLoadingForm">
        <div className="add-account-form">
          <h2 className="title">
            Order Loading PO{" "}
            {state?.user?.value === "EndUser" ? "End User" : "Third Party"} Form
          </h2>
          <form className="">
            <CommonInputTextField
              labelName="User Type"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              value={state?.user?.value}
              isDisabled
            />
            <CommonDatePicker
              label="Order Loading Date"
              name="orderLoadingDate"
              required
              // value={values?.orderLoadingDate}
              // onChange={(date) => setFieldValue("orderLoadingDate", date)}
              // error={touched?.orderLoadingDate && !!errors?.orderLoadingDate}
              // errorText={errors?.orderLoadingDate}
            />
            <CustomSelect
              label="Order Type"
              name="orderType"
              placeholder="Select a Order Type"
              options={orderTypeOptions}
              // value={values?.orderType}
              required
              // onChange={(selectedOption) =>
              //   setFieldValue("orderType", selectedOption)
              // }
              // error={errors?.orderType && touched?.orderType}
              // errorText={errors.orderType}
            />
            <CustomSelect
              label="Branch"
              required
              name="branch"
              // value={values?.branch}
              // onChange={(selectedOption) => {
              //   handleSelectChange("branch", selectedOption);
              //   if (selectedOption?.value) {
              //     handleBdRenewalPerson(selectedOption?.value);
              //   }
              // }}
              options={allBranch}
              placeholder="Select a Branch"
              // error={errors?.branch && touched?.branch}
              // errorText={errors?.branch}
            />
            <CustomSelect
              label="BD Person"
              required
              name="bdPerson"
              // value={values?.bdPerson}
              // onChange={(selectedOption) =>
              //   handleSelectChange("bdPerson", selectedOption)
              // }
              // isMulti
              // options={bdPersonList}
              placeholder="Select a BD Person"
              // error={errors?.bdPerson && touched?.bdPerson}
              // errorText={errors?.bdPerson}
            />
            <CustomSelect
              label="Account"
              required
              name="account"
              // value={values?.account}
              // onChange={(selectedOption) => {
              //   handleSelectChange("account", selectedOption);
              //   if (selectedOption?.value) {
              //     handleBdRenewalPerson(selectedOption?.value);
              //   }
              // }}
              // options={allBranch}
              placeholder="Select a Account"
              // error={errors?.account && touched?.account}
              // errorText={errors?.account}
            />
            <CommonInputTextField
              labelName="PO Number"
              id="poNumber"
              name="poNumber"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter PO Number"
              required
              // value={values?.poNumber}
              // isInvalid={errors?.poNumber && touched?.poNumber}
              // errorText={errors?.poNumber}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CommonDatePicker
              label="PO Date"
              name="poDate"
              required
              // value={values?.poDate}
              // onChange={(date) => setFieldValue("poDate", date)}
              // error={touched?.poDate && !!errors?.poDate}
              // errorText={errors?.poDate}
            />
            <CommonInputTextField
              labelName="PO Copy"
              id="poCopy"
              name="poCopy"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              type="file"
              required
              // value={values?.poCopy}
              // isInvalid={errors?.poCopy && touched?.poCopy}
              // errorText={errors?.poCopy}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CustomSelect
              label="Third Party Account"
              required
              name="thirdPartyAccount"
              // value={values?.thirdPartyAccount}
              // onChange={(selectedOption) => {
              //   handleSelectChange("thirdPartyAccount", selectedOption);
              //   if (selectedOption?.value) {
              //     handleBdRenewalPerson(selectedOption?.value);
              //   }
              // }}
              // options={allBranch}
              placeholder="Select a Third Party Account"
              // error={errors?.thirdPartyAccount && touched?.thirdPartyAccount}
              // errorText={errors?.thirdPartyAccount}
            />
            <CommonInputTextField
              labelName="Billing Address"
              id="billingAddress"
              name="billingAddress"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Billing Address"
              required
              // value={values?.billingAddress}
              // isInvalid={errors?.billingAddress && touched?.billingAddress}
              // errorText={errors?.billingAddress}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="Billing GST Number"
              id="billingGSTNumber"
              name="billingGSTNumber"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Billing GST Number"
              required
              // value={values?.billingGSTNumber}
              // isInvalid={errors?.billingGSTNumber && touched?.billingGSTNumber}
              // errorText={errors?.billingGSTNumber}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="Shipping Address"
              id="shippingAddress"
              name="shippingAddress"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Shipping Address"
              required
              // value={values?.shippingAddress}
              // isInvalid={errors?.shippingAddress && touched?.shippingAddress}
              // errorText={errors?.shippingAddress}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="Shipping GST Number"
              id="shippingGSTNumber"
              name="shippingGSTNumber"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Billing GST Number"
              required
              // value={values?.shippingGSTNumber}
              // isInvalid={errors?.shippingGSTNumber && touched?.shippingGSTNumber}
              // errorText={errors?.shippingGSTNumber}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <div className="form-group">
              <label className="form-label label requiredText">
                Product Details<span className="text-danger"> *</span>
              </label>
              <div style={{ cursor: "pointer" }}>
                <AddIcon
                  onClick={() => {
                    debugger;
                  }}
                />
                <PreviewIcon
                  onClick={() => {
                    debugger;
                  }}
                />
              </div>
            </div>
            <CommonInputTextField
              labelName="License Contract Manager Name"
              id="licenseManagerName"
              name="licenseManagerName"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter License Contract Manager Name"
              required
              // value={values?.licenseManagerName}
              // isInvalid={errors?.licenseManagerName && touched?.licenseManagerName}
              // errorText={errors?.licenseManagerName}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="License Contract Manager Phone"
              id="licenseManagerPhone"
              name="licenseManagerPhone"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter License Contract Manager Phone"
              required
              // value={values?.licenseManagerPhone}
              // isInvalid={errors?.licenseManagerPhone && touched?.licenseManagerPhone}
              // errorText={errors?.licenseManagerPhone}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="License Contract Manager Email ID"
              id="licenseManagerEmail"
              name="licenseManagerEmail"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter License Contract Manager Email ID"
              required
              // value={values?.licenseManagerEmail}
              // isInvalid={errors?.licenseManagerEmail && touched?.licenseManagerEmail}
              // errorText={errors?.licenseManagerEmail}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CustomSelect
              label="Proposed License Activation Date"
              name="licenseActivationDate"
              placeholder="Select a Proposed License Activation Date"
              options={licenseActivationOptions}
              // value={values?.licenseActivationDate}
              required
              // onChange={(selectedOption) =>
              //   setFieldValue("licenseActivationDate", selectedOption)
              // }
              // error={errors?.licenseActivationDate && touched?.licenseActivationDate}
              // errorText={errors.licenseActivationDate}
            />
            <CommonInputTextField
              labelName="Manual CIF Form"
              id="manualCIFForm"
              name="manualCIFForm"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              type="file"
              placeHolder="Enter Manual CIF Form"
              required
              // value={values?.manualCIFForm}
              // isInvalid={errors?.manualCIFForm && touched?.manualCIFForm}
              // errorText={errors?.manualCIFForm}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="Selling Payment Terms"
              id="sellingPaymentTerms"
              name="sellingPaymentTerms"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              type="number"
              placeHolder="Enter Selling Payment Terms"
              required
              // value={values?.sellingPaymentTerms}
              // isInvalid={errors?.sellingPaymentTerms && touched?.sellingPaymentTerms}
              // errorText={errors?.sellingPaymentTerms}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="Remarks"
              id="remarks"
              name="remarks"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Remarks"
              required
              // value={values?.remarks}
              // isInvalid={errors?.remarks && touched?.remarks}
              // errorText={errors?.remarks}
              // onChange={handleChange}
              // onBlur={handleBlur}
              requiredText
            />
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddEditOrderLoadingHO;
