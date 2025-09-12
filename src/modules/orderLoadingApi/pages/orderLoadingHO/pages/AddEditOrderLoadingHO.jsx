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
  updateOrderLoadingHO,
} from "@/modules/orderLoadingApi/slice/OrderLoadingApiSlice";
import * as Yup from "yup";
import CommonModal from "@/components/common/modal/CommonModal";
import ProductDetailModal from "../component/ProductDetailModal";
import AddProductDetail from "../component/AddProductDetail";
import ConfirmationModal from "@/components/common/modal/ConfirmationModal";
import { toast } from "react-toastify";
import CustomSweetAlert from "@/components/common/customSweetAlert/CustomSweetAlert";
import { getOrderLoadingPo } from "@/modules/dashboard/slice";
import moment from "moment";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

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
  const { orderLoadingHoId } = useParams();
  const [isThirdParty, setIsThirdParty] = useState(false);

  // const isThirdParty = useMemo(
  //   () => state?.user?.value === "ThirdParty",
  //   [state]
  // );

  useEffect(() => {
    if (state?.user === "ThirdParty") {
      setIsThirdParty(true);
    }
  }, [state]);
  const [bdOptions, setBdOptions] = useState([]);
  const [accountOption, setAccountOption] = useState([]);
  const [thirdPartyAccountOption, setThirdPartyAccountOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [base64, setBase64] = useState({
    clientPartyPoCopy: {
      new: null,
      existing: null,
    },
    poCopy: {
      new: null,
      existing: null,
    },
    manualCIFForm: {
      new: null,
      existing: null,
    },
  });
  //Type 1 for Product Details
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
  });
  const [addProductDetailModal, setAddProductDetailModal] = useState({
    isShow: false,
    selectedProduct: null,
  });
  const [stateCode, setStateCode] = useState(0);

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
    account: Yup.string().required("Account is required"),
    thirdPartyAccount: isThirdParty
      ? Yup.string().required("Third Party Account is required")
      : Yup.string().notRequired(),
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
    proposedLicenseActivationDate: Yup.string().required(
      "Proposed License Activation Date is required"
    ),
    manualCIFForm: Yup.mixed().required("Manual CIF Form is required"),
    sellingPaymentTerms: Yup.string().required(
      "Selling Payment Terms is required"
    ),
    remarks: Yup.string().required("Remarks are required"),
  });
  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("user_type", isThirdParty ? "ThirdParty" : "EndUser");
    formData.append("order_type", values?.orderType);
    formData.append("order_loading_date", values?.orderLoadingDate);
    formData.append("branch", values?.branch);
    formData.append("account", values?.account);
    formData.append("po_number", values?.poNumber);
    formData.append("po_date", values?.poDate);
    formData.append("po_copy", values?.poCopy);
    if (isThirdParty) {
      formData.append("client_po_copy", values?.clientPartyPoCopy);
      formData.append("third_party_account", values?.thirdPartyAccount);
    }
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
      values?.proposedLicenseActivationDate
    );

    formData.append("manual_cif_form", values?.manualCIFForm);
    formData.append("selling_payment_terms", values?.sellingPaymentTerms);
    formData.append("remarks", values?.remarks);
    formData.append("bd_person", JSON.stringify(values?.bdPerson));
    formData.append(
      "product_details",
      JSON.stringify(
        values?.productDetails?.map((item, idx) => ({ ...item, id: idx }))
      )
    );
    if (orderLoadingHoId) {
      dispatch(
        updateOrderLoadingHO({ id: orderLoadingHoId, formData: formData })
      ).then((res) => {
        debugger;
      });
    } else {
      dispatch(addOrderLoadingHO(formData)).then((res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          toast.success("Order loading added successfully!");
          poCopyRef.current.value = "";
          if (isThirdParty) {
            clientPartyPoCopyRef.current.value = "";
          }
          manualCIFRef.current.value = "";
          resetForm();
          navigate(
            routesConstants?.ORDER_LOADING_PO +
              routesConstants?.ORDER_LOADING_PO_LIST
          );
        }
        setIsSubmitting(false);
      });
    }
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
    proposedLicenseActivationDate: null,
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
    validationSchema,
    onSubmit,
  });
  const handleAddProductDetail = (newProduct) => {
    const { selectedProduct } = addProductDetailModal;
    const isEdit = !!(newProduct?.id && selectedProduct?.id);

    let updatedProductDetails;

    //Below is is Edit Condition
    if (isEdit) {
      // Replace the product at the correct index (id - 1)
      updatedProductDetails = values.productDetails.map((item, index) => {
        return index === selectedProduct.id - 1
          ? { ...item, ...newProduct }
          : item;
      });
    } else {
      // Add a new product to the list
      updatedProductDetails = [...values?.productDetails, newProduct];
    }

    // Update Formik field and close modal
    setFieldValue("productDetails", updatedProductDetails);
    setAddProductDetailModal({
      isShow: false,
      selectedProduct: null,
    });
  };

  const handleDeleteRow = (id) => {
    let filteredArr = values?.productDetails?.filter(
      (item, idx) => id !== idx + 1
    );
    setFieldValue("productDetails", filteredArr);
  };

  const handleRowSelect = (data) => {
    setAddProductDetailModal({ isShow: true, selectedProduct: data });
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
      setFieldValue("thirdPartyAccount", null);
    }
    setShowConfirm(false);
  };

  const handleBranchChange = (
    branchId,
    bdIds = values?.bdPerson,
    isEdit = false,
    orderType = values?.orderType
  ) => {
    if (branchId) {
      dispatch(
        getBdPersonByBranch({
          value: branchId,
          orderType: orderType,
        })
      ).then((res) => {
        if (res.payload.data?.bd_person?.length > 0) {
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
            if (!isEdit) {
              setFieldValue("account", "");
              setFieldValue("thirdPartyAccount", "");
            }
          } else {
            setFieldValue("bdPerson", []);
            if (!isEdit) {
              setFieldValue("account", "");
              setFieldValue("thirdPartyAccount", "");
            }
          }
        }
        if (res?.payload?.data?.state_code) {
          setStateCode(res?.payload?.data?.state_code);
        }
      });
    } else {
      setBdOptions([]);
      setFieldValue("bdPerson", []);
      setAccountOption([]);
      setFieldValue("account", "");
      setFieldValue("thirdPartyAccount", "");
    }
  };

  const handeleBdChange = (bdIds, orderType = values?.orderType) => {
    if (bdIds?.length > 0) {
      dispatch(
        getAccountByBdPerson({
          value: bdIds?.join(","),
          orderType: orderType,
        })
      ).then((res) => {
        if (res?.payload?.data?.accounts?.length > 0) {
          let formattedOptions = res?.payload?.data?.accounts?.map((item) => ({
            value: item?.id,
            label: `${item?.name} (${item?.csn})`,
            bdIds: item?.bd_person_ids,
          }));

          let formattedThirdPartyOptions =
            res?.payload?.data?.third_party_acccounts?.map((item) => ({
              value: item?.id,
              label: `${item?.name} (${item?.csn})`,
              bdIds: item?.bd_person_ids,
            }));
          setAccountOption(formattedOptions);
          setThirdPartyAccountOption(formattedThirdPartyOptions);
          if (values?.account) {
            let findAccount = formattedOptions?.find(
              (item) => item?.value === values.account
            );
            if (values?.account !== findAccount?.value) {
              setFieldValue("account", "");
            }
          }
          if (values?.thirdPartyAccount) {
            let findThirdPartyAccount = formattedThirdPartyOptions?.find(
              (item) => item?.value === values?.thirdPartyAccount
            );
            if (values?.thirdPartyAccount !== findThirdPartyAccount?.value) {
              setFieldValue("thirdPartyAccount", "");
            }
          }
        } else {
          setAccountOption([]);
          setThirdPartyAccountOption([]);
        }
      });
    } else {
      setFieldValue("account", "");
      setFieldValue("thirdPartyAccount", "");
    }
  };

  const handleBase64File = (fieldName, file) => {
    const fileURL = URL.createObjectURL(file);
    setBase64((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], new: fileURL },
    }));
  };

  useEffect(() => {
    if (orderLoadingHoId) {
      setIsLoading(true);
      dispatch(getOrderLoadingPo(orderLoadingHoId)).then((res) => {
        if (res?.payload?.data?.order_loading_po) {
          let data = res?.payload?.data?.order_loading_po;
          let bdIds = data?.bd_person?.map((i) => i?.id);
          setFieldValue("orderType", data?.order_type);
          setFieldValue(
            "orderLoadingDate",
            data?.order_loading_date
              ? moment(data?.order_loading_date, "DD/MM/YY").format(
                  "YYYY-MM-DD"
                )
              : null
          );
          setFieldValue("branch", data?.branch);
          setFieldValue("bdPerson", bdIds);
          setFieldValue("account", data?.account);
          setFieldValue("thirdPartyAccount", data?.third_party_account);
          setFieldValue("poNumber", data?.po_number);
          setFieldValue(
            "poDate",
            data?.po_date
              ? moment(data?.po_date, "DD/MM/YY").format("YYYY-MM-DD")
              : null
          );
          setFieldValue("billingAddress", data?.billing_address);
          setFieldValue("billingGSTNumber", data?.billing_gst_number);
          setFieldValue("shippingAddress", data?.shipping_address);
          setFieldValue("shippingGSTNumber", data?.shipping_gst_number);

          setFieldValue(
            "licenseManagerName",
            data?.license_contract_manager_name
          );
          setFieldValue(
            "licenseManagerPhone",
            data?.license_contract_manager_phone
          );
          setFieldValue(
            "licenseManagerEmail",
            data?.license_contract_manager_email_id
          );
          setFieldValue(
            "proposedLicenseActivationDate",
            data?.proposed_license_activation_date
          );

          setFieldValue("sellingPaymentTerms", data?.selling_payment_terms);
          setFieldValue("remarks", data?.remarks);

          setFieldValue("poCopy", data?.po_copy);
          setFieldValue("clientPartyPoCopy", data?.client_po_copy);
          setFieldValue("manualCIFForm", data?.manual_cif_form);
          setFieldValue(
            "productDetails",
            data?.product_details?.map((item) => ({
              ...item,
              product_master_label: item?.product_master_name,
              product_name: item?.product_master_name,
              product_detail_id: item?.id,
            }))
          );
          setBase64((prev) => ({
            ...prev,
            ...(data?.po_copy && {
              poCopy: { new: null, existing: data?.po_copy || null },
            }),
            ...(data?.client_po_copy && {
              clientPartyPoCopy: {
                new: null,
                existing: data?.client_po_copy || null,
              },
            }),
            ...(data?.manual_cif_form && {
              manualCIFForm: {
                new: null,
                existing: data?.manual_cif_form || null,
              },
            }),
          }));

          handleBranchChange(data?.branch, bdIds, true, data?.order_type);
          handeleBdChange(bdIds, data?.order_type);
        }
        setIsLoading(false);
      });
    }
  }, [orderLoadingHoId]);

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
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="add-edit-orderLoadingForm">
          <div className="add-account-form">
            <h2 className="title">
              Order Loading PO
              {isThirdParty ? " Third Party" : " End User"} Form
            </h2>
            <form className="">
              <CommonInputTextField
                labelName="User Type"
                className="input"
                mainDiv="form-group"
                labelClass="label"
                value={isThirdParty ? "ThirdParty" : "EndUser"}
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
                  if (values?.orderType) {
                    CustomSweetAlert(
                      "Change Order Type?",
                      "Changing the order type will update the Branch ,BD Person(s) and Account. Do you want to continue?",
                      "Warning",
                      true,
                      "Yes, Change Order Type",
                      "Cancel",
                      (result) => {
                        if (result.isConfirmed) {
                          setFieldValue("orderType", selectedOption?.value);
                          setFieldValue("branch", null);
                          setFieldValue("bdPerson", null);
                          setFieldValue("account", null);
                          setFieldValue("thirdPartyAccount", null);
                        }
                      }
                    );
                  } else {
                    setFieldValue("orderType", selectedOption?.value);
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
                  if (values?.account || values?.thirdPartyAccount) {
                    CustomSweetAlert(
                      "Change BD Person?",
                      "Changing the bd person will update the Account and Third Party Account based on the selected bd person. Do you want to continue?",
                      "Warning",
                      true,
                      "Yes, Change Bd Person",
                      "Cancel",
                      (result) => {
                        if (result.isConfirmed) {
                          let bdIds = selectedOption?.map(
                            (item) => item?.value
                          );
                          setFieldValue("bdPerson", bdIds);
                          handeleBdChange(bdIds);
                        }
                      }
                    );
                  } else {
                    let bdIds = selectedOption?.map((item) => item?.value);
                    setFieldValue("bdPerson", bdIds);
                    handeleBdChange(bdIds);
                  }
                }}
                isMulti
                error={errors?.bdPerson && touched?.bdPerson}
                errorText={errors?.bdPerson}
              />
              <CustomSelect
                label="Account"
                required
                name="account"
                placeholder="Select a Account"
                value={accountOption?.filter(
                  (item) => item?.value === values?.account
                )}
                onChange={(selectedOption) => {
                  CustomSweetAlert(
                    "Account Selection?",
                    `Do you confirm that Account ${selectedOption?.label} is selected correctly?`,
                    "Warning",
                    true,
                    "Yes, Select account",
                    "Cancel",
                    (result) => {
                      if (result.isConfirmed) {
                        setFieldValue("account", selectedOption?.value);
                      }
                    }
                  );
                }}
                options={accountOption}
                error={errors?.account && touched?.account}
                errorText={errors?.account}
              />
              {isThirdParty && (
                <>
                  <CustomSelect
                    label="Third Party Account"
                    required
                    name="thirdPartyAccount"
                    placeholder="Select a Third Party Account"
                    value={thirdPartyAccountOption?.filter(
                      (item) => item?.value === values?.thirdPartyAccount
                    )}
                    onChange={(selectedOption) => {
                      CustomSweetAlert(
                        "Third Party Account Selection?",
                        `Do you confirm that Third Party Account ${selectedOption?.label} is selected correctly?`,
                        "Warning",
                        true,
                        "Yes, Select third party account",
                        "Cancel",
                        (result) => {
                          if (result.isConfirmed) {
                            setFieldValue(
                              "thirdPartyAccount",
                              selectedOption?.value
                            );
                          }
                        }
                      );
                    }}
                    options={thirdPartyAccountOption}
                    error={
                      errors?.thirdPartyAccount && touched?.thirdPartyAccount
                    }
                    errorText={errors?.thirdPartyAccount}
                  />
                  <div className="form-group">
                    <label className="form-label label requiredText">
                      Client Party PO Copy
                      <span className="text-danger"> *</span>
                    </label>
                    {base64?.clientPartyPoCopy?.existing && (
                      <>
                        <br />

                        <a
                          href={`${base64?.clientPartyPoCopy?.existing}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Existing Client Po Copy
                        </a>
                      </>
                    )}
                    {base64?.clientPartyPoCopy?.new && (
                      <>
                        <br />
                        <a
                          href={`${base64?.clientPartyPoCopy?.new}`}
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
                            setBase64((prev) => ({
                              ...prev,
                              clientPartyPoCopy: {
                                ...prev?.clientPartyPoCopy,
                                new: null,
                              },
                            }));
                          }}
                        >
                          ✖ Remove
                        </span>
                      </>
                    )}
                    <input
                      ref={clientPartyPoCopyRef}
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                      type="file"
                      className={`form-control ${
                        errors?.clientPartyPoCopy && touched?.clientPartyPoCopy
                          ? "is-invalid"
                          : ""
                      } input`}
                      name="clientPartyPoCopy"
                      id="clientPartyPoCopy"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFieldValue("clientPartyPoCopy", file);
                        handleBase64File("clientPartyPoCopy", file);
                      }}
                    />
                    {errors?.clientPartyPoCopy &&
                      touched?.clientPartyPoCopy && (
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
                {base64?.poCopy?.existing && (
                  <>
                    <br />

                    <a
                      href={`${base64?.poCopy?.existing}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Existing {isThirdParty && "Third Party"} PO Copy
                    </a>
                  </>
                )}
                {base64?.poCopy?.new && (
                  <>
                    <br />
                    <a
                      href={`${base64?.poCopy?.new}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 mb-2"
                    >
                      Selected {isThirdParty && "Third Party"} PO Copy
                    </a>
                    <span
                      className="text-red-600 ms-2"
                      onClick={() => {
                        poCopyRef.current.value = null;
                        setFieldValue("poCopy", null);
                        setBase64((prev) => ({
                          ...prev,
                          poCopy: {
                            ...prev?.poCopy,
                            new: null,
                          },
                        }));
                      }}
                    >
                      ✖ Remove
                    </span>
                  </>
                )}
                <input
                  ref={poCopyRef}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
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
                    handleBase64File("poCopy", file);
                  }}
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
                  Product Details
                </label>
                <div style={{ cursor: "pointer" }}>
                  {orderLoadingHoId ? (
                    <PreviewIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (!values?.branch) {
                          toast.error("Please select branch");
                        } else if (!values?.billingGSTNumber) {
                          toast.error("Please provide billing gst number");
                        } else {
                          setModal((prev) => ({
                            ...prev,
                            isOpen: true,
                            type: 1,
                          }));
                        }
                      }}
                    />
                  ) : (
                    <AddIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (!values?.branch) {
                          toast.error("Please select branch");
                        } else if (!values?.billingGSTNumber) {
                          toast.error("Please provide billing gst number");
                        } else {
                          setModal((prev) => ({
                            ...prev,
                            isOpen: true,
                            type: 1,
                          }));
                        }
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
                name="proposedLicenseActivationDate"
                placeholder="Select a Proposed License Activation Date"
                options={licenseActivationOptions}
                required
                value={licenseActivationOptions?.find(
                  (item) =>
                    item?.value === values?.proposedLicenseActivationDate
                )}
                onChange={(selectedOption) =>
                  setFieldValue(
                    "proposedLicenseActivationDate",
                    selectedOption?.value
                  )
                }
                error={
                  errors?.proposedLicenseActivationDate &&
                  touched?.proposedLicenseActivationDate
                }
                errorText={errors.proposedLicenseActivationDate}
              />
              <div className="form-group">
                <label className="form-label label requiredText">
                  Manual CIF Form<span className="text-danger"> *</span>
                </label>
                {base64?.manualCIFForm?.existing && (
                  <>
                    <br />
                    <a
                      href={`${base64?.manualCIFForm?.existing}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Manual CIF Form
                    </a>
                  </>
                )}
                {base64?.manualCIFForm?.new && (
                  <>
                    <br />
                    <a
                      href={`${base64?.manualCIFForm?.new}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 mb-2"
                    >
                      Selected Manual CIF Form
                    </a>
                    <span
                      className="text-red-600 ms-2"
                      onClick={() => {
                        manualCIFRef.current.value = null;
                        setFieldValue("manualCIFForm", null);
                        setBase64((prev) => ({
                          ...prev,
                          manualCIFForm: {
                            ...prev?.manualCIFForm,
                            new: null,
                          },
                        }));
                      }}
                    >
                      ✖ Remove
                    </span>
                  </>
                )}
                <input
                  ref={manualCIFRef}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
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
                    handleBase64File("manualCIFForm", file);
                  }}
                />
                {errors?.manualCIFForm && touched?.manualCIFForm && (
                  <div className="invalid-feedback ">
                    {errors?.manualCIFForm}
                  </div>
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
      )}

      {/* Modal for Product Details */}
      <CommonModal
        title={modal?.type === 1 ? "Product Details" : null}
        isOpen={modal?.isOpen}
        handleClose={() => {
          setModal({
            isOpen: false,
            type: null,
          });
        }}
        scrollable
        size={"xl"}
        isAdd={modal?.type === 1}
        handleAdd={() => {
          if (modal?.type === 1) {
            setAddProductDetailModal({
              isShow: true,
              selectedProduct: null,
            });
          } else {
            alert("No Product Detail");
          }
        }}
      >
        {modal?.type === 1 ? (
          <ProductDetailModal
            data={values?.productDetails?.map((item, idx) => ({
              ...item,
              id: idx + 1,
            }))}
            handleDeleteRow={handleDeleteRow}
            handleRowSelect={handleRowSelect}
            moduleName="Order Loading HO"
          />
        ) : (
          <></>
        )}
      </CommonModal>

      {/* Modal For Adding Product Detail */}
      <CommonModal
        isOpen={modal?.type === 1 ? addProductDetailModal?.isShow : false}
        title={modal?.type === 1 ? "Add Product Details" : ""}
        handleClose={() => {
          if (modal?.type === 1) {
            setAddProductDetailModal({
              isShow: false,
              selectedProduct: null,
            });
          }
        }}
        scrollable
        isAdd
        handleAdd={() => {
          if (productFormRef.current) {
            productFormRef.current.submitForm(); // this triggers formik submit in AddProductDetail
          }
        }}
        // addBtnText={!!(newProduct?.id && selectedProduct?.id) ? "Edit" : "Add"}s
      >
        {modal?.type === 1 ? (
          <AddProductDetail
            ref={productFormRef}
            data={{
              billingGSTNumber: values?.billingGSTNumber,
              selectedProduct: addProductDetailModal?.selectedProduct,
            }}
            stateCode={stateCode}
            handleAddProductDetail={handleAddProductDetail}
            isRemark={true}
          />
        ) : (
          <></>
        )}
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
