import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { getOrderLoadingPo } from "@/modules/dashboard/slice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { ACCEPTED_FILE_TYPES } from "@/constant";

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
  const licenseCertificateRef = useRef(null);
  const salesInvoiceRef = useRef(null);
  const productFormRef = useRef();
  const { state } = useLocation();
  const {
    allBranch,
    branchListLoading,
    bdPersonByBranchLoading,
    bdPersonByBranch,
    accountByBdPersonLoading,
    accountByBdPerson,
    thirdPartyAccountByBdPersonLoading,
    thirdPartyAccountByBdPerson,
    orderLoadingHoDetailLoading,
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
    orderLoadingHoDetailLoading: state?.dashboard?.orderLoadingHoDetailLoading,
  }));
  const [orderLoadingHoDetail, setOrderLoadingHoDetail] = useState();

  const [base64Files, setBase64Files] = useState({
    poCopy: null,
    manualCIFForm: null,
    clientPartyPoCopy: null,
    licenseCertificate: null,
    salesInvoice: null,
  });

  // Update Order Loading HO
  const { orderLoadingHoId } = useParams();

  const isThirdParty = useMemo(
    () =>
      state?.user?.value === "ThirdParty" ||
      orderLoadingHoDetail?.user_type === "ThirdParty",
    [state, orderLoadingHoDetail?.user_type]
  );

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
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  const validationSchema = Yup.object().shape({
    orderLoadingDate: Yup.string().required("Order Loading Date is required"),
    orderType: Yup.object().required("Order Type is required"),
    branch: Yup.object().required("Branch is required"),
    bdPerson: Yup.array()
      .min(1, "At least one BD Person is required")
      .required("BD Person is required"),
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
    formData.append("user_type", values?.userType);
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
        values?.productDetails?.map((item, idx) => ({ ...item, id: "" }))
      )
    );
    if (isThirdParty) {
      formData.append("client_po_copy", values?.clientPartyPoCopy);
      formData.append("third_party_account", values?.thirdPartyAccount?.value);
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

  let initialValues = {
    userType:
      orderLoadingHoId && orderLoadingHoDetail?.user_type
        ? orderLoadingHoDetail?.user_type
        : state?.user?.value,
    orderLoadingDate:
      orderLoadingHoId && orderLoadingHoDetail?.order_loading_date
        ? orderLoadingHoDetail?.order_loading_date
        : null,
    orderType:
      orderLoadingHoId && orderLoadingHoDetail?.order_type
        ? orderTypeOptions?.find(
            (item) => item?.value === orderLoadingHoDetail?.order_type
          )
        : null,
    branch:
      orderLoadingHoId && orderLoadingHoDetail?.branch
        ? allBranch?.find(
            (item) => item?.value === orderLoadingHoDetail?.branch
          )
        : null,
    bdPerson:
      bdPersonByBranch?.filter((item) =>
        orderLoadingHoDetail?.bd_person
          ?.map((item) => item?.id)
          ?.includes(item?.value)
      ) || [],
    account:
      orderLoadingHoId && orderLoadingHoDetail?.account
        ? accountByBdPerson?.filter(
            (item) => item?.value === orderLoadingHoDetail?.account
          )
        : null,
    thirdPartyAccount:
      orderLoadingHoId && orderLoadingHoDetail?.third_party_account
        ? thirdPartyAccountByBdPerson?.filter(
            (item) => item?.value === orderLoadingHoDetail?.third_party_account
          )
        : null,
    poNumber:
      orderLoadingHoId && orderLoadingHoDetail?.po_number
        ? orderLoadingHoDetail?.po_number
        : "",
    poDate:
      orderLoadingHoId && orderLoadingHoDetail?.po_date
        ? orderLoadingHoDetail?.po_date
        : null,
    poCopy: null,
    clientPartyPoCopy: null,
    billingAddress:
      orderLoadingHoId && orderLoadingHoDetail?.billing_address
        ? orderLoadingHoDetail?.billing_address
        : "",
    billingGSTNumber:
      orderLoadingHoId && orderLoadingHoDetail?.billing_gst_number
        ? orderLoadingHoDetail?.billing_gst_number
        : "",
    shippingAddress:
      orderLoadingHoId && orderLoadingHoDetail?.shipping_address
        ? orderLoadingHoDetail?.shipping_address
        : "",
    shippingGSTNumber:
      orderLoadingHoId && orderLoadingHoDetail?.shipping_gst_number
        ? orderLoadingHoDetail?.shipping_gst_number
        : "",
    licenseManagerName:
      orderLoadingHoId && orderLoadingHoDetail?.license_contract_manager_name
        ? orderLoadingHoDetail?.license_contract_manager_name
        : "",
    licenseManagerPhone:
      orderLoadingHoId && orderLoadingHoDetail?.license_contract_manager_phone
        ? orderLoadingHoDetail?.license_contract_manager_phone
        : "",
    licenseManagerEmail:
      orderLoadingHoId &&
      orderLoadingHoDetail?.license_contract_manager_email_id
        ? orderLoadingHoDetail?.license_contract_manager_email_id
        : "",
    licenseActivationDate:
      orderLoadingHoId && orderLoadingHoDetail?.proposed_license_activation_date
        ? licenseActivationOptions?.filter(
            (item) =>
              item?.value ===
              orderLoadingHoDetail?.proposed_license_activation_date
          )
        : null,
    manualCIFForm: null,
    sellingPaymentTerms:
      orderLoadingHoId && orderLoadingHoDetail?.selling_payment_terms
        ? orderLoadingHoDetail?.selling_payment_terms
        : "",

    // Fields visible when edit page
    purchasePaymentTerms: "",
    licenseActivation: null,
    licenseCertificate: null,
    salesInvoiceNumber: "",
    salesInvoiceDate: null,
    salesInvoiceAmount: "",
    salesGSTAmount: "",
    totalSalesInvoiceAmount: "",
    salesInvoice: null,
    purchaseInvoice: [],
    payments: [],
    balanceAmount: "",
    // paymentDelayedByDays: "",
    // branchInterestPerMonth: "",
    //End
    remarks:
      orderLoadingHoId && orderLoadingHoDetail?.remarks
        ? orderLoadingHoDetail?.remarks
        : "",
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
    enableReinitialize: false,
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

  useEffect(() => {
    const data = orderLoadingHoDetail;

    if (
      orderLoadingHoId &&
      data &&
      allBranch?.length > 0 &&
      bdPersonByBranch?.length > 0 &&
      accountByBdPerson?.length > 0 &&
      !formInitialized
    ) {
      // Set all values
      setFieldValue("userType", data.user_type);
      setFieldValue("orderLoadingDate", data.order_loading_date || null);
      setFieldValue(
        "orderType",
        orderTypeOptions.find((x) => x.value === data.order_type)
      );
      setFieldValue(
        "branch",
        allBranch.find((x) => x.value === data.branch)
      );
      setFieldValue(
        "bdPerson",
        bdPersonByBranch.filter((x) =>
          data?.bd_person?.map((b) => b.id).includes(x.value)
        )
      );
      setFieldValue(
        "account",
        accountByBdPerson.find((x) => x.value === data.account)
      );
      setFieldValue(
        "thirdPartyAccount",
        thirdPartyAccountByBdPerson.find(
          (x) => x.value === data.third_party_account
        )
      );
      setFieldValue("poNumber", data.po_number || "");
      setFieldValue("poDate", data.po_date || null);
      setFieldValue("billingAddress", data.billing_address || "");
      setFieldValue("billingGSTNumber", data.billing_gst_number || "");
      setFieldValue("shippingAddress", data.shipping_address || "");
      setFieldValue("shippingGSTNumber", data.shipping_gst_number || "");
      setFieldValue(
        "licenseManagerName",
        data.license_contract_manager_name || ""
      );
      setFieldValue(
        "licenseManagerPhone",
        data.license_contract_manager_phone || ""
      );
      setFieldValue(
        "licenseManagerEmail",
        data.license_contract_manager_email_id || ""
      );
      setFieldValue(
        "licenseActivationDate",
        licenseActivationOptions.find(
          (x) => x.value === data.proposed_license_activation_date
        )
      );
      setFieldValue("sellingPaymentTerms", data.selling_payment_terms || "");
      setFieldValue("remarks", data.remarks || "");
      setFieldValue(
        "productDetails",
        data?.product_details?.map((item) => ({
          ...item,
          product_master_label: item?.product_master_name,
          productId: item?.id,
        }))
      );

      setFormInitialized(true);
    }
  }, [
    orderLoadingHoId,
    orderLoadingHoDetail,
    allBranch,
    bdPersonByBranch,
    accountByBdPerson,
    thirdPartyAccountByBdPerson,
    setFieldValue,
    formInitialized,
  ]);

  useEffect(() => {
    if (orderLoadingHoId) {
      dispatch(getOrderLoadingPo(orderLoadingHoId)).then((res) => {
        if (res?.payload?.data?.order_loading_po) {
          const data = res.payload.data.order_loading_po;

          // ✅ Store form data
          setOrderLoadingHoDetail(data);

          // ✅ Fetch branch list (required to match branch select)
          dispatch(getAllBranch());

          // ✅ Fetch BD person list based on branch and orderType
          dispatch(
            getBdPersonByBranch({
              value: data.branch,
              orderType: data.order_type,
            })
          );

          // ✅ Fetch account list based on bd person ids and orderType
          dispatch(
            getAccountByBdPerson({
              value: data.bd_person.map((item) => item.id).join(","),
              orderType: data.order_type,
            })
          );
        }
      });
    }
  }, [orderLoadingHoId]);

  const handleBranchChange = (selectedOption) => {
    setFieldValue("bdPerson", []);
    setFieldValue("account", "");
    if (selectedOption?.value) {
      dispatch(
        getBdPersonByBranch({
          value: selectedOption?.value,
          orderType: values?.orderType?.value,
        })
      );
    }
  };

  const handleBdPersonChange = (selectedOption) => {
    setFieldValue("account", "");
    setFieldValue("thirdPartyAccount", "");
    const payload = selectedOption.map((item) => item.value).join(",");
    if (payload) {
      dispatch(
        getAccountByBdPerson({
          value: payload,
          orderType: values?.orderType?.value,
        })
      );
    }
  };

  const handleBase64File = (fieldName, file) => {
    const fileURL = URL.createObjectURL(file);
    setBase64Files((prev) => ({
      ...prev,
      [fieldName]: fileURL,
    }));
  };

  return (
    <>
      {orderLoadingHoDetailLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="">
          <div className="">
            <div>
              <div className="commom-header-title mb-0">Order Loading PO</div>
              <span className="common-breadcrum-msg">
                we are in the same team
              </span>
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
                {values?.userType === "EndUser"
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
                  value={values?.userType}
                  isDisabled
                />
                <CommonDatePicker
                  label="Order Loading Date"
                  name="orderLoadingDate"
                  required
                  value={values?.orderLoadingDate}
                  onChange={(date) => setFieldValue("orderLoadingDate", date)}
                  error={
                    touched?.orderLoadingDate && !!errors?.orderLoadingDate
                  }
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
                    setFieldValue("bdPerson", []);
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
                    handleBranchChange(selectedOption);
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
                    setFieldValue("bdPerson", selectedOption);
                    handleBdPersonChange(selectedOption);
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
                    setShowConfirm({ isShow: true, type: 1 });
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
                    {isThirdParty && "Third Party"} PO Copy
                    <span className="text-danger"> *</span>
                  </label>
                  {orderLoadingHoId && (
                    <>
                      <br />
                      {orderLoadingHoDetail?.po_copy && (
                        <a
                          href={`${orderLoadingHoDetail?.po_copy}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Existing Po Copy
                        </a>
                      )}
                    </>
                  )}
                  {orderLoadingHoId && base64Files?.poCopy && (
                    <>
                      <br />
                      <a
                        href={`${base64Files?.poCopy}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 mb-2"
                      >
                        Selected {isThirdParty && "Third Party"} Po Copy
                      </a>
                      <span
                        className="text-red-600 ms-2"
                        onClick={() => {
                          poCopyRef.current.value = null;
                          setFieldValue("poCopy", null);
                          setBase64Files((prev) => ({
                            ...prev,
                            poCopy: null,
                          }));
                        }}
                      >
                        ✖ Remove
                      </span>
                    </>
                  )}
                  <input
                    ref={poCopyRef}
                    type="file"
                    className={`form-control ${
                      errors?.poCopy && touched?.poCopy ? "is-invalid" : ""
                    } input`}
                    name="poCopy"
                    id="poCopy"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue("poCopy", file);
                      if (!file) return;
                      handleBase64File("poCopy", file);
                    }}
                    accept={ACCEPTED_FILE_TYPES}
                  />
                  {errors?.poCopy && touched?.poCopy && (
                    <div className="invalid-feedback ">{errors?.poCopy}</div>
                  )}
                </div>

                {isThirdParty && (
                  <>
                    <div className="form-group">
                      <label className="form-label label requiredText">
                        Client Party PO Copy
                        <span className="text-danger"> *</span>
                      </label>

                      {orderLoadingHoId && (
                        <>
                          <br />
                          {orderLoadingHoDetail?.client_po_copy && (
                            <a
                              href={`${orderLoadingHoDetail?.client_po_copy}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Existing Client Po Copy
                            </a>
                          )}
                        </>
                      )}
                      {orderLoadingHoId && base64Files?.clientPartyPoCopy && (
                        <>
                          <br />
                          <a
                            href={`${base64Files?.clientPartyPoCopy}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 mb-2"
                          >
                            Selected Client Po Copy
                          </a>
                          <span
                            className="text-red-600 ms-2"
                            onClick={() => {
                              clientPartyPoCopyRef.current.value = null;
                              setFieldValue("clientPartyPoCopy", null);
                              setBase64Files((prev) => ({
                                ...prev,
                                clientPartyPoCopy: null,
                              }));
                            }}
                          >
                            ✖ Remove
                          </span>
                        </>
                      )}
                      <input
                        ref={clientPartyPoCopyRef}
                        type="file"
                        className={`form-control ${
                          errors?.clientPartyPoCopy &&
                          touched?.clientPartyPoCopy
                            ? "is-invalid"
                            : ""
                        } input`}
                        name="clientPartyPoCopy"
                        id="clientPartyPoCopy"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFieldValue("clientPartyPoCopy", file);
                          if (!file) return;
                          handleBase64File("clientPartyPoCopy", file);
                        }}
                        accept={ACCEPTED_FILE_TYPES}
                      />
                      {errors?.clientPartyPoCopy &&
                        touched?.clientPartyPoCopy && (
                          <div className="invalid-feedback ">
                            {errors?.clientPartyPoCopy}
                          </div>
                        )}
                    </div>
                    <CustomSelect
                      label="Third Party Account"
                      required
                      name="thirdPartyAccount"
                      placeholder="Select a Account"
                      value={values?.thirdPartyAccount}
                      onChange={(selectedOption) => {
                        setFieldValue("thirdPartyAccount", selectedOption);
                        if (selectedOption?.value) {
                          setFieldTouched("thirdPartyAccount", false);
                        } else {
                          setFieldTouched("thirdPartyAccount", true);
                        }
                      }}
                      options={thirdPartyAccountByBdPerson}
                      error={
                        errors?.thirdPartyAccount && touched?.thirdPartyAccount
                      }
                      errorText={errors?.thirdPartyAccount}
                      isDisabled={
                        !values?.branch?.value ||
                        branchListLoading ||
                        bdPersonByBranchLoading ||
                        values?.bdPerson?.length === 0 ||
                        thirdPartyAccountByBdPersonLoading
                      }
                    />
                  </>
                )}
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
                  isInvalid={
                    errors?.billingGSTNumber && touched?.billingGSTNumber
                  }
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
                  isInvalid={
                    errors?.shippingAddress && touched?.shippingAddress
                  }
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
                  {/* <label className="form-label label requiredText"> */}
                  <label className="form-label label">Product Details</label>
                  <div style={{ cursor: "pointer" }}>
                    {!orderLoadingHoId && (
                      <AddIcon
                        onClick={() => {
                          setModal({
                            isOpen: true,
                          });
                        }}
                      />
                    )}
                    {orderLoadingHoId && (
                      <PreviewIcon
                        onClick={() => {
                          setModal({
                            isOpen: true,
                          });
                        }}
                      />
                    )}
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
                    errors?.licenseActivationDate &&
                    touched?.licenseActivationDate
                  }
                  errorText={errors.licenseActivationDate}
                />
                <div className="form-group">
                  <label className="form-label label requiredText">
                    Manual CIF Form<span className="text-danger"> *</span>
                  </label>
                  {orderLoadingHoId && (
                    <>
                      <br />
                      {orderLoadingHoDetail?.manual_cif_form && (
                        <a
                          href={`${orderLoadingHoDetail?.manual_cif_form}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Existing Manual Cif Form
                        </a>
                      )}
                    </>
                  )}
                  {orderLoadingHoId && base64Files?.manualCIFForm && (
                    <>
                      <br />
                      <a
                        href={`${base64Files?.manualCIFForm}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 mb-2"
                      >
                        Selected Manual Cif Form
                      </a>
                      <span
                        className="text-red-600 ms-2"
                        onClick={() => {
                          manualCIFRef.current.value = null;
                          setFieldValue("manualCIFForm", null);
                          setBase64Files((prev) => ({
                            ...prev,
                            manualCIFForm: null,
                          }));
                        }}
                      >
                        ✖ Remove
                      </span>
                    </>
                  )}
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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue("manualCIFForm", file);
                      if (!file) return;
                      handleBase64File("manualCIFForm", file);
                    }}
                    accept={ACCEPTED_FILE_TYPES}
                  />
                  {errors?.manualCIFForm && touched?.manualCIFForm && (
                    <div className="invalid-feedback ">
                      {errors?.manualCIFForm}
                    </div>
                  )}
                </div>
                <CommonInputTextField
                  labelName="Selling Payment Terms (Days)"
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
                {orderLoadingHoId && (
                  <>
                    <CommonInputTextField
                      labelName="Purchase Payment Terms"
                      id="purchasePaymentTerms"
                      name="purchasePaymentTerms"
                      className="input"
                      type="number"
                      min={1}
                      mainDiv="form-group"
                      labelClass="label"
                      placeHolder="Enter Purchase Payment Terms"
                      value={values?.purchasePaymentTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <CommonDatePicker
                      label="License Activation Date"
                      name="licenseActivation"
                      value={values?.licenseActivation}
                      onChange={(date) =>
                        setFieldValue("licenseActivation", date)
                      }
                    />
                    <div className="form-group">
                      <label className="form-label label">
                        License Certificate
                      </label>
                      {orderLoadingHoId && base64Files?.licenseCertificate && (
                        <>
                          <br />
                          <a
                            href={`${base64Files?.licenseCertificate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 mb-2"
                          >
                            Selected License Certificate
                          </a>
                          <span
                            className="text-red-600 ms-2"
                            onClick={() => {
                              licenseCertificateRef.current.value = null;
                              setFieldValue("licenseCertificate", null);
                              setBase64Files((prev) => ({
                                ...prev,
                                licenseCertificate: null,
                              }));
                            }}
                          >
                            ✖ Remove
                          </span>
                        </>
                      )}
                      <input
                        ref={licenseCertificateRef}
                        type="file"
                        className={`form-control input`}
                        name="licenseCertificate"
                        id="licenseCertificate"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFieldValue("licenseCertificate", file);
                          if (!file) return;
                          handleBase64File("licenseCertificate", file);
                        }}
                        accept={ACCEPTED_FILE_TYPES}
                      />
                    </div>
                    <CommonInputTextField
                      labelName="Sales Invoice Number"
                      id="salesInvoiceNumber"
                      name="salesInvoiceNumber"
                      className="input"
                      mainDiv="form-group"
                      labelClass="label"
                      placeHolder="Enter Sales Invoice Number"
                      value={values?.salesInvoiceNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <CommonDatePicker
                      label="Sales Invoice Date"
                      name="salesInvoiceDate"
                      value={values?.salesInvoiceDate}
                      onChange={(date) =>
                        setFieldValue("salesInvoiceDate", date)
                      }
                    />
                    <CommonInputTextField
                      labelName="Sales Invoice Amount (Ex GST)"
                      id="salesInvoiceAmount"
                      name="salesInvoiceAmount"
                      className="input"
                      type="number"
                      mainDiv="form-group"
                      labelClass="label"
                      placeHolder="Enter Sales Invoice Amount (Ex GST)"
                      value={values?.salesInvoiceAmount}
                      min={1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <CommonInputTextField
                      labelName="Sales GST Amount (18%)"
                      id="salesGSTAmount"
                      name="salesGSTAmount"
                      className="input"
                      type="number"
                      mainDiv="form-group"
                      labelClass="label"
                      placeHolder="Sales GST Amount (18%)"
                      // value={values?.salesGSTAmount}
                      isDisabled
                    />
                    <CommonInputTextField
                      labelName="Total Sales Invoice Amount (Inc GST)"
                      id="totalSalesInvoiceAmount"
                      name="totalSalesInvoiceAmount"
                      className="input"
                      type="number"
                      mainDiv="form-group"
                      labelClass="label"
                      placeHolder="Total Sales Invoice Amount (Inc GST)"
                      // value={values?.totalSalesInvoiceAmount}
                      isDisabled
                    />
                    <div className="form-group">
                      <label className="form-label label">Sales Invoice</label>
                      {orderLoadingHoId && base64Files?.salesInvoice && (
                        <>
                          <br />
                          <a
                            href={`${base64Files?.salesInvoice}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 mb-2"
                          >
                            Selected Sales Invoice
                          </a>
                          <span
                            className="text-red-600 ms-2"
                            onClick={() => {
                              salesInvoiceRef.current.value = null;
                              setBase64Files((prev) => ({
                                ...prev,
                                salesInvoice: null,
                              }));
                              setFieldValue("salesInvoice", null);
                            }}
                          >
                            ✖ Remove
                          </span>
                        </>
                      )}
                      <input
                        ref={salesInvoiceRef}
                        type="file"
                        className={`form-control input`}
                        name="salesInvoice"
                        id="salesInvoice"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFieldValue("salesInvoice", file);
                          if (!file) return;
                          handleBase64File("salesInvoice", file);
                        }}
                        accept={ACCEPTED_FILE_TYPES}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label label">
                        Purchase Invoice
                      </label>
                      <div style={{ cursor: "pointer" }}>
                        <AddIcon onClick={() => {}} />
                        <PreviewIcon onClick={() => {}} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label label">Payment</label>
                      <div style={{ cursor: "pointer" }}>
                        <AddIcon onClick={() => {}} />
                        <PreviewIcon onClick={() => {}} />
                      </div>
                    </div>
                    <CommonInputTextField
                      labelName="Balance Amount (Inc GST)"
                      id="balanceAmount"
                      name="balanceAmount"
                      className="input"
                      type="number"
                      mainDiv="form-group"
                      labelClass="label"
                      placeHolder="Balance Amount (Inc GST)"
                      // value={values?.balanceAmount}
                      isDisabled
                    />
                  </>
                )}
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
                  {orderLoadingHoId
                    ? isSubmitting
                      ? "Updating..."
                      : "Update"
                    : isSubmitting
                    ? "Submitting..."
                    : "Submit"}
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
      )}
    </>
  );
};
export default AddEditOrderLoadingHO;
