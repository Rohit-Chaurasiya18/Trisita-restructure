import { AutocompleteField } from "@/modules/accounts/components/AssignUserBranch";
import { getManageTemplate } from "@/modules/data/manageTemplate/slice/ManageTemplateSlice";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTriggeredTemplate,
  handleTriggerTemplate,
} from "../slice/subscriptionSlice";
import { toast } from "react-toastify";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import EmailTagInput from "./EmailTagInput";

const SetTrigger = ({ modal, handleClose }) => {
  const dispatch = useDispatch();
  const {
    manageTemplate,
    templatesDataLoading,
    subscriptionTemplateCCEmails,
    subscriptionTemplate,
    subscriptionTemplateLoading,
  } = useSelector((state) => ({
    manageTemplate: state?.manageTemplate?.templatesData,
    templatesDataLoading: state?.manageTemplate?.templatesDataLoading,
    subscriptionTemplateCCEmails:
      state?.subscription?.subscriptionTemplateCCEmails,
    subscriptionTemplate: state?.subscription?.subscriptionTemplate,
    subscriptionTemplateLoading:
      state?.subscription?.subscriptionTemplateLoading,
  }));
  const [resetTrigger, setResetTrigger] = useState(false);

  useEffect(() => {
    dispatch(getManageTemplate());
    dispatch(getTriggeredTemplate(modal?.id)).then((res) => {});
  }, [modal?.id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      triggerChoice:
        subscriptionTemplate?.length > 0
          ? manageTemplate?.filter((item) =>
              subscriptionTemplate?.includes(item?.value)
            )
          : [],
      cc_emails: [],
    },
    onSubmit: (values) => {
      let payload = {
        trigger_choices_new: values?.triggerChoice?.map((item) => item?.value),
        id: modal?.id,
        cc_emails: values?.cc_emails,
      };
      dispatch(handleTriggerTemplate(payload)).then((res) => {
        if (res?.payload?.status === 201 || res?.payload?.status === 200) {
          toast.success("Template triggered successfully.");
          handleClose();
        }
      });
    },
  });
  const handleEmails = (validEmails) => {
    formik.setFieldValue("cc_emails", validEmails);
  };

  const handleClear = () => {
    formik.setFieldValue("triggerChoice", []);
    formik.setFieldValue("cc_emails", []);
  };

  return (
    <>
      {subscriptionTemplateLoading ? (
        <SkeletonLoader />
      ) : (
        <form className="allocate-form" onSubmit={formik.handleSubmit}>
          <AutocompleteField
            label="Trigger Choice"
            name="triggerChoice"
            options={manageTemplate}
            multiple
            getOptionLabel={(option) =>
              `${option?.label || ""} -  (${option?.days || "-"})`
            }
            formik={formik}
          />
          <div className="form-group col-10">
            <div className="col-5">
              <label>CC Emails :</label>
            </div>
            <div className="col-5">
              <EmailTagInput
                handleEmails={handleEmails}
                initialEmails={subscriptionTemplateCCEmails}
              />
            </div>
          </div>
          <div className="form-group col-12 justify-content-center mt-4 gap-4">
            <button type="submit" className="btn btn-primary">
              ALLOCATE
            </button>
            {/* <button
              onClick={handleClear}
              className="btn btn-primary"
              type="button"
            >
              CLEAR ALL
            </button> */}
          </div>
        </form>
      )}
    </>
  );
};

export default SetTrigger;
