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
    <div className="col-6" style={{ fontWeight: "700" }}>
      {label}
    </div>
    <div className="col-6">{value ?? "-"}</div>
  </div>
);

const EndCustomerTab = () => {
  const { opportunityDetailLoading, opportunityDetail } = useSelector(
    (state) => ({
      opportunityDetailLoading: state?.opportunity?.opportunityDetailLoading,
      opportunityDetail: state?.opportunity?.opportunityDetail,
    })
  );
  return (
    <>
      {opportunityDetailLoading ? (
        <SkeletonLoader isDashboard height="350px" />
      ) : (
        <>
          <h3>End Customer Details</h3>
          <div className="container">
            <DetailRow
              label="Opportunity#"
              value={opportunityDetail?.message[0]?.opportunity_number}
            />
            <DetailRow
              label="CSN"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer?.account
                  ?.csn
              }
            />
            <DetailRow
              label="Name"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer?.account
                  ?.name
              }
            />
            <DetailRow
              label="Address Line 1"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer?.account
                  ?.address_line_1
              }
            />
            <DetailRow
              label="Address Line 2"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer?.account
                  ?.address_line_2
              }
            />
            <DetailRow
              label="City"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer?.account
                  ?.city
              }
            />
            <DetailRow
              label="State"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer?.account
                  ?.state
              }
            />
            <DetailRow
              label="Country"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer?.account
                  ?.country
              }
            />
            <DetailRow
              label="Postal"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer?.account
                  ?.postal
              }
            />
          </div>

          <h3 className="mt-3">Contract Manager Details</h3>
          <div className="container">
            <DetailRow
              label="First Name"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer
                  ?.contract_manager?.first
              }
            />
            <DetailRow
              label="Last Name"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer
                  ?.contract_manager?.last
              }
            />
            <DetailRow
              label="Email"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer
                  ?.contract_manager?.email
              }
            />
            <DetailRow
              label="Phone"
              value={
                opportunityDetail?.message[0]?.accounts?.end_customer
                  ?.contract_manager?.phone
              }
            />
          </div>
        </>
      )}
    </>
  );
};

const Reseller = () => {
  const { opportunityDetailLoading, opportunityDetail } = useSelector(
    (state) => ({
      opportunityDetailLoading: state?.opportunity?.opportunityDetailLoading,
      opportunityDetail: state?.opportunity?.opportunityDetail,
    })
  );

  return (
    <>
      {opportunityDetailLoading ? (
        <SkeletonLoader isDashboard height="350px" />
      ) : (
        <>
          <h3>Reseller Details</h3>
          <div className="container">
            <DetailRow
              label="Opportunity#"
              value={opportunityDetail?.message[0]?.opportunity_number}
            />
            <DetailRow
              label="CSN"
              value={opportunityDetail?.message[0]?.accounts?.reseller?.csn}
            />
            <DetailRow
              label="Name"
              value={opportunityDetail?.message[0]?.accounts?.reseller?.name}
            />
          </div>
        </>
      )}
    </>
  );
};

const Distributor = () => {
  const { opportunityDetailLoading, opportunityDetail } = useSelector(
    (state) => ({
      opportunityDetailLoading: state?.opportunity?.opportunityDetailLoading,
      opportunityDetail: state?.opportunity?.opportunityDetail,
    })
  );
  return (
    <>
      {opportunityDetailLoading ? (
        <SkeletonLoader isDashboard height="350px" />
      ) : (
        <>
          <h3>Distributor Details</h3>
          <div className="container">
            <DetailRow
              label="Opportunity#"
              value={opportunityDetail?.message[0]?.opportunity_number}
            />
            <DetailRow
              label="CSN"
              value={opportunityDetail?.message[0]?.accounts?.sold_to?.csn}
            />
            <DetailRow
              label="Name"
              value={opportunityDetail?.message[0]?.accounts?.sold_to?.name}
            />
          </div>
        </>
      )}
    </>
  );
};

const Contract = () => {
  const { opportunityDetailLoading, opportunityDetail } = useSelector(
    (state) => ({
      opportunityDetailLoading: state?.opportunity?.opportunityDetailLoading,
      opportunityDetail: state?.opportunity?.opportunityDetail,
    })
  );

  return (
    <>
      {opportunityDetailLoading ? (
        <SkeletonLoader isDashboard height="350px" />
      ) : (
        <>
          <h3>Contract Details</h3>
          <div className="container">
            <DetailRow
              label="Opportunity#"
              value={opportunityDetail?.message[0]?.opportunity_number}
            />
            <DetailRow
              label="Contract#"
              value={opportunityDetail?.message[0]?.contract?.contract_number}
            />
            <DetailRow
              label="Type"
              value={opportunityDetail?.message[0]?.contract?.contract_type}
            />
            <DetailRow
              label="Term"
              value={opportunityDetail?.message[0]?.contract?.contract_term}
            />
            <DetailRow
              label="Duration"
              value={opportunityDetail?.message[0]?.contract?.contract_duration}
            />
            <DetailRow
              label="Retention Health"
              value={opportunityDetail?.message[0]?.ews_retention_health}
            />
            <DetailRow
              label="Sub end date"
              value={opportunityDetail?.message[0]?.subscription_end_date}
            />
            <DetailRow
              label="Total Quantity"
              value={opportunityDetail?.message[0]?.total_quantity}
            />
            <DetailRow
              label="Total Renewed Quantity"
              value={opportunityDetail?.message[0]?.total_renewed_quantity}
            />
          </div>
        </>
      )}
    </>
  );
};

const LineItems = () => {
  const { opportunityDetailLoading, opportunityDetail } = useSelector(
    (state) => ({
      opportunityDetailLoading: state?.opportunity?.opportunityDetailLoading,
      opportunityDetail: state?.opportunity?.opportunityDetail,
    })
  );
  return (
    <>
      {opportunityDetailLoading ? (
        <SkeletonLoader isDashboard height="350px" />
      ) : (
        <>
          <h3>Line Items 1 Details</h3>
          <div className="container">
            <DetailRow
              label="Serial#"
              value={
                opportunityDetail?.message[0]?.line_items[0]?.serial_number
              }
            />
            <DetailRow
              label="Renewal SKU"
              value={opportunityDetail?.message[0]?.line_items[0]?.renewal_sku}
            />
            <DetailRow
              label="SKU Description"
              value={
                opportunityDetail?.message[0]?.line_items[0]?.sku_description
              }
            />
            <DetailRow
              label="Seats"
              value={opportunityDetail?.message[0]?.line_items[0]?.seats}
            />
            <DetailRow
              label="Renewed Quantity"
              value={
                opportunityDetail?.message[0]?.line_items[0]?.renewed_quantity
              }
            />
            <DetailRow
              label="Deployment"
              value={opportunityDetail?.message[0]?.line_items[0]?.deployment}
            />
            <DetailRow
              label="Status"
              value={opportunityDetail?.message[0]?.line_items[0]?.status}
            />
            <DetailRow
              label="Asset Status"
              value={opportunityDetail?.message[0]?.line_items[0]?.asset_status}
            />
            <DetailRow
              label="Support Program"
              value={
                opportunityDetail?.message[0]?.line_items[0]?.support_program
              }
            />
            <DetailRow
              label="Program Eligibility"
              value={
                opportunityDetail?.message[0]?.line_items[0]
                  ?.program_eligibility
              }
            />
            <DetailRow
              label="Renew"
              value={opportunityDetail?.message[0]?.line_items[0]?.renew}
            />
          </div>
        </>
      )}
    </>
  );
};

const OpportunityDetail = ({ id }) => {
  const dispatch = useDispatch();
  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    dispatch(getOpportunityDetail(id));
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
  const renderTabContent = () => {
    switch (activeTab) {
      case "1":
        return <EndCustomerTab />;
      case "2":
        return <Reseller />;
      case "3":
        return <Distributor />;
      case "4":
        return <Contract />;
      case "5":
        return <LineItems />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="main dark">
        <div className="tabs">
          {tabsData.map((tab, index) => (
            <div className="tab account-information-details" key={tab?.id}>
              <input
                type="radio"
                name="tabs"
                id={tab?.id}
                checked={activeTab === tab?.id}
                onChange={() => setActiveTab(tab.id)}
              />
              <label
                htmlFor={tab?.id}
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
        {renderTabContent()}
      </div>
    </>
  );
};
export default OpportunityDetail;
