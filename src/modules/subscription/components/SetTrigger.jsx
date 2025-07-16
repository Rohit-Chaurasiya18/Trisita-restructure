import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import { AutocompleteField } from "@/modules/accounts/components/AssignUserBranch";
import EmailTagInput from "./EmailTagInput";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

import {
  handleSendQuotation,
  quotationTemplate,
} from "@/modules/newQuotation/slice/quotationSlice";
import { getManageTemplate } from "@/modules/data/manageTemplate/slice/ManageTemplateSlice";
import {
  getTriggeredTemplate,
  handleTriggerTemplate,
} from "../slice/subscriptionSlice";

const SetTrigger = ({ modal, handleClose, isQuotation = false }) => {
  const dispatch = useDispatch();

  // Selectors
  const {
    manageTemplate,
    templatesDataLoading,
    subscriptionTemplateCCEmails,
    subscriptionTemplate,
    subscriptionTemplateLoading,
  } = useSelector((state) => ({
    manageTemplate: isQuotation
      ? state?.quotation?.quotationTemplate
      : state?.manageTemplate?.templatesData,
    templatesDataLoading: isQuotation
      ? state?.quotation?.quotationTemplateLoading
      : state?.manageTemplate?.templatesDataLoading,
    subscriptionTemplateCCEmails:
      state?.subscription?.subscriptionTemplateCCEmails,
    subscriptionTemplate: state?.subscription?.subscriptionTemplate,
    subscriptionTemplateLoading:
      state?.subscription?.subscriptionTemplateLoading,
  }));

  // Initial trigger choices for edit case
  const initialTriggerChoices = useMemo(() => {
    if (!isQuotation && subscriptionTemplate?.length > 0) {
      return manageTemplate?.filter((item) =>
        subscriptionTemplate.includes(item?.value)
      );
    }
    return isQuotation ? null : [];
  }, [manageTemplate, subscriptionTemplate, isQuotation]);

  useEffect(() => {
    if (isQuotation) {
      dispatch(quotationTemplate());
    } else {
      dispatch(getManageTemplate());
      dispatch(getTriggeredTemplate(modal?.id));
    }
  }, [dispatch, modal?.id, isQuotation]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      triggerChoice: initialTriggerChoices,
      cc_emails: subscriptionTemplateCCEmails || [],
    },
    onSubmit: (values) => {
      const payload = {
        trigger_choices_new: isQuotation
          ? values.triggerChoice?.value
          : values.triggerChoice?.map((item) => item?.value),
        id: modal?.id,
        cc_emails: values?.cc_emails,
      };
      console.log(payload);
      const action = isQuotation
        ? handleSendQuotation(payload)
        : handleTriggerTemplate(payload);

      dispatch(action).then((res) => {
        const status = res?.payload?.status;
        const isSuccess = status === 200 || status === 201 || status === 202;

        if (isSuccess) {
          const message = isQuotation
            ? "Quotation sent successfully."
            : "Template triggered successfully.";
          toast.success(message);
          handleClose();
        }
      });
    },
  });

  const handleEmails = (validEmails) => {
    formik.setFieldValue("cc_emails", validEmails);
  };
  return subscriptionTemplateLoading ? (
    <SkeletonLoader />
  ) : (
    <form className="allocate-form" onSubmit={formik.handleSubmit}>
      <AutocompleteField
        label="Trigger Choice"
        name="triggerChoice"
        options={manageTemplate}
        multiple={!isQuotation}
        getOptionLabel={(option) =>
          isQuotation
            ? option?.label
            : `${option?.label || ""} - (${option?.days || "-"})`
        }
        formik={formik}
      />

      <div className="form-group col-10">
        <div className="col-5">
          <label>CC Emails:</label>
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
        {/* Uncomment below if "Clear All" needed */}
        {/* 
        <button
          type="button"
          onClick={() => {
            formik.setFieldValue("triggerChoice", []);
            formik.setFieldValue("cc_emails", []);
          }}
          className="btn btn-secondary"
        >
          CLEAR ALL
        </button> 
        */}
      </div>
    </form>
  );
};

export default SetTrigger;
