import CommonButton from "@/components/common/buttons/CommonButton";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import CommonTextareaField from "@/components/common/inputTextField/CommonTextareaField";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  addManageTemplate,
  getManageTemplate,
} from "../slice/ManageTemplateSlice";
import { toast } from "react-toastify";

const AddTemplate = ({ handleClose }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    templateName: Yup.string().required("Template name is required."),
    templateContent: Yup.string().required("Template name is required."),
    reminderDays: Yup.number().typeError("Reminder days must be a number."),
  });
  const initialValues = {
    templateName: "",
    templateContent: "",
    reminderDays: null,
  };
  const onSubmit = (values) => {
    setIsSubmitting(true);
    let payload = {
      name: values?.templateName,
      days: values?.reminderDays,
      content: values?.templateContent,
    };
    dispatch(addManageTemplate(payload)).then((res) => {
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        debugger;
        toast.success("Template added successfully!");
        dispatch(getManageTemplate());
        handleClose();
      }
      setIsSubmitting(false);
    });
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
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });
  return (
    <>
      <form className="add-template-form">
        <CommonInputTextField
          labelName="Template Name"
          id="templateName"
          name="templateName"
          className="input"
          mainDiv="form-group"
          labelClass="label"
          placeHolder="Enter Template Name"
          required
          value={values?.templateName}
          isInvalid={errors?.templateName && touched?.templateName}
          errorText={errors?.templateName}
          onChange={handleChange}
          onBlur={handleBlur}
          requiredText
        />
        <CommonInputTextField
          labelName="Reminder before days"
          id="reminderDays"
          name="reminderDays"
          className="input"
          mainDiv="form-group"
          labelClass="label"
          type="number"
          placeHolder="Enter Reminder before days"
          value={values?.reminderDays}
          isInvalid={errors?.reminderDays && touched?.reminderDays}
          errorText={errors?.reminderDays}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <CommonTextareaField
          labelName="HTML Template Content"
          id="templateContent"
          name="templateContent"
          className="input"
          mainDiv="form-group"
          labelClass="label"
          placeHolder="Enter Template Content"
          required
          value={values?.templateContent}
          isInvalid={errors?.templateContent && touched?.templateContent}
          errorText={errors?.templateContent}
          onChange={handleChange}
          onBlur={handleBlur}
          requiredText
        />
        <CommonButton
          onClick={() => {
            handleSubmit();
          }}
          type="button"
          className="add-template-btn"
          isDisabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </CommonButton>
      </form>
    </>
  );
};
export default AddTemplate;
