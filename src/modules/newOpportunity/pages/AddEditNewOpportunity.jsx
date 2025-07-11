import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import { getSalesStage } from "@/modules/quotations/slice/quotationSlice";
import { useEffect, useState } from "react";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonModal from "@/components/common/modal/CommonModal";
import { AddSalesStage } from "@/modules/quotations/pages/AddQuotation";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import {
  getAllBdPersonByBranchId,
  getLicenseOptimizationData,
} from "@/modules/licenseOptimization/slice/LicenseOptimizationSlice";
import { addNewOpportunity } from "@/modules/opportunity/slice/opportunitySlice";
import { toast } from "react-toastify";
import routesConstants from "@/routes/routesConstants";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  quotationDate: Yup.string().required("Quotation date is required."),
  name: Yup.string().required("Name is required."),
  generalTotal: Yup.string().required("General total is required."),
  salesStage: Yup.string().required("Sales stage is required."),
  branch: Yup.string().required("Branch is required."),
  account: Yup.string().required("Account is required."),
});

const AddEditNewOpportunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
  });
  const [bdOptions, setBdOptions] = useState([]);
  const [accountOption, setAccountOption] = useState([]);

  const { salesStage, salesStageLoading, branch_list, branchListLoading } =
    useSelector((state) => ({
      salesStage: state?.quotation?.salesStage,
      salesStageLoading: state?.quotation?.salesStageLoading,
      branch_list: state?.insightMetrics?.branchList,
      branchListLoading: state?.insightMetrics?.branchListLoading,
    }));

  useEffect(() => {
    dispatch(getSalesStage());
    dispatch(getAllBranch());
  }, []);

  const initialValues = {
    quotationDate: "",
    name: "",
    branch: "",
    bdPerson: [],
    account: "",
    generalTotal: "",
    salesStage: null,
    opportunity: "",
    billingContact: "",
    validUntil: "",
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
        branch: values?.branch,
        quotation_date: values?.quotationDate,
        name: values?.name,
        general_total: values?.generalTotal,
        sales_stage: values?.salesStage,
        opportunity: values?.opportunity,
        account: values?.account,
        billing_contact: values?.billingContact,
        valid_until: values?.validUntil,
        remarks: values?.remarks,
      };
      setIsSubmitting(true);
      dispatch(addNewOpportunity(payload)).then((res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          toast.success("New Quotation created succesfully.");
          navigate(routesConstants?.NEW_OPPORTUNITY);
          resetForm();
        }
        setIsSubmitting(false);
      });
    },
  });
  const handleBranchChange = (branchId) => {
    if (branchId) {
      dispatch(getAllBdPersonByBranchId(branchId)).then((res) => {
        if (res?.payload?.data?.bd_persons?.length > 0) {
          let data = res?.payload?.data?.bd_persons?.map((i) => ({
            value: i?.id,
            label: i?.name,
          }));
          setBdOptions(data);
          if (values?.bdPerson?.length > 0) {
            let drr = values?.bdPerson?.filter((i) =>
              data?.map((itm) => itm?.value)?.includes(i)
            );
            setFieldValue("bdPerson", drr);
          } else {
            setFieldValue("bdPerson", []);
          }
        } else {
          setBdOptions([]);
          setFieldValue("bdPerson", []);
        }
      });
    } else {
      setAccountOption([]);
    }
  };
  console.log(values?.bdPerson);
  return (
    <>
      <div>
        <div>
          <h5 className="commom-header-title mb-0">Manage New Quotation</h5>
          <span className="common-breadcrum-msg">Add new quotation</span>
        </div>
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
                setFieldValue("branch", selectedOption?.value);
                setFieldValue("account", "");
                handleBranchChange(selectedOption?.value);
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
                setFieldValue(
                  "bdPerson",
                  selectedOption?.map((item) => item?.value)
                );
              }}
              options={bdOptions}
              placeholder="Select a BD Person"
              error={errors?.bdPerson && touched?.bdPerson}
              errorText={errors?.bdPerson}
            />
            <CustomSelect
              label="Account"
              required
              name="account"
              value={accountOption?.filter(
                (item) => item?.value === values?.account
              )}
              onChange={(selectedOption) => {
                setFieldValue("account", selectedOption?.value);
              }}
              options={accountOption}
              placeholder="Select a Account"
              error={errors?.account && touched?.account}
              errorText={errors?.account}
            />
            <CommonInputTextField
              labelName="General Total"
              id="generalTotal"
              name="generalTotal"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              value={values.generalTotal}
              placeHolder="Enter general total"
              isInvalid={errors.generalTotal && touched.generalTotal}
              errorText={errors.generalTotal}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              requiredText
            />
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
                // value={values.salesStage}
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
                  setModal((prev) => ({ ...prev, isOpen: true }));
                }}
              />
            </div>
            <CommonInputTextField
              labelName="Opportunity"
              id="opportunity"
              name="opportunity"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              value={values.opportunity}
              placeHolder="Enter opportunity"
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
            <CommonDatePicker
              label="Valid Until"
              name="validUntil"
              value={values?.validUntil}
              onChange={(date) => setFieldValue("validUntil", date)}
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
            <CommonButton
              onClick={handleSubmit}
              type="button"
              className="add-account-btn"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </CommonButton>
          </form>
        </div>
      </div>
      <CommonModal
        title={"Add  sales stage"}
        isOpen={modal?.isOpen}
        handleClose={() => {
          setModal((prev) => ({
            ...prev,
            isOpen: false,
          }));
        }}
        scrollable
        maxWidth={"450px"}
      >
        <AddSalesStage setModal={setModal} />
      </CommonModal>
    </>
  );
};

export default AddEditNewOpportunity;
