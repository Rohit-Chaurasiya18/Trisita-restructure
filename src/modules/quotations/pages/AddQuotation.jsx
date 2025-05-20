import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  addQuotation,
  addSalesStage,
  getSalesStage,
} from "../slice/quotationSlice";
import AddIcon from "@mui/icons-material/Add";
import CommonModal from "@/components/common/modal/CommonModal";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import routesConstants from "@/routes/routesConstants";

const validationSchema = Yup.object({
  quotationDate: Yup.string().required("Quotation date is required."),
  quotationNumber: Yup.string().required("Quotation number is required."),
  name: Yup.string().required("Name is required."),
  generalTotal: Yup.string().required("General total is required."),
  salesStage: Yup.object().required("Sales stage is required."),
});

const AddSalesStage = ({ setModal }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      initialValues: {
        salesStage: "",
      },
      validationSchema: Yup.object({
        salesStage: Yup.string().required("Sales stage is required."),
      }),
      onSubmit: (values) => {
        setIsSubmitting(true);
        dispatch(addSalesStage({ name: values?.salesStage })).then((res) => {
          if (res?.payload?.status === 200 || res?.payload?.status === 201) {
            toast.success("Sales stage created successfully.");
            setModal((prev) => ({ ...prev, isOpen: false }));
          }
          dispatch(getSalesStage());
          setIsSubmitting(false);
        });
      },
    });

  return (
    <div className="add-sales-stage-form">
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
const AddQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { salesStage, salesStageLoading } = useSelector((state) => ({
    salesStage: state?.quotation?.salesStage,
    salesStageLoading: state?.quotation?.salesStageLoading,
  }));
  const [modal, setModal] = useState({
    isOpen: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getSalesStage());
  }, []);

  const initialValues = {
    quotationDate: "",
    quotationNumber: "",
    name: "",
    generalTotal: "",
    salesStage: null,
    opportunity: "",
    account: "",
    billingContact: "",
    validUntil: "",
    updatedBy: "",
    createdBy: "",
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
      setIsSubmitting(true);
      const requestData = {
        quotation_date: moment(values?.quotationDate).format("YYYY-MM-DD"),
        quotation_no: values?.quotationNumber,
        name: values?.name,
        general_total: values?.generalTotal,
        sales_stage: values?.salesStage?.value,
        opportunity: values?.opportunity,
        account: values?.account,
        billing_contact: values?.billingContact,
        valid_until: moment(values?.validUntil).format("YYYY-MM-DD"),
        updated_by: values?.updatedBy,
        created_by: values?.createdBy,
      };
      dispatch(addQuotation(requestData)).then((res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          toast.success("Quotation created succesfully.");
          navigate(routesConstants?.QUOTATION);
          resetForm();
        }
        setIsSubmitting(false);
      });
    },
  });

  return (
    <>
      <div>
        <div>
          <h5 className="commom-header-title mb-0">Product Master</h5>
          <span className="common-breadcrum-msg">Add quotation</span>
        </div>
        <div className="add-account-form">
          <h2 className="title">Quotation Form</h2>
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
              labelName="Quotation Number"
              id="quotationNumber"
              name="quotationNumber"
              className="input"
              required
              requiredText
              mainDiv="form-group"
              labelClass="label"
              value={values.quotationNumber}
              placeHolder="Enter quotation number"
              isInvalid={errors.quotationNumber && touched.quotationNumber}
              errorText={errors.quotationNumber}
              onChange={handleChange}
              onBlur={handleBlur}
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
                value={values.salesStage}
                onChange={(selected) => setFieldValue("salesStage", selected)}
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
              labelName="Account"
              id="account"
              name="account"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              value={values.account}
              placeHolder="Enter account"
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
              labelName="Updated By"
              id="updatedBy"
              name="updatedBy"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              value={values.updatedBy}
              placeHolder="Enter updated by"
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <CommonInputTextField
              labelName="Created By"
              id="createdBy"
              name="createdBy"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              value={values.createdBy}
              placeHolder="Enter created by"
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
        title={"Add quotation sales stage"}
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

export default AddQuotation;
