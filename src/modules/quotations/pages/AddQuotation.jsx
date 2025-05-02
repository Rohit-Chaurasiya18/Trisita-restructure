import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddQuotation = () => {
  const validationSchema = Yup.object({
    quotationDate: Yup.string().required("Quotation date is required."),
    quotationNumber: Yup.string().required("Quotation number is required."),
    name: Yup.string().required("Name is required."),
    generalTotal: Yup.string().required("General total is required."),
    salesStage: Yup.object().required("Sales stage is required."),
  });

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
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log("Submit", values);
    },
  });

  return (
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

          <CustomSelect
            label="Sales Stage"
            required
            name="salesStage"
            value={values.salesStage}
            onChange={(selected) => setFieldValue("salesStage", selected)}
            options={[
              { value: "1", label: "Stage 1" },
              { value: "2", label: "Stage 2" },
            ]}
            placeholder="Select a Sales Stage"
            error={errors.salesStage && touched.salesStage}
            errorText={errors.salesStage}
          />

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

          <CommonInputTextField
            labelName="Valid Until"
            id="validUntil"
            name="validUntil"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values.validUntil}
            placeHolder="Enter valid until"
            onChange={handleChange}
            onBlur={handleBlur}
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
          >
            Submit
          </CommonButton>
        </form>
      </div>
    </div>
  );
};

export default AddQuotation;
