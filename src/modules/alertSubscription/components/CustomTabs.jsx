import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

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

const EndCustomerTab = ({ data }) => {
  const customer = data?.endCustomer_account || {};
  const manager = data?.endCustomer_contractManager || {};

  return (
    <>
      <h3>End Customer Details</h3>
      <div className="container">
        <DetailRow
          label="DeletedSubscription#"
          value={data?.subscriptionReferenceNumber}
        />
        <DetailRow label="CSN" value={customer?.endCustomerCsn} />
        <DetailRow label="Name" value={customer?.name} />
        <DetailRow label="Address Line 1" value={customer?.address1} />
        <DetailRow label="Address Line 2" value={customer?.address2} />
        <DetailRow label="City" value={customer?.city} />
        <DetailRow label="State" value={customer?.stateProvince} />
        <DetailRow label="Country" value={customer?.country} />
        <DetailRow label="Postal" value={customer?.postalCode} />
      </div>

      <h3 className="mt-3">Contract Manager Details</h3>
      <div className="container">
        <DetailRow label="First Name" value={manager?.first} />
        <DetailRow label="Last Name" value={manager?.last} />
        <DetailRow label="Email" value={manager?.email} />
        <DetailRow label="Phone" value={manager?.phone} />
      </div>
    </>
  );
};

const ResellerTab = ({ data }) => {
  const reseller = data?.accounts_reseller || {};
  return (
    <>
      <h3>Reseller Details</h3>
      <div className="container">
        <DetailRow
          label="Opportunity#"
          value={data?.subscriptionReferenceNumber}
        />
        <DetailRow label="CSN" value={reseller.csn} />
        <DetailRow label="Name" value={reseller.name} />
      </div>
    </>
  );
};

const DistributorTab = ({ data }) => {
  const soldTo = data?.accounts_soldTo || {};
  return (
    <>
      <h3>Distributor Details</h3>
      <div className="container">
        <DetailRow
          label="DeletedSubscription#"
          value={data?.subscriptionReferenceNumber}
        />
        <DetailRow label="CSN" value={soldTo?.csn} />
        <DetailRow label="Name" value={soldTo?.name} />
      </div>
    </>
  );
};

const ContractTab = ({ data }) => {
  const contract = data?.contract || {};
  return (
    <>
      <h3>Contract Details</h3>
      <div className="container">
        <DetailRow
          label="Opportunity#"
          value={data?.subscriptionReferenceNumber}
        />
        <DetailRow label="Contract#" value={contract?.contract_number} />
        <DetailRow label="Type" value={contract?.subType} />
        <DetailRow label="Product Line Name" value={data?.productLine} />
        <DetailRow label="Term" value={contract?.contract_term} />
        <DetailRow label="Duration" value={contract?.contract} />
        <DetailRow label="Retention Health" value={data?.ews_retentionHealth} />
        <DetailRow label="Sub end date" value={data?.endDate} />
        <DetailRow label="Quantity" value={data?.quantity} />
      </div>
    </>
  );
};

const LineItemsTab = ({ data }) => (
  <>
    <h3>Line Items 1 Details</h3>
    <div className="container">
      <DetailRow label="Serial#" value={data?.subscriptionReferenceNumber} />
      <DetailRow label="Renewal SKU" value={""} />
      <DetailRow label="SKU Description" value={data?.id} />
      <DetailRow label="Quantity" value={data?.quantity} />
      <DetailRow label="Seats" value={data?.seats} />
      <DetailRow label="Renewed Quantity" value={data?.id} />
      <DetailRow label="Deployment" value={data?.deployment} />
      <DetailRow label="Status" value={data?.subscriptionStatus} />
      <DetailRow label="Asset Status" value={data?.productStatus} />
      <DetailRow label="Support Program" value={""} />
      <DetailRow label="Program Eligibility" value={""} />
      <DetailRow label="Renew" value={""} />
    </div>
  </>
);

const CustomTabs = () => {
  const { alertSubscriptionData } = useSelector((state) => ({
    alertSubscriptionData: state?.alertSubscription?.alertSubscriptionData,
  }));
  const [activeTab, setActiveTab] = useState("1");
  const tabRefs = useRef([]);

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
        return <EndCustomerTab data={alertSubscriptionData} />;
      case "2":
        return <ResellerTab data={alertSubscriptionData} />;
      case "3":
        return <DistributorTab data={alertSubscriptionData} />;
      case "4":
        return <ContractTab data={alertSubscriptionData} />;
      case "5":
        return <LineItemsTab data={alertSubscriptionData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="main dark">
        <div className="tabs">
          {tabsData.map((tab, index) => (
            <div className="tab" key={tab.id}>
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

export default CustomTabs;
