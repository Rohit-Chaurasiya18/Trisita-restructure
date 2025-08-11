import CommonTextareaField from "@/components/common/inputTextField/CommonTextareaField";
import EmailTagInput from "@/modules/subscription/components/EmailTagInput";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { addSetContent } from "../slice/CampaignSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const SetContent = ({ modal, handleClose }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      cc_emails: [],
      phone: "",
    },
    onSubmit: (values) => {
      let payload = {
        id: modal?.id,
        email_ids: values?.cc_emails,
        phone_no: values?.phone,
      };
      dispatch(addSetContent(payload)).then((res) => {
        if (res?.payload?.status === 200) {
          toast.success("Content set successfully!");
          handleClose();
        }
      });
    },
  });

  const handleEmails = (validEmails) => {
    formik.setFieldValue("cc_emails", validEmails);
  };

  useEffect(() => {
    if (modal?.data?.email_ids?.length > 0) {
      formik.setFieldValue("cc_emails", modal?.data?.email_ids);
    } else {
      formik.setFieldValue("cc_emails", [modal?.data?.contract_manager_email]);
    }
    if (modal?.data?.phone_no) {
      formik.setFieldValue("phone", modal?.data?.phone_no);
    }
  }, [modal?.data]);
  return (
    <>
      <form className="allocate-form" onSubmit={formik.handleSubmit}>
        <div className="form-group col-10">
          <div className="col-5">
            <label>CC Emails:</label>
          </div>
          <div className="col-5">
            <EmailTagInput
              handleEmails={handleEmails}
              initialEmails={
                modal?.data?.email_ids?.length > 0
                  ? modal?.data?.email_ids
                  : [modal?.data?.contract_manager_email]
              }
            />
          </div>
        </div>
        <div className="form-group col-10">
          <div className="col-5">
            <label>Phones:</label>
          </div>
          <div className="col-5">
            <CommonTextareaField
              name="phone"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Phone"
              value={formik.values?.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        <div className="form-group col-12 justify-content-center mt-4 gap-4">
          <button type="submit" className="btn btn-primary">
            ALLOCATE
          </button>
        </div>
      </form>
    </>
  );
};

export default SetContent;
