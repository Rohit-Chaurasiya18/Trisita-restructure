import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CommonAccordion from "@/components/common/CommonAccordion";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonButton from "@/components/common/buttons/CommonButton";
import routesConstants from "@/routes/routesConstants";

import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { getAllProductLine } from "../slice/CampaignSlice";
import { accordionData } from "../../manageTemplate/constants";

const RunCampaign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [list, setList] = useState({
    branchList: [],
    accountGroupList: [],
    industryGroupList: [],
    segmentGroupList: [],
    subSegmentGroupList: [],
    productLineList: [],
    statusList: [
      { label: "All Status", value: "All Status" },
      { label: "Active", value: "Active" },
      { label: "Expired", value: "Expired" },
    ],
  });

  const [values, setValues] = useState({
    branch: "",
    accountGroup: "",
    industryGroup: "",
    segmentGroup: "",
    subSegmentGroup: "",
    productLine: "",
    status: { label: "All Status", value: "All Status" },
  });

  // Load all branches
  useEffect(() => {
    dispatch(getAllBranch()).then((res) => {
      const data = res?.payload?.data?.Branch || [];
      const branchOptions = data.map(({ branch_name, id }) => ({
        label: branch_name,
        value: id,
      }));
      branchOptions.push({ label: "All Branch", value: "all" });

      setList((prev) => ({ ...prev, branchList: branchOptions }));
    });
  }, []);

  // Load product line and related filters when branch/account group changes
  useEffect(() => {
    const { branch, accountGroup, industryGroup, segmentGroup, subSegmentGroup } = values;

    if (branch?.value || accountGroup?.value) {
      const payload = {
        branch: branch?.value,
        accountGroup: accountGroup?.value,
        pcsn: "",
        industryGroup: industryGroup?.value,
        segmentGroup: segmentGroup?.value,
        subSegmentGroup: subSegmentGroup?.value,
      };

      dispatch(getAllProductLine(payload)).then((res) => {
        const data = res?.payload?.data?.data || {};

        setList((prev) => ({
          ...prev,
          accountGroupList: data.account_group?.map((i) => ({ label: i, value: i })) || [],
          industryGroupList: data.industry?.map((i) => ({ label: i, value: i })) || [],
          segmentGroupList: data.segment?.map((i) => ({ label: i, value: i })) || [],
          subSegmentGroupList: data.subsegment?.map((i) => ({ label: i, value: i })) || [],
          productLineList: data.productLineCode?.map((i) => ({ label: i, value: i })) || [],
        }));
      });
    }
  }, [values.branch, values.accountGroup, values.industryGroup, values.segmentGroup, values.subSegmentGroup]);

  // Utility to render dropdowns
  const renderSelect = (label, key, options, isClearable = true) => (
    <CustomSelect
      label={label}
      placeholder={`Select a ${label}`}
      options={options}
      value={values[key]}
      isClearable={isClearable}
      onChange={(selectedOption) =>
        setValues((prev) => ({ ...prev, [key]: selectedOption }))
      }
    />
  );

  // Handle navigation
  const handleAudienceNavigation = () => {
    const {
      branch,
      accountGroup,
      industryGroup,
      segmentGroup,
      subSegmentGroup,
      productLine,
      status,
    } = values;

    navigate(routesConstants?.CAMPAIGN_AUDIENCE, {
      state: {
        branch: branch?.value,
        accountGroup: accountGroup?.value,
        pcsn: "",
        industryGroup: industryGroup?.value,
        segmentGroup: segmentGroup?.value,
        subSegmentGroup: subSegmentGroup?.value,
        productLine: productLine?.value,
        status: status?.value,
      },
    });
  };

  return (
    <div className="manage-template-container">
      <div className="manage-team-header">
        <div className="commom-header-title mb-0">Campaign Page</div>
        <span className="common-breadcrum-msg">
          Welcome to your campaign page
        </span>
      </div>

      <div className="manage-template-detail">
        <div className="manage-template-form">
          {renderSelect("Branch", "branch", list.branchList)}
          {renderSelect("Account Group", "accountGroup", list.accountGroupList)}
          {renderSelect("Industry Group", "industryGroup", list.industryGroupList)}
          {renderSelect("Segment Group", "segmentGroup", list.segmentGroupList)}
          {renderSelect("Sub Segment Group", "subSegmentGroup", list.subSegmentGroupList)}
          {renderSelect("Status", "status", list.statusList, false)}
          {renderSelect("Product Line Code", "productLine", list.productLineList)}

          <div className="d-flex justify-content-center">
            <CommonButton
              className="py-2 px-4 rounded-md mr-3 w-auto run-campaign-btn"
              onClick={handleAudienceNavigation}
            >
              Select Campaign Audience
            </CommonButton>
          </div>
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
  );
};

export default RunCampaign;
