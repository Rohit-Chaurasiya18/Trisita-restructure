import { AutocompleteField } from "@/modules/accounts/components/AssignUserBranch";
import { getManageTemplate } from "@/modules/data/manageTemplate/slice/ManageTemplateSlice";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTriggeredTemplate,
  handleTriggerTemplate,
} from "../slice/subscriptionSlice";
import { toast } from "react-toastify";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

const SetTrigger = ({ modal, handleClose }) => {
  const dispatch = useDispatch();
  const {
    manageTemplate,
    templatesDataLoading,
    subscriptionTemplate,
    subscriptionTemplateLoading,
  } = useSelector((state) => ({
    manageTemplate: state?.manageTemplate?.templatesData,
    templatesDataLoading: state?.manageTemplate?.templatesDataLoading,
    subscriptionTemplate: state?.subscription?.subscriptionTemplate,
    subscriptionTemplateLoading:
      state?.subscription?.subscriptionTemplateLoading,
  }));

  useEffect(() => {
    dispatch(getManageTemplate());
    dispatch(getTriggeredTemplate(modal?.id)).then((res) => {
    });
  }, [modal?.id]);

  console.log({
    subscriptionTemplate,
    manageTemplate,
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      triggerChoice:
        subscriptionTemplate?.length > 0
          ? manageTemplate?.filter((item) =>
              subscriptionTemplate?.includes(item?.value)
            )
          : [],
    },
    onSubmit: (values) => {
      let payload = {
        trigger_choices_new: values?.triggerChoice?.map((item) => item?.value),
        id: modal?.id,
      };
      dispatch(handleTriggerTemplate(payload)).then((res) => {
        if (res?.payload?.status === 201 || res?.payload?.status === 200) {
          toast.success("Template triggered successfully.");
          handleClose();
        }
      });
    },
  });
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
          <div className="form-group col-12 justify-content-center mt-4">
            <button type="submit" className="btn btn-primary">
              ALLOCATE
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SetTrigger;
