import CustomSweetAlert from "@/components/common/customSweetAlert/CustomSweetAlert";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import {
  getAllAccountByBdPersonIds,
  getAllBdPersonByBranchId,
} from "@/modules/licenseOptimization/slice/LicenseOptimizationSlice";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import routesConstants from "@/routes/routesConstants";
import { useNavigate, useParams } from "react-router-dom";
import { getActiveProductMaster } from "@/modules/orderLoadingApi/slice/OrderLoadingApiSlice";
import { getProductMasterById } from "@/modules/data/product/slice/ProductSlice";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { getSalesStage } from "@/modules/newQuotation/slice/quotationSlice";
import { AddSalesStage } from "@/modules/newQuotation/pages/AddEditNewQuotation";
import CommonModal from "@/components/common/modal/CommonModal";
import CommonButton from "@/components/common/buttons/CommonButton";
import {
  addNewOpportunityData,
  getNewOpportunityById,
  updateNewOpportunityData,
} from "@/modules/opportunity/slice/opportunitySlice";
import { toast } from "react-toastify";

const opportunityCategoryList = [
  { value: "BD", label: "BD" },
  { value: "LC", label: "LC" },
  { value: "ROR", label: "ROR" },
];
const opportunityTypeList = [
  { value: "New", label: "New" },
  { value: "Renewal", label: "Renewal" },
  { value: "Non ROR renewal", label: "Non ROR renewal" },
];
const quarterChoice = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
];
const monthsChoice = [
  { value: "M1", label: "M1" },
  { value: "M2", label: "M2" },
  { value: "M3", label: "M3" },
];
const weeksChoice = [
  { value: "W1", label: "W1" },
  { value: "W2", label: "W2" },
  { value: "W3", label: "W3" },
  { value: "W4", label: "W4" },
];

const validationSchema = Yup.object({
  opportunityDate: Yup.string().required("Proposal date is required."),
  branch: Yup.string().required("Branch is required."),
  account: Yup.string().required("Account is required."),
  opportunityCategory: Yup.string().required(
    "Opportunity category is required."
  ),
  opportunityType: Yup.string().required("Opportunity type is required."),
  salesStage: Yup.string().required("Sales stage is required."),
  salesUpdatedDate: Yup.string().required("Sales update date is required."),
  quarter: Yup.string().required("Quarter type is required."),
  month: Yup.string().required("Month type is required."),
  week: Yup.string().required("Week type is required."),
  productMaster: Yup.string().required("Product master is required."),
  quantity: Yup.number()
    .required("Quantity is required.")
    .positive("Quantity must be a positive number.")
    .integer("Quantity must be an integer."),
  lastQuotedPrice: Yup.number()
    .required("Last quoted price is required.")
    .positive("Last quoted price must be a positive number.")
    .integer("Last quoted price must be an integer."),
  bdPerson: Yup.array()
    .of(Yup.mixed()) // or Yup.number(), Yup.string(), depending on type
    .min(1, "At least one value must be selected.")
    .required("This field is required."),
});

const AddEditNewOpportunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { opportunityId } = useParams();
  const {
    branch_list,
    branchListLoading,
    activeProductMasterLoading,
    activeProductMaster,
    salesStageList,
    salesStageListLoading,
  } = useSelector((state) => ({
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    activeProductMasterLoading:
      state?.orderLoadingApi?.activeProductMasterLoading,
    activeProductMaster: state?.orderLoadingApi?.activeProductMaster,
    salesStageList: state?.quotation?.salesStage,
    salesStageListLoading: state?.quotation?.salesStageLoading,
  }));
  const [bdOptions, setBdOptions] = useState([]);
  const [accountOption, setAccountOption] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
  });

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getActiveProductMaster());
    dispatch(getSalesStage());
  }, []);

  const initialValues = {
    opportunityDate: "",
    branch: "",
    bdPerson: [],
    account: "",
    opportunityCategory: "",
    opportunityType: "",
    salesStage: null,
    salesUpdatedDate: "",
    year: {
      value: `FY${(new Date().getFullYear() + 1).toString().slice(-2)}`,
      label: `FY${(new Date().getFullYear() + 1).toString().slice(-2)}`,
    },
    quarter: "",
    month: "",
    week: "",
    productMaster: "",
    acv_price: 0,
    dtp_price: 0,
    quantity: null,
    lastQuotedPrice: null,
    remarks: "",
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
        contract_date: values?.opportunityDate,
        branch: values?.branch,
        bd_person: values?.bdPerson,
        account: values?.account,
        product_master: values?.productMaster,
        quantity: values?.quantity,
        last_quoated_price: values?.lastQuotedPrice,
        opportunity_category: values?.opportunityCategory,
        opportunity_type: values?.opportunityType,
        salse_stage: values?.salesStage,
        quater: values?.quarter,
        month: values?.month,
        week: values?.week,
        sales_update_date: values?.salesUpdatedDate,
        remarks: values?.remarks,
      };
      setIsSubmitting(true);
      if (opportunityId && !isCreateNew) {
        // If opportunityId exists and isCreateNew is false, update the existing opportunity
        dispatch(
          updateNewOpportunityData({ ...payload, id: opportunityId })
        ).then((res) => {
          if (res?.payload?.status === 200 || res?.payload?.status === 201) {
            resetForm();
            toast.success("New opportunity updated successfully.");
            navigate(routesConstants?.NEW_OPPORTUNITY);
          }
          setIsSubmitting(false);
        });
      } else {
        dispatch(addNewOpportunityData(payload)).then((res) => {
          if (res?.payload?.status === 200 || res?.payload?.status === 201) {
            resetForm();
            toast.success("New opportunity added successfully.");
            navigate(routesConstants?.NEW_OPPORTUNITY);
          }
          setIsSubmitting(false);
        });
      }
    },
  });

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
    if (opportunityId) {
      dispatch(getNewOpportunityById(opportunityId)).then((res) => {
        if (res?.payload?.data) {
          let opportunityData = res?.payload?.data;
          setFieldValue("opportunityDate", opportunityData?.contract_date);
          setFieldValue("branch", opportunityData?.branch);
          setFieldValue("bdPerson", opportunityData?.bd_person_ids);
          setFieldValue("account", opportunityData?.account);
          setFieldValue(
            "opportunityCategory",
            opportunityData?.opportunity_category
          );
          setFieldValue("opportunityType", opportunityData?.opportunity_type);
          setFieldValue("salesStage", opportunityData?.salse_stage);
          setFieldValue("salesUpdatedDate", opportunityData?.sales_update_date);
          setFieldValue("quarter", opportunityData?.quater);
          setFieldValue("month", opportunityData?.month);
          setFieldValue("week", opportunityData?.week);
          setFieldValue("productMaster", opportunityData?.product_master);
          setFieldValue("acv_price", opportunityData?.acv_price_decimal);
          setFieldValue("dtp_price", opportunityData?.dtp_price_decimal);
          setFieldValue("quantity", opportunityData?.quantity);
          setFieldValue("lastQuotedPrice", opportunityData?.last_quoated_price);
          setFieldValue("remarks", opportunityData?.remarks);
          setFieldValue("dtp_price", opportunityData?.dtp_price);
          setFieldValue("acv_price", opportunityData?.acv_price);

          handleBranchChange(
            opportunityData?.branch,
            opportunityData?.bd_person_ids,
            true
          );
          handeleBdChange(opportunityData?.bd_person_ids);
        }
      });
    }
  }, [opportunityId]);
  return (
    <>
      <div>
        <h5 className="commom-header-title mb-0">Manage New Opportunity</h5>
        <span className="common-breadcrum-msg">Add new opportunity</span>
      </div>
      <div className="add-account-form">
        <h2 className="title">New Opportunity Form</h2>
        <form>
          <CommonDatePicker
            label="Opportunity Date"
            required
            name="opportunityDate"
            value={values.opportunityDate}
            onChange={(date) => setFieldValue("opportunityDate", date)}
            error={touched.opportunityDate && !!errors.opportunityDate}
            errorText={errors.opportunityDate}
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
                      let bdIds = selectedOption?.map((item) => item?.value);
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
          <CustomSelect
            label="Opportunity Category"
            required
            name="opportunityCategory"
            value={opportunityCategoryList?.filter(
              (item) => item?.value === values?.opportunityCategory
            )}
            onChange={(selectedOption) => {
              setFieldValue("opportunityCategory", selectedOption?.value);
            }}
            options={opportunityCategoryList}
            placeholder="Select a Opportunity Category"
            error={errors?.opportunityCategory && touched?.opportunityCategory}
            errorText={errors?.opportunityCategory}
          />
          <CustomSelect
            label="Opportunity Type"
            required
            name="opportunityType"
            value={opportunityTypeList?.filter(
              (item) => item?.value === values?.opportunityType
            )}
            onChange={(selectedOption) => {
              setFieldValue("opportunityType", selectedOption?.value);
            }}
            options={opportunityTypeList}
            placeholder="Select a Opportunity Type"
            error={errors?.opportunityType && touched?.opportunityType}
            errorText={errors?.opportunityType}
          />
          <div className="quotation_sales">
            <CustomSelect
              label="Sales Stage"
              required
              name="salesStage"
              value={salesStageList
                ?.filter((item) => item?.id === values?.salesStage)
                ?.map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
              onChange={(selected) =>
                setFieldValue("salesStage", selected?.value)
              }
              options={salesStageList?.map((item) => ({
                label: item?.name,
                value: item?.id,
              }))}
              placeholder="Select a Sales Stage"
              error={errors.salesStage && touched.salesStage}
              errorText={errors.salesStage}
              isDisabled={salesStageListLoading}
            />
            <AddIcon
              style={{ marginTop: "1rem", cursor: "pointer" }}
              onClick={() => {
                setModal((prev) => ({ ...prev, isOpen: true, type: 1 }));
              }}
            />
          </div>
          <CommonDatePicker
            label="Closure Date"
            required
            name="salesUpdatedDate"
            value={values.salesUpdatedDate}
            onChange={(date) => setFieldValue("salesUpdatedDate", date)}
            error={touched.salesUpdatedDate && !!errors.salesUpdatedDate}
            errorText={errors.salesUpdatedDate}
          />
          <div className="form-group">
            <label className="form-label label mb-0 requiredText">
              OEM Quarter <span style={{ color: "red" }}> *</span>
            </label>
            <div className="mt-2 d-flex gap-2">
              <CustomSelect value={values?.year} isDisabled />
              <CustomSelect
                name="quarter"
                value={quarterChoice?.filter(
                  (item) => item?.value === values?.quarter
                )}
                onChange={(selectedOption) => {
                  setFieldValue("quarter", selectedOption?.value);
                }}
                options={quarterChoice}
                error={errors?.quarter && touched?.quarter}
                errorText={errors?.quarter}
                placeholder="Select Quarter"
                required
              />
              <CustomSelect
                name="month"
                value={monthsChoice?.filter(
                  (item) => item?.value === values?.month
                )}
                onChange={(selectedOption) => {
                  setFieldValue("month", selectedOption?.value);
                }}
                options={monthsChoice}
                placeholder="Select Month"
                error={errors?.month && touched?.month}
                errorText={errors?.month}
                required
              />
              <CustomSelect
                required
                name="week"
                value={weeksChoice?.filter(
                  (item) => item?.value === values?.week
                )}
                onChange={(selectedOption) => {
                  setFieldValue("week", selectedOption?.value);
                }}
                options={weeksChoice}
                placeholder="Select Week"
                error={errors?.week && touched?.week}
                errorText={errors?.week}
              />
            </div>
          </div>
          <CustomSelect
            label="Product Master"
            required
            name="productMaster"
            value={activeProductMaster?.filter(
              (item) => item?.value === values?.productMaster
            )}
            onChange={(selectedOption) => {
              setFieldValue("productMaster", selectedOption?.value);
              dispatch(getProductMasterById(selectedOption?.value)).then(
                (res) => {
                  if (res?.payload?.data?.product_master) {
                    let acvPrice =
                      res?.payload?.data?.product_master?.acv_price_decimal;
                    let dtpPrice =
                      res?.payload?.data?.product_master?.dtp_price_decimal;
                    setFieldValue("acv_price", Number(acvPrice));
                    setFieldValue("dtp_price", Number(dtpPrice));
                  }
                }
              );
            }}
            options={activeProductMaster}
            placeholder="Select a Product Master"
            error={errors?.productMaster && touched?.productMaster}
            errorText={errors?.productMaster}
            isDisabled={activeProductMasterLoading}
          />
          <CommonInputTextField
            labelName="Quantity"
            id="quantity"
            name="quantity"
            className="input"
            mainDiv="form-group"
            type="number"
            placeHolder="Enter Quantity"
            value={values?.quantity}
            isInvalid={errors?.quantity && touched?.quantity}
            errorText={errors?.quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            min={1}
            requiredText
            required
          />
          <CommonInputTextField
            labelName="ACV Price"
            className="input"
            mainDiv="form-group"
            type="number"
            value={values?.acv_price}
            isDisabled
          />
          <CommonInputTextField
            labelName="ACV Total"
            className="input"
            mainDiv="form-group"
            type="number"
            value={values?.acv_price * values?.quantity}
            isDisabled
          />
          <CommonInputTextField
            labelName="DTP Price"
            className="input"
            mainDiv="form-group"
            type="number"
            value={values?.dtp_price}
            isDisabled
          />
          <CommonInputTextField
            labelName="DTP Total"
            className="input"
            mainDiv="form-group"
            type="number"
            value={values?.dtp_price * values?.quantity}
            isDisabled
          />
          <CommonInputTextField
            labelName="Last Quoted Price"
            id="lastQuotedPrice"
            name="lastQuotedPrice"
            className="input"
            mainDiv="form-group"
            type="number"
            placeHolder="Enter Last Quoted Price"
            value={values?.lastQuotedPrice}
            isInvalid={errors?.lastQuotedPrice && touched?.lastQuotedPrice}
            errorText={errors?.lastQuotedPrice}
            onChange={handleChange}
            onBlur={handleBlur}
            min={1}
            requiredText
            required
          />
          <CommonInputTextField
            labelName="Last Quoted Price Total"
            className="input"
            mainDiv="form-group"
            type="number"
            value={values?.lastQuotedPrice * values?.quantity}
            isDisabled
          />
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
              onClick={() => {
                setIsCreateNew(false);
                handleSubmit();
              }}
              type="button"
              className="add-account-btn"
              isDisabled={isSubmitting}
            >
              {opportunityId
                ? isSubmitting
                  ? "Updatting..."
                  : "Update existing"
                : isSubmitting
                ? "Submitting..."
                : "Submit"}
            </CommonButton>
            {opportunityId && <CommonButton
              onClick={() => {
                setIsCreateNew(true);
                handleSubmit();
              }}
              type="button"
              className="add-account-btn"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Creating New" : "Create New"}
            </CommonButton>}
          </div>
        </form>
      </div>
      <CommonModal
        title={"Add  sales stage"}
        isOpen={modal?.isOpen}
        handleClose={() => {
          setModal(() => ({
            isOpen: false,
            type: null,
          }));
        }}
        scrollable
      >
        <AddSalesStage setModal={setModal} modal={modal} />
      </CommonModal>
    </>
  );
};

export default AddEditNewOpportunity;
