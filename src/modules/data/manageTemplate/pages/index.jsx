import CommonButton from "@/components/common/buttons/CommonButton";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getManageTemplate,
  updateManageTemplate,
} from "../slice/ManageTemplateSlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonModal from "@/components/common/modal/CommonModal";
import { toast } from "react-toastify";
import AddTemplate from "../components/AddTemplate";

const ManageTemplate = () => {
  const dispatch = useDispatch();
  const { templatesData, templatesDataLoading } = useSelector((state) => ({
    templatesData: state?.manageTemplate?.templatesData,
    templatesDataLoading: state?.manageTemplate?.templatesDataLoading,
  }));
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [content, setContent] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    content: "",
    isAdd: false,
  });

  useEffect(() => {
    dispatch(getManageTemplate());
  }, []);

  const handleSave = () => {
    let payload = {
      id: selectedTemplate?.value,
      name: selectedTemplate?.label,
      days: selectedTemplate?.days,
      content: content,
    };
    dispatch(updateManageTemplate(payload)).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success("Template updated successfully!");
      } else {
      }
    });
  };

  return (
    <>
      <div className="manage-template-container">
        <div className="manage-template-header">
          <div className="commom-header-title mb-0">Manage Templates</div>
          <CommonButton
            className="add-html-template"
            onClick={() => {
              setModal((prev) => ({
                isOpen: true,
                content: "",
                isAdd: true,
              }));
              setContent("");
              setSelectedTemplate(null);
            }}
          >
            Add HTML Template.
          </CommonButton>
        </div>
        {templatesDataLoading ? (
          <SkeletonLoader isDashboard />
        ) : (
          <div className="manage-template-detail">
            <CustomSelect
              label="Templates"
              placeholder="Select a Template"
              isClearable
              options={templatesData}
              value={selectedTemplate}
              onChange={(selectedOption) => {
                setSelectedTemplate(selectedOption);
                setContent(selectedOption?.content);
              }}
            />
            {selectedTemplate?.content && (
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
            <div className="template-save-btn">
              <CommonButton
                className="py-2 px-4 rounded-md mr-3"
                isDisabled={content === ""}
                onClick={handleSave}
              >
                Save
              </CommonButton>
              <CommonButton
                className="py-2 px-4 rounded-md mr-3"
                onClick={() => {
                  setModal({
                    isOpen: true,
                    content: content,
                    isAdd: false,
                  });
                }}
                isDisabled={content === ""}
              >
                View
              </CommonButton>
            </div>
          </div>
        )}
      </div>
      <CommonModal
        isOpen={modal?.isOpen && (modal?.content || modal?.isAdd)}
        handleClose={() =>
          setModal({
            isOpen: false,
            content: "",
            isAdd: false,
          })
        }
        scrollable
        title={modal?.isAdd ? "Add Template" : "View Template"}
      >
        {modal?.isAdd ? (
          <AddTemplate
            handleClose={() =>
              setModal({
                isOpen: false,
                content: "",
                isAdd: false,
              })
            }
          />
        ) : (
          modal?.content && (
            <div dangerouslySetInnerHTML={{ __html: modal.content }} />
          )
        )}
      </CommonModal>
    </>
  );
};

export default ManageTemplate;
