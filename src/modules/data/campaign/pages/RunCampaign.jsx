import CommonAccordion from "@/components/common/CommonAccordion";
import { accordionData } from "../../manageTemplate/constants";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { useFormik } from "formik";
import { getAllProductLine } from "../slice/CampaignSlice";

const RunCampaign = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState({
    branchList: [],
    accountGroupList: [],
    industryGroupList: [],
    segmentGroupList: [],
    subSegmentGroupList: [],
    statusList: [
      { label: "All Status", value: "All Status" },
      { label: "Active", value: "Active" },
      { label: "Expired", value: "Expired" },
    ],
    productLineList: [],
  });
  const [values, setValues] = useState({
    branch: "",
    accountGroup: "",
    industryGroup: "",
    segmentGroup: "",
    subSegmentGroup: "",
    status: "",
    productLine: "",
  });

  useEffect(() => {
    dispatch(getAllBranch()).then((res) => {
      let data = res?.payload?.data?.Branch;
      if (data?.length > 0) {
        const Arr = data?.map((item) => {
          const name = item.branch_name;
          const value = item.id;
          return {
            label: name,
            value: value,
          };
        });
        Arr.push({ label: "All Branch", value: "all" });
        setList((prev) => ({ ...prev, branchList: Arr }));
      } else {
        setList((prev) => ({ ...prev, branchList: [] }));
      }
    });
  }, []);

  useEffect(() => {
    if (values?.branch?.value || values?.accountGroup?.value) {
      let payload = {
        branch: values?.branch?.value,
        accountGroup: values?.accountGroup?.value,
        pcsn: "",
        industryGroup: values?.industryGroup?.value,
        segmentGroup: values?.segmentGroup?.value,
        subSegmentGroup: values?.subSegmentGroup?.value,
        productLine: values?.productLine?.value,
      };
      dispatch(getAllProductLine(payload)).then((res) => {
        let Arr = res?.payload?.data?.data;
        const setData = new Set(Arr?.map(JSON.stringify));
        const uniqueArray = Array.from(setData).map(JSON.parse);

        const data = uniqueArray.map((item) => {
          const name = item.productLineCode;
          return {
            label: name,
            value: name,
          };
        });
        const industrydata = uniqueArray?.map((item) => {
          const name = item.industry;
          return {
            label: name,
            value: name,
          };
        });
        const setindustryData = new Set(industrydata.map(JSON.stringify));
        const uniqueIndustrydArray = Array.from(setindustryData).map(
          JSON.parse
        );

        const accountGroupdata = uniqueArray?.map((item) => {
          const name = item.account_group;
          return {
            label: name,
            value: name,
          };
        });
        const setaccountGroupData = new Set(
          accountGroupdata.map(JSON.stringify)
        );
        const uniqueaccountGroupdArray = Array.from(setaccountGroupData).map(
          JSON.parse
        );

        const segmentdata = uniqueArray?.map((item) => {
          const name = item.segment;
          return {
            label: name,
            value: name,
          };
        });
        const setsegmentData = new Set(segmentdata.map(JSON.stringify));
        const uniqueSegmentArray = Array.from(setsegmentData).map(JSON.parse);
        const subsegmentdata = uniqueArray?.map((item) => {
          const name = item.subsegment;
          return {
            label: name,
            value: name,
          };
        });
        const setsubsegmentData = new Set(subsegmentdata.map(JSON.stringify));
        const uniqueSubSegmentArray = Array.from(setsubsegmentData).map(
          JSON.parse
        );
        setList((prev) => ({
          ...prev,
          accountGroupList: uniqueaccountGroupdArray?.filter(
            (i) => i?.value !== null
          ),
          industryGroupList: uniqueIndustrydArray?.filter(
            (i) => i?.value !== null
          ),
          segmentGroupList: uniqueSegmentArray?.filter(
            (i) => i?.value !== null
          ),
          subSegmentGroupList: uniqueSubSegmentArray?.filter(
            (i) => i?.value !== null
          ),
          productLineList: data?.filter((i) => i?.value !== null),
        }));
      });
    }
  }, [values]);

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
            <CustomSelect
              label="Branch"
              placeholder="Select a Branch"
              options={list?.branchList}
              value={values?.branch}
              onChange={(selectedOption) => {
                setValues((prev) => ({
                  ...prev,
                  branch: selectedOption,
                }));
              }}
            />
            <CustomSelect
              label="Account Group"
              placeholder="Select a Account Group"
              options={list?.accountGroupList}
              value={values?.accountGroup}
              isClearable
              onChange={(selectedOption) => {
                setValues((prev) => ({
                  ...prev,
                  accountGroup: selectedOption,
                }));
              }}
            />
            <CustomSelect
              label="Industry Group"
              placeholder="Select a Industry Group"
              options={list?.industryGroupList}
              value={values?.industryGroup}
              isClearable
              onChange={(selectedOption) => {
                setValues((prev) => ({
                  ...prev,
                  industryGroup: selectedOption,
                }));
              }}
            />
            <CustomSelect
              label="Segment Group"
              placeholder="Select a Segment Group"
              options={list?.segmentGroupList}
              value={values?.segmentGroup}
              isClearable
              onChange={(selectedOption) => {
                setValues((prev) => ({
                  ...prev,
                  segmentGroup: selectedOption,
                }));
              }}
            />
            <CustomSelect
              label="Sub Segment Group"
              placeholder="Select a Sub Segment Group"
              options={list?.subSegmentGroupList}
              isClearable
              value={values?.subSegmentGroup}
              onChange={(selectedOption) => {
                setValues((prev) => ({
                  ...prev,
                  subSegmentGroup: selectedOption,
                }));
              }}
            />
            <CustomSelect
              label="Status"
              placeholder="Select a Status"
              options={list?.statusList}
              value={values?.status}
              onChange={(selectedOption) => {
                setValues((prev) => ({
                  ...prev,
                  status: selectedOption,
                }));
              }}
            />
            <CustomSelect
              label="Product Line Code"
              placeholder="Select a Product Line Code"
              options={list?.productLineList}
              isClearable
              value={values?.productLine}
              onChange={(selectedOption) => {
                setValues((prev) => ({
                  ...prev,
                  productLine: selectedOption,
                }));
              }}
            />
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
    </>
  );
};
export default RunCampaign;
