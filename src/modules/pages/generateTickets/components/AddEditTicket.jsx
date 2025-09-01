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
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";

const validationSchema = Yup.object().shape({
  subscripitonReference: Yup.string().required(
    "Subscription reference is required."
  ),
  issueType: Yup.string().required("Issue type is required."),
  priority: Yup.string().required("Priority is required."),
  issueDescription: Yup.string().required("Issue description is required."),
  contect_person_email: Yup.string()
    .trim()
    .transform((v) => (v === "" ? undefined : v)) // treat empty as undefined
    .email("Enter a valid email") // only checks if provided
    .notRequired(),
});

const priorityList = [
  { value: "P1", label: "Critical" },
  { value: "P2", label: "High" },
  { value: "P3", label: "Medium" },
  { value: "P4", label: "Low" },
];
const AddEditTicket = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { subscriptionList, subscriptionListLoading, userDetail } = useSelector(
    (state) => ({
      subscriptionList: state?.pages?.subscriptionList,
      subscriptionListLoading: state?.pages?.subscriptionListLoading,
      userDetail: state?.profile?.userDetail,
    })
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketsIssues, setTicketsIssues] = useState([]);
  const formik = useFormik({
    initialValues: {
      subscripitonReference: null,
      issueType: null,
      priority: null,
      issueDescription: "",
      contact_person_name: "",
      contect_person_phone: null,
      contect_person_email: null,
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
      formData.append("contact_person_name", values?.contact_person_name);
      formData.append("contect_person_phone", values?.contect_person_phone);
      formData.append("contect_person_email", values?.contect_person_email);
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
    handleChange,
    handleBlur,
  } = formik;

  useEffect(() => {
    dispatch(getSubscriptionTicket());
  }, []);

  const handleFetchIssueType = (id) => {
    dispatch(getTicketIssues(id)).then((res) => {
      if (res?.payload?.status === 200) {
        const issues = res?.payload?.data?.map((item) => ({
          ...item,
          value: item?.id,
          label: item?.name,
        }));
        setTicketsIssues(issues);
      }
    });
  };
  return (
    <div className="">
      <form className="pb-5" onSubmit={handleSubmit}>
        <CommonInputTextField
          labelName="Contact Person's Name"
          id="contact_person_name"
          name="contact_person_name"
          className="input"
          // required
          mainDiv="form-group mb-3"
          labelClass="label"
          value={values?.contact_person_name}
          placeHolder="Enter Contact Person's Name"
          onChange={handleChange}
          onBlur={handleBlur}
          // requiredText
        />
        <CommonInputTextField
          labelName="Contact Person's Phone"
          id="contect_person_phone"
          name="contect_person_phone"
          className="input"
          mainDiv="form-group mb-3"
          labelClass="label"
          value={values?.contect_person_phone}
          placeHolder="Enter Contact Person's Phone"
          onChange={handleChange}
          onBlur={handleBlur}
          type="number"
        />
        <CommonInputTextField
          labelName="Contact Person's Email"
          id="contect_person_email"
          name="contect_person_email"
          className="input"
          mainDiv="form-group mb-3"
          labelClass="label"
          value={values?.contect_person_email}
          placeHolder="Enter Contact Person's Email"
          onChange={handleChange}
          isInvalid={
            errors?.contect_person_email && touched?.contect_person_email
          }
          errorText={errors?.contect_person_email}
          onBlur={handleBlur}
        />
        <CustomSelect
          label="Subscripiton Reference"
          required
          name="subscripitonReference"
          value={subscriptionList?.find(
            (i) => i?.value === values?.subscripitonReference
          )}
          onChange={(selectedOption) => {
            setFieldValue("subscripitonReference", selectedOption?.value);
            if (selectedOption?.value) {
              handleFetchIssueType(selectedOption?.value);
            } else {
              setTicketsIssues([]);
            }
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
          // isDisabled={ticketsIssuesLoading}
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
