import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOpportunityDetail } from "../slice/opportunitySlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

const tabsData = [
  { id: "1", label: "End Customer" },
  { id: "2", label: "Reseller" },
  { id: "3", label: "Distributor" },
  { id: "4", label: "Contract" },
  { id: "5", label: "Line Items" },
];

const DetailRow = ({ label, value }) => (
  <div className="col-12 d-flex my-2">
    <div className="col-6 font-weight-bold">{label}</div>
    <div className="col-6">{value ?? "-"}</div>
  </div>
);

const TabSection = ({ title, details }) => (
  <>
    <h3 className="mt-3">{title}</h3>
    <div className="container">
      {details.map((item, idx) => (
        <DetailRow key={idx} label={item.label} value={item.value} />
      ))}
    </div>
  </>
);

const getData = (detail, path) =>
  path.reduce((acc, key) => acc?.[key], detail) ?? null;

const OpportunityTab = ({ fields }) => {
  const { opportunityDetailLoading, opportunityDetail } = useSelector(
    (state) => ({
      opportunityDetailLoading: state.opportunity.opportunityDetailLoading,
      opportunityDetail: state.opportunity.opportunityDetail,
    })
  );

  const detail = opportunityDetail?.message?.[0];
  if (opportunityDetailLoading)
    return <SkeletonLoader isDashboard height="350px" />;

  return (
    <>
      {fields.map(({ title, data }, idx) => (
        <TabSection
          key={idx}
          title={title}
          details={data.map(({ label, path }) => ({
            label,
            value: getData(detail, path),
          }))}
        />
      ))}
    </>
  );
};

const tabConfig = [
  {
    id: "1",
    fields: [
      {
        title: "End Customer Details",
        data: [
          { label: "Opportunity#", path: ["opportunity_number"] },
          {
            label: "CSN",
            path: ["accounts", "end_customer", "account", "csn"],
          },
          {
            label: "Name",
            path: ["accounts", "end_customer", "account", "name"],
          },
          {
            label: "Address Line 1",
            path: ["accounts", "end_customer", "account", "address_line_1"],
          },
          {
            label: "Address Line 2",
            path: ["accounts", "end_customer", "account", "address_line_2"],
          },
          {
            label: "City",
            path: ["accounts", "end_customer", "account", "city"],
          },
          {
            label: "State",
            path: ["accounts", "end_customer", "account", "state"],
          },
          {
            label: "Country",
            path: ["accounts", "end_customer", "account", "country"],
          },
          {
            label: "Postal",
            path: ["accounts", "end_customer", "account", "postal"],
          },
        ],
      },
      {
        title: "Contract Manager Details",
        data: [
          {
            label: "First Name",
            path: ["accounts", "end_customer", "contract_manager", "first"],
          },
          {
            label: "Last Name",
            path: ["accounts", "end_customer", "contract_manager", "last"],
          },
          {
            label: "Email",
            path: ["accounts", "end_customer", "contract_manager", "email"],
          },
          {
            label: "Phone",
            path: ["accounts", "end_customer", "contract_manager", "phone"],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    fields: [
      {
        title: "Reseller Details",
        data: [
          { label: "Opportunity#", path: ["opportunity_number"] },
          { label: "CSN", path: ["accounts", "reseller", "csn"] },
          { label: "Name", path: ["accounts", "reseller", "name"] },
        ],
      },
    ],
  },
  {
    id: "3",
    fields: [
      {
        title: "Distributor Details",
        data: [
          { label: "Opportunity#", path: ["opportunity_number"] },
          { label: "CSN", path: ["accounts", "sold_to", "csn"] },
          { label: "Name", path: ["accounts", "sold_to", "name"] },
        ],
      },
    ],
  },
  {
    id: "4",
    fields: [
      {
        title: "Contract Details",
        data: [
          { label: "Opportunity#", path: ["opportunity_number"] },
          { label: "Contract#", path: ["contract", "contract_number"] },
          { label: "Type", path: ["contract", "contract_type"] },
          { label: "Term", path: ["contract", "contract_term"] },
          { label: "Duration", path: ["contract", "contract_duration"] },
          { label: "Retention Health", path: ["ews_retention_health"] },
          { label: "Sub end date", path: ["subscription_end_date"] },
          { label: "Total Quantity", path: ["total_quantity"] },
          { label: "Total Renewed Quantity", path: ["total_renewed_quantity"] },
        ],
      },
    ],
  },
  {
    id: "5",
    fields: [
      {
        title: "Line Items 1 Details",
        data: [
          { label: "Serial#", path: ["line_items", 0, "serial_number"] },
          { label: "Renewal SKU", path: ["line_items", 0, "renewal_sku"] },
          {
            label: "SKU Description",
            path: ["line_items", 0, "sku_description"],
          },
          { label: "Seats", path: ["line_items", 0, "seats"] },
          { label: "Deployment", path: ["line_items", 0, "deployment"] },
          { label: "Status", path: ["line_items", 0, "status"] },
          { label: "Asset Status", path: ["line_items", 0, "asset_status"] },
          {
            label: "Support Program",
            path: ["line_items", 0, "support_program"],
          },
          {
            label: "Program Eligibility",
            path: ["line_items", 0, "program_eligibility"],
          },
          { label: "Renew", path: ["line_items", 0, "renew"] },
        ],
      },
    ],
  },
];

const OpportunityDetail = ({ id }) => {
  const dispatch = useDispatch();
  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    if (id) {
      dispatch(getOpportunityDetail(id));
    }
  }, [id]);

  useEffect(() => {
    const activeLabel = tabRefs.current.find(
      (ref) => ref?.htmlFor === activeTab
    );
    if (activeLabel) {
      document.documentElement.style.setProperty(
        "--width",
        `${activeLabel.offsetWidth}px`
      );
      document.documentElement.style.setProperty(
        "--left",
        `${activeLabel.offsetLeft}px`
      );
    }
  }, [activeTab]);

  return (
    <>
      <div className="main dark">
        <div className="tabs">
          {tabsData.map((tab, index) => (
            <div className="tab account-information-details" key={tab.id}>
              <input
                type="radio"
                name="tabs"
                id={tab.id}
                checked={activeTab === tab.id}
                onChange={() => setActiveTab(tab.id)}
              />
              <label
                htmlFor={tab.id}
                ref={(el) => (tabRefs.current[index] = el)}
                className="account-information-details"
              >
                {tab.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="main-container-alertSubscription end-customer-details">
        <OpportunityTab
          fields={tabConfig.find((tab) => tab.id === activeTab)?.fields || []}
        />
      </div>
    </>
  );
};

export default OpportunityDetail;
