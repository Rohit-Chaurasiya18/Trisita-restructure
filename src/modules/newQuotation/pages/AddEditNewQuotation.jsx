import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import {
  addNewQuotation,
  addPurchasedPaymentTerms,
  addSalesStage,
  getPurchasedPaymentTerms,
  getQuotationById,
  getSalesStage,
  updateNewQuotation,
} from "@/modules/newQuotation/slice/quotationSlice";
import { useEffect, useRef, useState } from "react";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonModal from "@/components/common/modal/CommonModal";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import {
  getAllAccountByBdPersonIds,
  getAllBdPersonByBranchId,
} from "@/modules/licenseOptimization/slice/LicenseOptimizationSlice";
import { toast } from "react-toastify";
import routesConstants from "@/routes/routesConstants";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailModal from "@/modules/orderLoadingApi/pages/orderLoadingHO/component/ProductDetailModal";
import AddProductDetail from "@/modules/orderLoadingApi/pages/orderLoadingHO/component/AddProductDetail";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CustomSweetAlert from "@/components/common/customSweetAlert/CustomSweetAlert";

const validationSchema = Yup.object({
  quotationDate: Yup.string().required("Quotation date is required."),
  name: Yup.string().required("Name is required."),
  purchasePaymentTerms: Yup.number().required(
    "Purchase payment terms is required."
  ),
  salesStage: Yup.string().required("Sales stage is required."),
  branch: Yup.string().required("Branch is required."),
  account: Yup.string().required("Account is required."),
  bdPerson: Yup.array()
    .of(Yup.mixed()) // or Yup.number(), Yup.string(), depending on type
    .min(1, "At least one value must be selected")
    .required("This field is required"),
  billingAddress: Yup.string().required("Billing Address is required"),
  billingGSTNumber: Yup.string().required("Billing GST Number is required"),
  shippingAddress: Yup.string().required("Shipping Address is required"),
  shippingGSTNumber: Yup.string().required("Shipping GST Number is required"),
  validUntil: Yup.string().required("Valid until is required."),
});
export const AddSalesStage = ({ setModal, modal }) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      initialValues: {
        salesStage: "",
        purchasedPaymentTerms: null,
      },
      validationSchema: Yup.object({
        salesStage:
          modal?.type === 1
            ? Yup.string().required("Sales stage is required.")
            : Yup.string().notRequired(),
        purchasedPaymentTerms:
          modal?.type === 2
            ? Yup.number().required("Purchased payment terms is required.")
            : Yup.number().notRequired(),
      }),
      onSubmit: (values) => {
        setIsSubmitting(true);
        if (modal?.type === 1) {
          dispatch(addSalesStage({ name: values?.salesStage })).then((res) => {
            if (res?.payload?.status === 200 || res?.payload?.status === 201) {
              toast.success("Sales stage created successfully.");
              setModal((prev) => ({ ...prev, isOpen: false }));
            }
            dispatch(getSalesStage());
            setIsSubmitting(false);
          });
        } else if (modal?.type === 2) {
          dispatch(
            addPurchasedPaymentTerms({
              payment_terms: values?.purchasedPaymentTerms,
            })
          ).then((res) => {
            if (res?.payload?.status === 200 || res?.payload?.status === 201) {
              toast.success("Purchased payment terms created successfully.");
              setModal((prev) => ({ ...prev, isOpen: false }));
            }
            dispatch(getPurchasedPaymentTerms());
            setIsSubmitting(false);
          });
        }
      },
    });

  return (
    <div className="add-sales-stage-form">
      {modal?.type === 1 ? (
        <CommonInputTextField
          labelName="Sales Stage Name"
          id="salesStage"
          name="salesStage"
          className="input"
          required
          mainDiv="form-group"
          labelClass="label"
          value={values.salesStage}
          placeHolder="Enter sales stage"
          isInvalid={!!errors.salesStage && touched.salesStage}
          errorText={errors.salesStage}
          onChange={handleChange}
          onBlur={handleBlur}
          requiredText
        />
      ) : modal?.type === 2 ? (
        <CommonInputTextField
          labelName="Purchased Payment Terms"
          id="purchasedPaymentTerms"
          name="purchasedPaymentTerms"
          className="input"
          required
          type="number"
          min={1}
          mainDiv="form-group"
          labelClass="label"
          value={values.purchasedPaymentTerms}
          placeHolder="Enter purchased payment terms"
          isInvalid={
            !!errors.purchasedPaymentTerms && touched.purchasedPaymentTerms
          }
          errorText={errors.purchasedPaymentTerms}
          onChange={handleChange}
          onBlur={handleBlur}
          requiredText
        />
      ) : (
        <></>
      )}
      <div className="d-flex justify-content-center mt-4">
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          Add
        </button>
      </div>
    </div>
  );
};

const AddEditNewQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productFormRef = useRef();
  const { quotationId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevised, setIsRevised] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
  });
  const [bdOptions, setBdOptions] = useState([]);
  const [accountOption, setAccountOption] = useState([]);
  const [addProductDetailModal, setAddProductDetailModal] = useState({
    isShow: false,
    selectedProduct: null,
  });
  const [stateCode, setStateCode] = useState(0);
  const {
    salesStage,
    salesStageLoading,
    branch_list,
    branchListLoading,
    purchasedPaymentTerms,
    purchasedPaymentTermsLoading,
  } = useSelector((state) => ({
    salesStage: state?.quotation?.salesStage,
    salesStageLoading: state?.quotation?.salesStageLoading,
    purchasedPaymentTerms: state?.quotation?.purchasedPaymentTerms,
    purchasedPaymentTermsLoading:
      state?.quotation?.purchasedPaymentTermsLoading,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
  }));

  useEffect(() => {
    dispatch(getSalesStage());
    dispatch(getAllBranch());
    dispatch(getPurchasedPaymentTerms());
  }, []);

  const initialValues = {
    quotationDate: "",
    name: "",
    branch: "",
    bdPerson: [],
    account: "",
    purchasePaymentTerms: null,
    salesStage: null,
    opportunity: "",
    billingContact: "",
    validUntil: "",
    remarks: "",
    productDetails: [],
    billingAddress: "",
    billingGSTNumber: "",
    shippingAddress: "",
    shippingGSTNumber: "",
    is_revised: false,
  };

  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      let payload = {
        quotation_date: values?.quotationDate,
        name: values?.name,
        branch: values?.branch,
        bd_person: values?.bdPerson,
        account: values?.account,
        opportunity: values?.opportunity,
        sales_stage: values?.salesStage,
        billing_contact: values?.billingContact,
        valid_until: values?.validUntil,
        billing_address: values?.billingAddress,
        billing_gst_no: values?.billingGSTNumber,
        shipping_address: values?.shippingAddress,
        shipping_gst_no: values?.shippingGSTNumber,
        remarks: values?.remarks,
        purchase_payment_terms: values?.purchasePaymentTerms,
        product_details: values?.productDetails?.map((item) => ({
          product_master: item?.product_master,
          quantity: item?.quantity,
          selling_amount: item?.selling_amount,
          purchase_amount: item?.purchase_amount,
          remarks: item?.remarks,
          id: item?.product_detail_id ? item?.product_detail_id : "",
        })),
        isRevised: isRevised,
        quotation_id: quotationId,
      };
      setIsSubmitting(true);
      if (quotationId) {
        if (isRevised) {
          dispatch(addNewQuotation(payload)).then((res) => {
            if (res?.payload?.status === 200 || res?.payload?.status === 201) {
              toast.success("New Quotation revised succesfully.");
              navigate(routesConstants?.NEW_QUOTATION);
              resetForm();
            }
            setIsSubmitting(false);
          });
        } else {
          dispatch(updateNewQuotation({ ...payload, id: quotationId })).then(
            (res) => {
              if (
                res?.payload?.status === 200 ||
                res?.payload?.status === 201
              ) {
                toast.success("New Quotation updated succesfully.");
                navigate(routesConstants?.NEW_QUOTATION);
                resetForm();
              }
              setIsSubmitting(false);
            }
          );
        }
      } else {
        dispatch(addNewQuotation(payload)).then((res) => {
          if (res?.payload?.status === 200 || res?.payload?.status === 201) {
            toast.success("New Quotation created succesfully.");
            navigate(routesConstants?.NEW_QUOTATION);
            resetForm();
          }
          setIsSubmitting(false);
        });
      }
    },
  });

  const handleAddProductDetail = (newProduct) => {
    const { selectedProduct } = addProductDetailModal;
    const isEdit = !!(newProduct?.id && selectedProduct?.id);

    let updatedProductDetails;

    if (isEdit) {
      // Replace the product at the correct index (id - 1)
      updatedProductDetails = values.productDetails.map((item, index) => {
        return index === selectedProduct.id - 1
          ? { ...item, ...newProduct }
          : item;
      });
    } else {
      // Add a new product to the list
      updatedProductDetails = [...values.productDetails, newProduct];
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

  const handleBranchChange = (
    branchId,
    bdIds = values?.bdPerson,
    isEdit = false
  ) => {
    if (branchId) {
      dispatch(getAllBdPersonByBranchId(branchId)).then((res) => {
        if (res?.payload?.data?.bd_persons?.length > 0) {
          let data = res?.payload?.data?.bd_persons?.map((i) => ({
            value: i?.id,
            label: i?.name,
          }));
          setBdOptions(data);
          if (bdIds?.length > 0) {
            let drr = bdIds?.filter((i) =>
              data?.map((itm) => itm?.value)?.includes(i)
            );
            setFieldValue("bdPerson", drr);
            if (!isEdit) {
              setFieldValue("account", "");
            }
          } else {
            setFieldValue("bdPerson", []);
            if (!isEdit) {
              setFieldValue("account", "");
            }
          }
        } else {
          setBdOptions([]);
          setFieldValue("bdPerson", []);
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
    }
  };

  const handeleBdChange = (bdIds) => {
    if (bdIds?.length > 0) {
      dispatch(getAllAccountByBdPersonIds(bdIds)).then((res) => {
        if (res?.payload?.data?.length > 0) {
          let formattedOptions = res?.payload?.data?.map((item) => ({
            value: item?.account_id,
            label: `${item?.account_name} (${item?.account_csn})`,
            bdIds: item?.bd_person_ids,
          }));
          setAccountOption(formattedOptions);
          if (values?.account) {
            let findAccount = formattedOptions?.find(
              (item) => item?.value === values.account
            );
            if (values?.account !== findAccount?.value) {
              setFieldValue("account", "");
            }
          }
        } else {
          setAccountOption([]);
        }
      });
    } else {
      setFieldValue("account", "");
    }
  };

  useEffect(() => {
    if (quotationId) {
      setIsLoading(true);
      dispatch(getQuotationById(quotationId)).then((res) => {
        if (res?.payload?.data) {
          let data = res?.payload?.data;
          setFieldValue("quotationDate", data?.quotation_date);
          setFieldValue("name", data?.name);
          setFieldValue("branch", data?.branch);
          setFieldValue("bdPerson", data?.bd_person);
          setFieldValue("account", data?.account);
          setFieldValue("purchasePaymentTerms", data?.purchase_payment_terms);
          setFieldValue("salesStage", data?.sales_stage);
          setFieldValue("opportunity", data?.opportunity);
          setFieldValue("billingContact", data?.billing_contact);
          setFieldValue("validUntil", data?.valid_until);
          setFieldValue(
            "productDetails",
            data?.product_details?.map((item) => ({
              ...item,
              product_master_label: item?.product_name,
            }))
          );
          setFieldValue("billingAddress", data?.billing_address);
          setFieldValue("billingGSTNumber", data?.billing_gst_no);
          setFieldValue("shippingAddress", data?.shipping_address);
          setFieldValue("shippingGSTNumber", data?.shipping_gst_no);
          setFieldValue("remarks", data?.remarks);
          setFieldValue("is_revised", data?.is_revise);

          handleBranchChange(data?.branch, data?.bd_person, true);
          handeleBdChange(data?.bd_person);
        }
        setIsLoading(false);
      });
    }
  }, [quotationId]);

  return (
    <>
      {quotationId && isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div>
            <div>
              <h5 className="commom-header-title mb-0">Manage New Quotation</h5>
              <span className="common-breadcrum-msg">Add new quotation</span>
            </div>
            <CommonButton
              onClick={() => {
                navigate(routesConstants?.NEW_QUOTATION);
              }}
              type="button"
              className="add-account-btn m-0 mt-3"
            >
              Back
            </CommonButton>
            <div className="add-account-form">
              <h2 className="title">New Quotation Form</h2>
              <form>
                <CommonDatePicker
                  label="Quotation Date"
                  required
                  name="quotationDate"
                  value={values.quotationDate}
                  onChange={(date) => setFieldValue("quotationDate", date)}
                  error={touched.quotationDate && !!errors.quotationDate}
                  errorText={errors.quotationDate}
                />
                <CommonInputTextField
                  labelName="Name"
                  id="name"
                  name="name"
                  className="input"
                  mainDiv="form-group"
                  labelClass="label"
                  value={values.name}
                  placeHolder="Enter name"
                  isInvalid={errors.name && touched.name}
                  errorText={errors.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  requiredText
                />
                <CustomSelect
                  label="Branch"
                  required
                  name="branch"
                  value={branch_list?.filter(
                    (item) => item?.value === values?.branch
                  )}
                  onChange={(selectedOption) => {
                    if (values?.bdPerson?.length > 0 || values?.account) {
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
                  }}
                  options={branch_list}
                  placeholder="Select a Branch"
                  error={errors?.branch && touched?.branch}
                  errorText={errors?.branch}
                  isDisabled={branchListLoading}
                />
                <CustomSelect
                  label="BD Person"
                  required
                  name="bdPerson"
                  isMulti
                  value={bdOptions?.filter((item) =>
                    values?.bdPerson?.includes(item?.value)
                  )}
                  onChange={(selectedOption) => {
                    if (values?.account) {
                      CustomSweetAlert(
                        "Change BD Person?",
                        "Changing the bd person will update the Account based on the selected bd person. Do you want to continue?",
                        "Warning",
                        true,
                        "Yes, Change Bd Person",
                        "Cancel",
                        (result) => {
                          if (result.isConfirmed) {
                            setFieldValue(
                              "bdPerson",
                              selectedOption?.map((item) => item?.value)
                            );
                            let bdIds = selectedOption?.map(
                              (item) => item?.value
                            );
                            handeleBdChange(bdIds);
                          }
                        }
                      );
                    } else {
                      setFieldValue(
                        "bdPerson",
                        selectedOption?.map((item) => item?.value)
                      );
                      let bdIds = selectedOption?.map((item) => item?.value);
                      handeleBdChange(bdIds);
                    }
                  }}
                  options={bdOptions}
                  placeholder="Select a BD Person"
                  error={errors?.bdPerson && touched?.bdPerson}
                  errorText={errors?.bdPerson}
                />
                <div className="quotation_sales">
                  <CustomSelect
                    label="Account"
                    required
                    name="account"
                    value={accountOption?.filter(
                      (item) => item?.value === values?.account
                    )}
                    onChange={(selectedOption) => {
                      CustomSweetAlert(
                        "Account Selection?",
                        "Do you confirm that Account CSN is selected correctly?",
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
                    placeholder="Select a Account"
                    error={errors?.account && touched?.account}
                    errorText={errors?.account}
                  />
                  <AddIcon
                    style={{ marginTop: "1rem", cursor: "pointer" }}
                    onClick={() => {
                      navigate(routesConstants?.ADD_ACCOUNT);
                    }}
                  />
                </div>
                <div className="quotation_sales">
                  <CustomSelect
                    label="Purchase Payment Terms"
                    required
                    name="purchasePaymentTerms"
                    value={purchasedPaymentTerms
                      ?.filter(
                        (item) => item?.id === values?.purchasePaymentTerms
                      )
                      ?.map((item) => ({
                        label: item?.payment_terms,
                        value: item?.id,
                      }))}
                    onChange={(selected) =>
                      setFieldValue("purchasePaymentTerms", selected?.value)
                    }
                    options={purchasedPaymentTerms?.map((item) => ({
                      label: item?.payment_terms,
                      value: item?.id,
                    }))}
                    placeholder="Select purchase payment terms"
                    error={
                      errors.purchasePaymentTerms &&
                      touched.purchasePaymentTerms
                    }
                    errorText={errors?.purchasePaymentTerms}
                    isDisabled={purchasedPaymentTermsLoading}
                  />
                  <AddIcon
                    style={{ marginTop: "1rem", cursor: "pointer" }}
                    onClick={() => {
                      setModal((prev) => ({ ...prev, isOpen: true, type: 2 }));
                    }}
                  />
                </div>
                <div className="quotation_sales">
                  <CustomSelect
                    label="Sales Stage"
                    required
                    name="salesStage"
                    value={salesStage
                      ?.filter((item) => item?.id === values?.salesStage)
                      ?.map((item) => ({
                        label: item?.name,
                        value: item?.id,
                      }))}
                    onChange={(selected) =>
                      setFieldValue("salesStage", selected?.value)
                    }
                    options={salesStage?.map((item) => ({
                      label: item?.name,
                      value: item?.id,
                    }))}
                    placeholder="Select a Sales Stage"
                    error={errors.salesStage && touched.salesStage}
                    errorText={errors.salesStage}
                    isDisabled={salesStageLoading}
                  />
                  <AddIcon
                    style={{ marginTop: "1rem", cursor: "pointer" }}
                    onClick={() => {
                      setModal((prev) => ({ ...prev, isOpen: true, type: 1 }));
                    }}
                  />
                </div>
                <CommonInputTextField
                  labelName="Opportunity name"
                  id="opportunity"
                  name="opportunity"
                  className="input"
                  mainDiv="form-group"
                  labelClass="label"
                  value={values.opportunity}
                  placeHolder="Enter opportunity name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <CommonInputTextField
                  labelName="Billing Contact"
                  id="billingContact"
                  name="billingContact"
                  className="input"
                  mainDiv="form-group"
                  labelClass="label"
                  value={values.billingContact}
                  placeHolder="Enter billing contact"
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  placeHolder="Enter Shipping GST Number"
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
                <CommonDatePicker
                  label="Valid Until"
                  required
                  name="validUntil"
                  value={values?.validUntil}
                  onChange={(date) => setFieldValue("validUntil", date)}
                  error={touched.validUntil && !!errors.validUntil}
                  errorText={errors.validUntil}
                />
                <div className="form-group">
                  <label className="form-label label mb-0">
                    Product Details
                  </label>
                  <div style={{ cursor: "pointer" }}>
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
                            type: 3,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
                <CommonInputTextField
                  labelName="Remarks"
                  id="remarks"
                  name="remarks"
                  className="input"
                  mainDiv="form-group"
                  labelClass="label"
                  placeHolder="Enter Remarks"
                  value={values?.remarks}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="quotation-form-btn">
                  <CommonButton
                    onClick={handleSubmit}
                    type="button"
                    className="add-account-btn"
                    isDisabled={isSubmitting}
                  >
                    {quotationId
                      ? isSubmitting
                        ? "Updatting..."
                        : "Update"
                      : isSubmitting
                      ? "Submitting..."
                      : "Submit"}
                  </CommonButton>
                  {quotationId && (
                    <>
                      {!values?.is_revised && (
                        <CommonButton
                          onClick={() => {
                            setIsRevised(true);
                            handleSubmit();
                          }}
                          type="button"
                          className="add-account-btn"
                        >
                          Revised Quotation
                        </CommonButton>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
          {/* Modal for Stages Sales , Purchased Payment Terms , Product Details */}
          <CommonModal
            title={
              modal?.type === 1
                ? "Add  sales stage"
                : modal?.type === 2
                ? "Add purchased payment terms"
                : "Product Details"
            }
            isOpen={modal?.isOpen}
            handleClose={() => {
              setModal(() => ({
                isOpen: false,
                type: null,
              }));
            }}
            scrollable
            size={modal?.type === 1 || modal?.type === 2 ? "lg" : "xl"}
            isAdd={modal?.type === 3}
            handleAdd={() => {
              setAddProductDetailModal({
                isShow: true,
                selectedProduct: null,
              });
            }}
          >
            {modal?.type === 1 || modal?.type === 2 ? (
              <AddSalesStage setModal={setModal} modal={modal} />
            ) : modal?.type === 3 ? (
              <ProductDetailModal
                data={values?.productDetails?.map((item, idx) => ({
                  ...item,
                  id: idx + 1,
                }))}
                handleDeleteRow={handleDeleteRow}
                handleRowSelect={handleRowSelect}
              />
            ) : (
              <></>
            )}
          </CommonModal>
          {/* Modal for Stages Sales , Purchased Payment Terms , Product Details */}

          {/* Modal For Adding Product */}
          <CommonModal
            isOpen={addProductDetailModal?.isShow}
            title={"Add Product Details"}
            handleClose={() => {
              setAddProductDetailModal({
                isShow: false,
                selectedProduct: null,
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
              data={{
                billingGSTNumber: values?.billingGSTNumber,
                selectedProduct: addProductDetailModal?.selectedProduct,
              }}
              stateCode={stateCode}
              handleAddProductDetail={handleAddProductDetail}
              isRemark={true}
            />
          </CommonModal>
          {/* Modal For Adding Product */}
        </>
      )}
    </>
  );
};

export default AddEditNewQuotation;
