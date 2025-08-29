import CustomSelect from "@/components/common/dropdown/CustomSelect";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateTicket,
  getSubscriptionTicket,
  getTicketIssues,
} from "../../slice";
import CommonTextareaField from "@/components/common/inputTextField/CommonTextareaField";
import { toast } from "react-toastify";
import ImageVideoDropzone from "./ImageVideoDropzone";

const validationSchema = Yup.object().shape({
  subscripitonReference: Yup.string().required(
    "Subscription reference is required."
  ),
  issueType: Yup.string().required("Issue type is required."),
  priority: Yup.string().required("Priority is required."),
  issueDescription: Yup.string().required("Issue description is required."),
});

const priorityList = [
  { value: "P1", label: "Critical" },
  { value: "P2", label: "High" },
  { value: "P3", label: "Medium" },
  { value: "P4", label: "Low" },
];
const AddEditTicket = ({ handleClose }) => {
  const dispatch = useDispatch();
  const {
    ticketsIssues,
    ticketsIssuesLoading,
    subscriptionList,
    subscriptionListLoading,
    userDetail,
  } = useSelector((state) => ({
    ticketsIssues: state?.pages?.ticketsIssues,
    ticketsIssuesLoading: state?.pages?.ticketsIssuesLoading,
    subscriptionList: state?.pages?.subscriptionList,
    subscriptionListLoading: state?.pages?.subscriptionListLoading,
    userDetail: state?.profile?.userDetail,
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      subscripitonReference: null,
      issueType: null,
      priority: null,
      issueDescription: "",
      files: [],
    },
    validationSchema,
    onSubmit: (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("ticket_raised_by", userDetail?.id);
      formData.append("issue", values?.issueType);
      formData.append("message", values?.issueDescription);
      formData.append("priority", values?.priority);
      values?.files?.map((file, index) => formData.append(`ticketimage`, file));
      formData.append("subscription", values?.subscripitonReference);
      dispatch(generateTicket(formData)).then((res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          toast.success("Ticket generated successfully!");
          dispatch(getTicketIssues());
          handleClose();
        }
        setIsSubmitting(false);
      });
    },
  });
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
  } = formik;

  useEffect(() => {
    dispatch(getTicketIssues());
    dispatch(getSubscriptionTicket());
  }, []);
  console.log(values?.files?.map((file) => URL.createObjectURL(file)));

  return (
    <div className="">
      <form className="pb-5" onSubmit={handleSubmit}>
        <CustomSelect
          label="Subscripiton Reference"
          required
          name="subscripitonReference"
          value={subscriptionList?.find(
            (i) => i?.value === values?.subscripitonReference
          )}
          onChange={(selectedOption) => {
            setFieldValue("subscripitonReference", selectedOption?.value);
          }}
          options={subscriptionList}
          placeholder="Select a subscription reference"
          error={
            errors?.subscripitonReference && touched?.subscripitonReference
          }
          errorText={errors.subscripitonReference}
          isDisabled={subscriptionListLoading}
        />
        <CustomSelect
          label="Issue Type"
          required
          name="issueType"
          value={ticketsIssues?.find((i) => i?.value === values?.issueType)}
          onChange={(selectedOption) => {
            setFieldValue("issueType", selectedOption?.value);
          }}
          options={ticketsIssues}
          placeholder="Select a issue"
          error={errors?.issueType && touched?.issueType}
          errorText={errors.issueType}
          isDisabled={ticketsIssuesLoading}
        />
        <CustomSelect
          label="Priority"
          required
          name="priority"
          value={priorityList?.find((i) => i?.value === values?.priority)}
          onChange={(selectedOption) => {
            setFieldValue("priority", selectedOption?.value);
          }}
          options={priorityList}
          placeholder="Select a priority"
          error={errors?.priority && touched?.priority}
          errorText={errors.priority}
        />
        <CommonTextareaField
          labelName="Issue Description"
          id="issueDescription"
          name="issueDescription"
          className="input"
          mainDiv="form-group mb-3"
          labelClass="label"
          placeHolder="Enter Issue Description"
          required
          value={values?.issueDescription}
          isInvalid={errors?.issueDescription && touched?.issueDescription}
          errorText={errors?.issueDescription}
          onChange={(e) => {
            setFieldValue("issueDescription", e.target.value);
          }}
          requiredText
        />
        <ImageVideoDropzone
          value={values?.files}
          onChange={(files) => setFieldValue("files", files)}
        />
        <button
          type="submit"
          className={`btn btn-${
            isSubmitting ? "secondary" : "primary"
          } mt-3 mx-auto d-flex`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddEditTicket;
