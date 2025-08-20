import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PreviewIcon from "@mui/icons-material/Preview";
import routesConstants from "@/routes/routesConstants";
import { useFormik } from "formik";
import {
  addOrderLoadingHO,
  getAccountByBdPerson,
  getBdPersonByBranch,
} from "@/modules/orderLoadingApi/slice/OrderLoadingApiSlice";
import * as Yup from "yup";
import CommonModal from "@/components/common/modal/CommonModal";
import ProductDetailModal from "../component/ProductDetailModal";
import AddProductDetail from "../component/AddProductDetail";
import ConfirmationModal from "@/components/common/modal/ConfirmationModal";
import { toast } from "react-toastify";
import CustomSweetAlert from "@/components/common/customSweetAlert/CustomSweetAlert";

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
  const poCopyRef = useRef(null);
  const clientPartyPoCopyRef = useRef(null);
  const manualCIFRef = useRef(null);
  const productFormRef = useRef();
  const { state } = useLocation();

  const isThirdParty = useMemo(
    () => state?.user?.value === "ThirdParty",
    [state]
  );
  const [bdOptions, setBdOptions] = useState([]);
  const [accountOption, setAccountOption] = useState([]);

  const [modal, setModal] = useState({
    isOpen: false,
  });
  const [addProductDetailModal, setAddProductDetailModal] = useState({
    isShow: false,
  });
  const [showConfirm, setShowConfirm] = useState({
    isShow: false,
    type: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    allBranch,
    branchListLoading,
    bdPersonByBranchLoading,
    bdPersonByBranch,
    accountByBdPersonLoading,
    accountByBdPerson,
    thirdPartyAccountByBdPersonLoading,
    thirdPartyAccountByBdPerson,
  } = useSelector((state) => ({
    allBranch: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    bdPersonByBranchLoading: state?.orderLoadingApi?.bdPersonByBranchLoading,
    bdPersonByBranch: state?.orderLoadingApi?.bdPersonByBranch,
    accountByBdPersonLoading: state?.orderLoadingApi?.accountByBdPersonLoading,
    accountByBdPerson: state?.orderLoadingApi?.accountByBdPerson,
    thirdPartyAccountByBdPersonLoading:
      state?.orderLoadingApi?.thirdPartyAccountByBdPersonLoading,
    thirdPartyAccountByBdPerson:
      state?.orderLoadingApi?.thirdPartyAccountByBdPerson,
  }));

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  const validationSchema = Yup.object().shape({
    orderLoadingDate: Yup.string().required("Order Loading Date is required"),
    orderType: Yup.string().required("Order Type is required"),
    branch: Yup.string().required("Branch is required"),
    bdPerson: Yup.array()
      .of(Yup.mixed()) // or Yup.number(), Yup.string(), depending on type
      .min(1, "At least one value must be selected")
      .required("This field is required"),
    account: Yup.object().required("Account is required"),
    thirdPartyAccount: isThirdParty
      ? Yup.object().required("Third Party Account is required")
      : Yup.object().notRequired(),
    poNumber: Yup.string().required("PO Number is required"),
    poDate: Yup.string().required("PO Date is required"),
    poCopy: Yup.mixed().required("PO Copy is required"),
    clientPartyPoCopy: isThirdParty
      ? Yup.mixed().required("PO Copy is required")
      : Yup.mixed().notRequired(),
    billingAddress: Yup.string().required("Billing Address is required"),
    billingGSTNumber: Yup.string().required("Billing GST Number is required"),
    shippingAddress: Yup.string().required("Shipping Address is required"),
    shippingGSTNumber: Yup.string().required("Shipping GST Number is required"),
    licenseManagerName: Yup.string().required(
      "License Manager Name is required"
    ),
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
  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("user_type", state?.user?.value);
    formData.append("order_type", values?.orderType?.value);
    formData.append("order_loading_date", values?.orderLoadingDate);
    formData.append("branch", values?.branch?.value);
    formData.append(
      "bd_person",
      JSON.stringify(values?.bdPerson?.map((item) => item?.value))
    );
    formData.append("account", values?.account?.value);
    formData.append("po_number", values?.poNumber);
    formData.append("po_date", values?.poDate);
    formData.append("billing_address", values?.billingAddress);
    formData.append("billing_gst_number", values?.billingGSTNumber);
    formData.append("shipping_address", values?.shippingAddress);
    formData.append("shipping_gst_number", values?.shippingGSTNumber);
    formData.append(
      "license_contract_manager_name",
      values?.licenseManagerName
    );
    formData.append(
      "license_contract_manager_phone",
      values?.licenseManagerPhone
    );
    formData.append(
      "license_contract_manager_email_id",
      values?.licenseManagerEmail
    );
    formData.append(
      "proposed_license_activation_date",
      values?.licenseActivationDate?.value
    );
    formData.append("selling_payment_terms", values?.sellingPaymentTerms);
    formData.append("remarks", values?.remarks);
    formData.append("po_copy", values?.poCopy);
    formData.append("manual_cif_form", values?.manualCIFForm);
    formData.append(
      "product_details",
      JSON.stringify(
        values?.productDetails?.map((item, idx) => ({ ...item, id: idx }))
      )
    );
    if (isThirdParty) {
      // client_po_copy
      formData.append("client_po_copy", values?.clientPartyPoCopy);
      formData.append("thirdPartyAccount", values?.thirdPartyAccount?.value);
    }
    setIsSubmitting(true);

    dispatch(addOrderLoadingHO(formData)).then((res) => {
      resetForm();
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        toast.success("Order loading added successfully!");
        poCopyRef.current.value = "";
        if (isThirdParty) {
          clientPartyPoCopyRef.current.value = "";
        }
        manualCIFRef.current.value = "";
      }
      setIsSubmitting(false);
      navigate(
        routesConstants?.ORDER_LOADING_PO +
          routesConstants?.ORDER_LOADING_PO_LIST
      );
    });
  };

  const initialValues = {
    orderLoadingDate: null,
    orderType: null,
    branch: null,
    bdPerson: null,
    account: null,
    thirdPartyAccount: null,
    poNumber: "",
    poDate: null,
    poCopy: null,
    clientPartyPoCopy: null,
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

  const handleAddProductDetail = (data) => {
    let Arr = [...values?.productDetails, data];
    setFieldValue("productDetails", Arr);
    setAddProductDetailModal({
      isShow: false,
    });
  };

  const handleDeleteRow = (id) => {
    let filteredArr = values?.productDetails?.filter(
      (item, idx) => id !== idx + 1
    );
    setFieldValue("productDetails", filteredArr);
  };

  const handleYes = () => {
    if (showConfirm?.type === 2) {
      navigate(routesConstants?.ORDER_LOADING_PO);
    }
    setShowConfirm(false);
  };

  const handleCancel = () => {
    if (showConfirm?.type === 1) {
      setFieldValue("account", null);
    }
    setShowConfirm(false);
  };

  const handleBranchChange = (branchId, bdIds = values?.bdPerson) => {
    if (branchId) {
      dispatch(
        getBdPersonByBranch({
          value: branchId,
          orderType: values?.orderType,
        })
      ).then((res) => {
        let bdPersonArray = res.payload.data?.bd_person?.map((item) => ({
          label: item?.first_name + " " + item?.last_name,
          value: item?.id,
        }));
        setBdOptions(bdPersonArray);
        if (bdIds?.length > 0) {
          let drr = bdIds?.filter((i) =>
            bdPersonArray?.map((itm) => itm?.value)?.includes(i)
          );
          setFieldValue("bdPerson", drr);
        } else {
          setFieldValue("bdPerson", []);
        }
      });
    } else {
      setBdOptions([]);
      setFieldValue("bdPerson", []);
      setAccountOption([]);
      setFieldValue("account", "");
    }
  };

  const handeleBdChange = (bdIds) => {
    if (bdIds?.length > 0) {
      dispatch(
        getAccountByBdPerson({
          value: bdIds?.join(","),
          orderType: values?.orderType,
        })
      ).then((res) => {
        if (res?.payload?.data?.accounts?.length > 0) {
          debugger;
          let formattedOptions = res?.payload?.data?.accounts?.map((item) => ({
            value: item?.id,
            label: `${item?.name} (${item?.csn})`,
            bdIds: item?.bd_person_ids,
          }));
          setAccountOption(formattedOptions);
        } else {
          setAccountOption([]);
        }
      });
    } else {
      setFieldValue("account", "");
    }
  };
  console.log(values);
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
            setShowConfirm({ isShow: true, type: 2 });
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
              value={orderTypeOptions?.find(
                (item) => item?.value === values?.orderType
              )}
              onChange={(selectedOption) => {
                setFieldValue("orderType", selectedOption?.value);
              }}
              error={errors?.orderType && touched?.orderType}
              errorText={errors.orderType}
              required
            />
            <CustomSelect
              label="Branch"
              required
              name="branch"
              options={allBranch}
              value={allBranch?.filter(
                (item) => item?.value === values?.branch
              )}
              onChange={(selectedOption) => {
                if (values?.orderType) {
                  if (values?.bdPerson?.length > 0) {
                    CustomSweetAlert(
                      "Change Branch?",
                      "Changing the branch will update the BD Person(s) and Account based on the selected branch. Do you want to continue?",
                      "Warning",
                      true,
                      "Yes, Change Branch",
                      "Cancel",
                      (result) => {
                        if (result.isConfirmed) {
                          setFieldValue("branch", selectedOption?.value);
                          handleBranchChange(selectedOption?.value);
                        }
                      }
                    );
                  } else {
                    setFieldValue("branch", selectedOption?.value);
                    handleBranchChange(selectedOption?.value);
                  }
                } else {
                  toast.error(
                    "Please select Order Type first then select branch."
                  );
                }
              }}
              placeholder="Select a Branch"
              error={errors?.branch && touched?.branch}
              errorText={errors?.branch}
            />
            <CustomSelect
              label="BD Person"
              required
              name="bdPerson"
              placeholder="Select a BD Person"
              options={bdOptions}
              value={bdOptions?.filter((item) =>
                values?.bdPerson?.includes(item?.value)
              )}
              onChange={(selectedOption) => {
                if (values?.account) {
                } else {
                  let bdIds = selectedOption?.map((item) => item?.value);
                  setFieldValue("bdPerson", bdIds);
                  handeleBdChange(bdIds);
                }
                // let payload = selectedOption
                //   ?.map((item) => item?.value)
                //   .join(",");
                // dispatch(
                //   getAccountByBdPerson({
                //     value: payload,
                //     orderType: values?.orderType?.value,
                //   })
                // );
                // setFieldValue("bdPerson", selectedOption);
                // setFieldValue("account", "");
                // setFieldValue("thirdPartyAccount", "");
                // if (selectedOption?.length > 0) {
                //   setFieldTouched("bdPerson", false);
                // } else {
                //   setFieldTouched("bdPerson", true);
                // }
              }}
              isMulti
              error={errors?.bdPerson && touched?.bdPerson}
              errorText={errors?.bdPerson}
              // isDisabled={
              //   !values?.branch?.value ||
              //   branchListLoading ||
              //   bdPersonByBranchLoading
              // }
            />
            <CustomSelect
              label="Account"
              required
              name="account"
              placeholder="Select a Account"
              value={values?.account}
              onChange={(selectedOption) => {
                // setShowConfirm({ isShow: true, type: 1 });
                // setFieldValue("account", selectedOption);
                // if (selectedOption?.value) {
                //   setFieldTouched("account", false);
                // } else {
                //   setFieldTouched("account", true);
                // }
              }}
              options={accountByBdPerson}
              error={errors?.account && touched?.account}
              errorText={errors?.account}
              // isDisabled={
              //   !values?.branch?.value ||
              //   branchListLoading ||
              //   bdPersonByBranchLoading ||
              //   values?.bdPerson?.length === 0 ||
              //   accountByBdPersonLoading
              // }
            />
            {isThirdParty && (
              <>
                <CustomSelect
                  label="Third Party Account"
                  required
                  name="thirdPartyAccount"
                  placeholder="Select a Account"
                  value={values?.thirdPartyAccount}
                  onChange={(selectedOption) => {
                    // setFieldValue("thirdPartyAccount", selectedOption);
                    // if (selectedOption?.value) {
                    //   setFieldTouched("thirdPartyAccount", false);
                    // } else {
                    //   setFieldTouched("thirdPartyAccount", true);
                    // }
                  }}
                  options={thirdPartyAccountByBdPerson}
                  error={
                    errors?.thirdPartyAccount && touched?.thirdPartyAccount
                  }
                  errorText={errors?.thirdPartyAccount}
                  // isDisabled={
                  //   !values?.branch?.value ||
                  //   branchListLoading ||
                  //   bdPersonByBranchLoading ||
                  //   values?.bdPerson?.length === 0 ||
                  //   thirdPartyAccountByBdPersonLoading
                  // }
                />
                <div className="form-group">
                  <label className="form-label label requiredText">
                    Client Party PO Copy
                    <span className="text-danger"> *</span>
                  </label>
                  <input
                    ref={clientPartyPoCopyRef}
                    type="file"
                    className={`form-control ${
                      errors?.clientPartyPoCopy && touched?.clientPartyPoCopy
                        ? "is-invalid"
                        : ""
                    } input`}
                    name="clientPartyPoCopy"
                    id="clientPartyPoCopy"
                    onBlur={handleBlur}
                    onChange={(e) =>
                      setFieldValue("clientPartyPoCopy", e.target.files[0])
                    }
                  />
                  {errors?.clientPartyPoCopy && touched?.clientPartyPoCopy && (
                    <div className="invalid-feedback ">
                      {errors?.clientPartyPoCopy}
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label label requiredText">
                {isThirdParty && "Third Party"} PO Copy
                <span className="text-danger"> *</span>
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
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
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
        <ProductDetailModal
          data={values?.productDetails?.map((item, idx) => ({
            ...item,
            id: idx + 1,
          }))}
          handleDeleteRow={handleDeleteRow}
        />
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
          handleAddProductDetail={handleAddProductDetail}
        />
      </CommonModal>
      <ConfirmationModal
        open={showConfirm?.isShow}
        title={
          showConfirm?.type === 1
            ? "Confirm Account Selection"
            : "Confirm Navigation"
        }
        description={
          showConfirm?.type === 1
            ? "Do you confirm that Account CSN is selected correctly?"
            : "Are you sure you want to go back? Any unsaved changes will be lost."
        }
        onConfirm={handleYes}
        onCancel={handleCancel}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
};
export default AddEditOrderLoadingHO;
