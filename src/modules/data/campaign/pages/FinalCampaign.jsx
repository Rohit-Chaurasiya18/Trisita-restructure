import { useLocation, useNavigate } from "react-router-dom";
import { accordionData } from "../../manageTemplate/constants";
import CommonAccordion from "@/components/common/CommonAccordion";
import { useFormik } from "formik";
import * as Yup from "yup";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonModal from "@/components/common/modal/CommonModal";
import AddTemplate from "../../manageTemplate/components/AddTemplate";
import { getManageTemplate } from "../../manageTemplate/slice/ManageTemplateSlice";
import CommonButton from "@/components/common/buttons/CommonButton";
import { campaignSend } from "../slice/CampaignSlice";
import CustomSweetAlert from "@/components/common/customSweetAlert/CustomSweetAlert";
import routesConstants from "@/routes/routesConstants";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";

const FinalCampaign = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { branch_list } = useSelector((state) => ({
    branch_list: state?.insightMetrics?.branchList,
  }));

  const [templateList, setTemplateList] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    content: "",
  });
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    subject: Yup.string().required("Subject is required."),
    template: Yup.object().required("Template is required."),
  });
  const initialValues = {
    subject: "",
    template: null,
  };

  const onSubmit = (values) => {
    const requestData = {
      selected_row: state?.selected_rows,
      subject: values?.subject || null,
      campaign_message: content || null,
    };

    CustomSweetAlert(
      "Run Campaign?",
      `Are you sure you want to proceed with sending the campaign to ${state?.selected_rows?.length} recipients?`,
      "Warning",
      true,
      "Yes, Run Campaign",
      "Cancel",
      (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          dispatch(campaignSend(requestData)).then((res) => {
            if (res?.payload?.status === 200 || res?.payload?.status === 201) {
              navigate(routesConstants?.CAMPAIGN_HISTORY);
            }
            setLoading(false);
          });
        }
      }
    );
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

  const handleTemplateList = () => {
    dispatch(getManageTemplate({ isDays: false })).then((res) => {
      let arr = res?.payload?.data;
      if (arr?.length > 0) {
        setTemplateList([
          { value: "new", label: "Add New Template" },
          ...(res?.payload?.data?.map((item) => ({
            value: item?.id,
            label: item?.name,
            content: item?.content,
          })) || []),
        ]);
      } else {
        setTemplateList([]);
      }
    });
  };

  useEffect(() => {
    handleTemplateList();
    dispatch(getAllBranch());
  }, []);

  return (
    <>
      <div className="manage-template-container">
        <div className="manage-team-header">
          <div className="commom-header-title mb-0">Campaign Page</div>
          <span className="common-breadcrum-msg">
            Welcome to you campaign page
          </span>
        </div>
        <div className="manage-template-detail">
          <div className="manage-template-form">
            <h4>Selected Data</h4>
            <div className="final-campaign-data">
              {[
                {
                  key: "Selected campaign count",
                  value: state?.selected_rows?.length || "N/A",
                },
                {
                  key: "Branch",
                  value:
                    branch_list?.find((i) => i?.value === state?.branch)
                      ?.label || "All",
                },
                {
                  key: "Account Group",
                  value:
                    state?.accountGroup === "all" ? "All" : state?.accountGroup,
                },
                {
                  key: "Industry",
                  value:
                    state?.industryGroup === "all"
                      ? "All"
                      : state?.industryGroup,
                },
                {
                  key: "Segment",
                  value:
                    state?.segmentGroup === "all" ? "All" : state?.segmentGroup,
                },
                {
                  key: "Sub-Segment",
                  value:
                    state?.subSegmentGroup === "all"
                      ? "All"
                      : state?.subSegmentGroup,
                },
                {
                  key: "Product Line Code",
                  value:
                    state?.productLine === "all" ? "All" : state?.productLine,
                },
                {
                  key: "Status",
                  value: state?.status === "all" ? "All" : state?.status,
                },
              ]?.map((item) => (
                <div className="selected-data-item">
                  <span className="selected-data-label">{item?.key}:</span>
                  <span className="selected-data-value">
                    {item?.value || "N/A"}
                  </span>
                </div>
              ))}
            </div>
            <CommonButton
              className="py-2 px-4 rounded-md mr-3 w-auto run-campaign-btn mt-4"
              onClick={() => {
                navigate(routesConstants?.CAMPAIGN_AUDIENCE, {
                  state: {
                    branch: state?.branch,
                    accountGroup: state?.accountGroup,
                    pcsn: "",
                    industryGroup: state?.industryGroup,
                    segmentGroup: state?.segmentGroup,
                    subSegmentGroup: state?.subSegmentGroup,
                    productLine: state?.productLine,
                    status: state?.status,
                    selected_rows: state?.selected_rows,
                  },
                });
              }}
            >
              Back to Campaign Audience
            </CommonButton>
          </div>
          <div className="manage-template-form">
            <h4>Run Campaign</h4>
            <form>
              <CommonInputTextField
                labelName="Subject"
                id="subject"
                name="subject"
                className="input"
                required
                mainDiv="form-group mb-4"
                labelClass="label"
                value={values?.subject}
                placeHolder="Enter Subject"
                isInvalid={errors.subject && touched.subject}
                errorText={errors.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                requiredText
              />
              <CustomSelect
                label="Select Template"
                required
                name="template"
                value={values?.template}
                onChange={(selectedOption) => {
                  if (selectedOption?.value === "new") {
                    setModal((prev) => ({
                      isOpen: true,
                      content: "",
                    }));
                    setContent("");
                  } else {
                    setFieldValue("template", selectedOption);
                    setContent(selectedOption?.content);
                  }
                }}
                options={templateList}
                placeholder="Select a Template"
                error={errors?.template && touched?.template}
                errorText={errors?.template}
              />
              {values?.template?.value && (
                <div className="manage-template-content">
                  <label
                    htmlFor="message"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Template Content
                  </label>
                  <textarea
                    name="message"
                    style={{ height: "600px" }} // Set custom height for textarea
                    className="w-full outline-none rounded-md"
                    value={content}
                    onChange={(e) => setContent(e?.target?.value)}
                  />
                </div>
              )}
              <CommonButton
                className="py-2 px-4 rounded-md mr-3 w-auto run-campaign-btn mt-4"
                onClick={() => {
                  handleSubmit();
                }}
                isDisabled={loading}
              >
                {loading ? "Running Campaign" : "Run Campaign"}
              </CommonButton>
            </form>
          </div>

          <div className="manage-template-accordion">
            {accordionData?.map((item) => (
              <CommonAccordion
                key={item.id}
                title={item.title}
                content={item.content}
                mainDiv="manage-template-acc-table"
              />
            ))}
          </div>
        </div>
      </div>
      <CommonModal
        isOpen={modal?.isOpen}
        handleClose={() =>
          setModal({
            isOpen: false,
            content: "",
          })
        }
        scrollable
        title={"Add Template"}
      >
        <AddTemplate
          handleClose={() => {
            handleTemplateList();
            setModal({
              isOpen: false,
              content: "",
            });
          }}
        />
      </CommonModal>
    </>
  );
};

export default FinalCampaign;
