import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PreviewIcon from "@mui/icons-material/Preview";
import routesConstants from "@/routes/routesConstants";
import { useFormik } from "formik";
import {
  getAccountByBdPerson,
  getBdPersonByBranch,
} from "@/modules/orderLoadingApi/slice/OrderLoadingApiSlice";
import * as Yup from "yup";
import CommonModal from "@/components/common/modal/CommonModal";
import ProductDetailModal from "../component/ProductDetailModal";
import AddProductDetail from "../component/AddProductDetail";

const orderTypeOptions = [
  { value: "New", label: "New" },
  { value: "Renewal", label: "Renewal" },
];
const licenseActivationOptions = [
  { value: "Immediate", label: "Immediate" },
  { value: "Particular Date", label: "Particular Date" },
];

const validationSchema = Yup.object().shape({
  orderLoadingDate: Yup.string().required("Order Loading Date is required"),
  orderType: Yup.object().required("Order Type is required"),
  branch: Yup.object().required("Branch is required"),
  bdPerson: Yup.array()
    .min(1, "At least one BD Person is required")
    .required("BD Person is required"),
  account: Yup.object().required("Account is required"),
  poNumber: Yup.string().required("PO Number is required"),
  poDate: Yup.string().required("PO Date is required"),
  poCopy: Yup.mixed().required("PO Copy is required"),
  billingAddress: Yup.string().required("Billing Address is required"),
  billingGSTNumber: Yup.string().required("Billing GST Number is required"),
  shippingAddress: Yup.string().required("Shipping Address is required"),
  shippingGSTNumber: Yup.string().required("Shipping GST Number is required"),
  licenseManagerName: Yup.string().required("License Manager Name is required"),
  licenseManagerPhone: Yup.string().required(
    "License Manager Phone is required"
  ),
  licenseManagerEmail: Yup.string()
    .email("Invalid email format")
    .required("License Manager Email is required"),
  licenseActivationDate: Yup.object().required(
    "License Activation Date is required"
  ),
  manualCIFForm: Yup.mixed().required("Manual CIF Form is required"),
  sellingPaymentTerms: Yup.string().required(
    "Selling Payment Terms is required"
  ),
  remarks: Yup.string().required("Remarks are required"),
});
const AddEditOrderLoadingHO = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const poCopyRef = useRef(null);
  const manualCIFRef = useRef(null);
  const productFormRef = useRef();

  const [modal, setModal] = useState({
    isOpen: false,
  });
  const [addProductDetailModal, setAddProductDetailModal] = useState({
    isShow: false,
  });

  const { state } = useLocation();
  const {
    allBranch,
    branchListLoading,
    bdPersonByBranchLoading,
    bdPersonByBranch,
    accountByBdPersonLoading,
    accountByBdPerson,
  } = useSelector((state) => ({
    allBranch: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    bdPersonByBranchLoading: state?.orderLoadingApi?.bdPersonByBranchLoading,
    bdPersonByBranch: state?.orderLoadingApi?.bdPersonByBranch,
    accountByBdPersonLoading: state?.orderLoadingApi?.accountByBdPersonLoading,
    accountByBdPerson: state?.orderLoadingApi?.accountByBdPerson,
  }));

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  const onSubmit = (values) => {
    console.log("Form Values: ", values);
  };

  const initialValues = {
    orderLoadingDate: null,
    orderType: null,
    branch: null,
    bdPerson: null,
    account: null,
    poNumber: "",
    poDate: null,
    poCopy: null,
    billingAddress: "",
    billingGSTNumber: "",
    shippingAddress: "",
    shippingGSTNumber: "",
    licenseManagerName: "",
    licenseManagerPhone: "",
    licenseManagerEmail: "",
    licenseActivationDate: null,
    manualCIFForm: null,
    sellingPaymentTerms: "",
    remarks: "",
    productDetails: [],
  };

  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });
  return (
    <div className="">
      <div className="">
        <div>
          <div className="commom-header-title mb-0">Order Loading PO</div>
          <span className="common-breadcrum-msg">we are in the same team</span>
        </div>
        <CommonButton
          className="back-btn"
          onClick={() => {
            navigate(routesConstants?.ORDER_LOADING_PO);
          }}
        >
          Back
        </CommonButton>
      </div>
      <div className="add-edit-orderLoadingForm">
        <div className="add-account-form">
          <h2 className="title">
            Order Loading PO
            {state?.user?.value === " EndUser"
              ? " End User"
              : " Third Party"}{" "}
            Form
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
              value={values?.orderLoadingDate}
              onChange={(date) => setFieldValue("orderLoadingDate", date)}
              error={touched?.orderLoadingDate && !!errors?.orderLoadingDate}
              errorText={errors?.orderLoadingDate}
            />
            <CustomSelect
              label="Order Type"
              name="orderType"
              placeholder="Select a Order Type"
              options={orderTypeOptions}
              value={values?.orderType}
              onChange={(selectedOption) => {
                setFieldValue("orderType", selectedOption);
                setFieldValue("branch", "");
                setFieldValue("bdPerson", "");
                setFieldValue("account", "");
                if (selectedOption?.value) {
                  setFieldTouched("orderType", false);
                } else {
                  setFieldTouched("orderType", true);
                }
              }}
              error={errors?.orderType && touched?.orderType}
              errorText={errors.orderType}
              required
            />
            <CustomSelect
              label="Branch"
              required
              name="branch"
              value={values?.branch}
              onChange={(selectedOption) => {
                setFieldValue("branch", selectedOption);
                if (selectedOption?.value) {
                  setFieldTouched("branch", false);
                } else {
                  setFieldTouched("branch", true);
                }
                setFieldValue("bdPerson", "");
                setFieldValue("account", "");
                dispatch(getBdPersonByBranch(selectedOption?.value));
              }}
              options={allBranch}
              placeholder="Select a Branch"
              error={errors?.branch && touched?.branch}
              errorText={errors?.branch}
              isDisabled={!values?.orderType?.value || branchListLoading}
            />
            <CustomSelect
              label="BD Person"
              required
              name="bdPerson"
              placeholder="Select a BD Person"
              value={values?.bdPerson}
              onChange={(selectedOption) => {
                let payload = selectedOption
                  ?.map((item) => item?.value)
                  .join(",");
                dispatch(getAccountByBdPerson(payload));
                setFieldValue("bdPerson", selectedOption);
                setFieldValue("account", "");
                if (selectedOption?.length > 0) {
                  setFieldTouched("bdPerson", false);
                } else {
                  setFieldTouched("bdPerson", true);
                }
              }}
              isMulti
              options={bdPersonByBranch}
              error={errors?.bdPerson && touched?.bdPerson}
              errorText={errors?.bdPerson}
              isDisabled={
                !values?.branch?.value ||
                branchListLoading ||
                bdPersonByBranchLoading
              }
            />
            <CustomSelect
              label="Account"
              required
              name="account"
              placeholder="Select a Account"
              value={values?.account}
              onChange={(selectedOption) => {
                setFieldValue("account", selectedOption);
                if (selectedOption?.value) {
                  setFieldTouched("account", false);
                } else {
                  setFieldTouched("account", true);
                }
              }}
              options={accountByBdPerson}
              error={errors?.account && touched?.account}
              errorText={errors?.account}
              isDisabled={
                !values?.branch?.value ||
                branchListLoading ||
                bdPersonByBranchLoading ||
                values?.bdPerson?.length === 0 ||
                accountByBdPersonLoading
              }
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
              value={values?.poNumber}
              isInvalid={errors?.poNumber && touched?.poNumber}
              errorText={errors?.poNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CommonDatePicker
              label="PO Date"
              name="poDate"
              required
              value={values?.poDate}
              onChange={(date) => setFieldValue("poDate", date)}
              error={touched?.poDate && !!errors?.poDate}
              errorText={errors?.poDate}
            />
            <div className="form-group">
              <label className="form-label label requiredText">
                PO Copy<span className="text-danger"> *</span>
              </label>
              <input
                ref={poCopyRef}
                type="file"
                className={`form-control ${
                  errors?.poCopy && touched?.poCopy ? "is-invalid" : ""
                } input`}
                name="poCopy"
                id="poCopy"
                onBlur={handleBlur}
                onChange={(e) => setFieldValue("poCopy", e.target.files[0])}
              />
              {errors?.poCopy && touched?.poCopy && (
                <div className="invalid-feedback ">{errors?.poCopy}</div>
              )}
            </div>
            <CommonInputTextField
              labelName="Billing Address"
              id="billingAddress"
              name="billingAddress"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Billing Address"
              required
              value={values?.billingAddress}
              isInvalid={errors?.billingAddress && touched?.billingAddress}
              errorText={errors?.billingAddress}
              onChange={handleChange}
              onBlur={handleBlur}
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
              value={values?.billingGSTNumber}
              isInvalid={errors?.billingGSTNumber && touched?.billingGSTNumber}
              errorText={errors?.billingGSTNumber}
              onChange={handleChange}
              onBlur={handleBlur}
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
              value={values?.shippingAddress}
              isInvalid={errors?.shippingAddress && touched?.shippingAddress}
              errorText={errors?.shippingAddress}
              onChange={handleChange}
              onBlur={handleBlur}
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
              value={values?.shippingGSTNumber}
              isInvalid={
                errors?.shippingGSTNumber && touched?.shippingGSTNumber
              }
              errorText={errors?.shippingGSTNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <div className="form-group">
              <label className="form-label label requiredText">
                Product Details<span className="text-danger"> *</span>
              </label>
              <div style={{ cursor: "pointer" }}>
                <AddIcon
                  onClick={() => {
                    setModal({
                      isOpen: true,
                    });
                  }}
                />
                <PreviewIcon
                  onClick={() => {
                    setModal({
                      isOpen: true,
                    });
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
              value={values?.licenseManagerName}
              isInvalid={
                errors?.licenseManagerName && touched?.licenseManagerName
              }
              errorText={errors?.licenseManagerName}
              onChange={handleChange}
              onBlur={handleBlur}
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
              value={values?.licenseManagerPhone}
              isInvalid={
                errors?.licenseManagerPhone && touched?.licenseManagerPhone
              }
              errorText={errors?.licenseManagerPhone}
              onChange={handleChange}
              onBlur={handleBlur}
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
              value={values?.licenseManagerEmail}
              isInvalid={
                errors?.licenseManagerEmail && touched?.licenseManagerEmail
              }
              errorText={errors?.licenseManagerEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CustomSelect
              label="Proposed License Activation Date"
              name="licenseActivationDate"
              placeholder="Select a Proposed License Activation Date"
              options={licenseActivationOptions}
              required
              value={values?.licenseActivationDate}
              onChange={(selectedOption) =>
                setFieldValue("licenseActivationDate", selectedOption)
              }
              error={
                errors?.licenseActivationDate && touched?.licenseActivationDate
              }
              errorText={errors.licenseActivationDate}
            />
            <div className="form-group">
              <label className="form-label label requiredText">
                Manual CIF Form<span className="text-danger"> *</span>
              </label>
              <input
                ref={manualCIFRef}
                type="file"
                className={`form-control ${
                  errors?.manualCIFForm && touched?.manualCIFForm
                    ? "is-invalid"
                    : ""
                } input`}
                name="manualCIFForm"
                id="manualCIFForm"
                onBlur={handleBlur}
                onChange={(e) =>
                  setFieldValue("manualCIFForm", e.target.files[0])
                }
              />
              {errors?.manualCIFForm && touched?.manualCIFForm && (
                <div className="invalid-feedback ">{errors?.manualCIFForm}</div>
              )}
            </div>
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
              value={values?.sellingPaymentTerms}
              isInvalid={
                errors?.sellingPaymentTerms && touched?.sellingPaymentTerms
              }
              errorText={errors?.sellingPaymentTerms}
              onChange={handleChange}
              onBlur={handleBlur}
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
              value={values?.remarks}
              isInvalid={errors?.remarks && touched?.remarks}
              errorText={errors?.remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CommonButton
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="add-account-btn"
              // isDisabled={isSubmitting}
            >
              Submit
            </CommonButton>
          </form>
        </div>
      </div>
      <CommonModal
        isOpen={modal?.isOpen}
        title={"Product Details"}
        handleClose={() => {
          setModal({
            isOpen: false,
          });
        }}
        size={"xl"}
        scrollable
        isAdd
        handleAdd={() => {
          setAddProductDetailModal({
            isShow: true,
          });
        }}
      >
        <ProductDetailModal data={values?.productDetails} />
      </CommonModal>
      <CommonModal
        isOpen={addProductDetailModal?.isShow}
        title={"Add Product Details"}
        handleClose={() => {
          setAddProductDetailModal({
            isShow: false,
          });
        }}
        scrollable
        isAdd
        handleAdd={() => {
          if (productFormRef.current) {
            productFormRef.current.submitForm(); // this triggers formik submit in AddProductDetail
          }
        }}
      >
        <AddProductDetail
          ref={productFormRef}
          data={{ billingGSTNumber: values?.billingGSTNumber }}
        />
      </CommonModal>
    </div>
  );
};
export default AddEditOrderLoadingHO;
