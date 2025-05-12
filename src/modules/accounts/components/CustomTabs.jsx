import { useEffect, useRef, useState } from "react";

const tabsData = [
  { id: "1", label: "End Customer" },
  { id: "2", label: "Details" },
  { id: "3", label: "Contracts" },
  { id: "4", label: "Insight Summary" },
  { id: "5", label: "Usage Summary" },
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
  return (
    <>
      <h3>End Customer Details</h3>
      <div className="container">
        <DetailRow
          label="DeletedSubscription#"
          //   value={data?.subscriptionReferenceNumber}
        />
        <DetailRow
          label="CSN"
          // value={customer?.endCustomerCsn}
        />
        <DetailRow
          label="Name"
          //  value={customer?.name}
        />
        <DetailRow
          label="Address Line 1"
          // value={customer?.address1}
        />
        <DetailRow
          label="Address Line 2"
          // value={customer?.address2}
        />
        <DetailRow
          label="City"
          // value={customer?.city}
        />
        <DetailRow
          label="State"
          //  value={customer?.stateProvince}
        />
        <DetailRow
          label="Country"
          // value={customer?.country}
        />
        <DetailRow
          label="Postal"
          // value={customer?.postalCode}
        />
      </div>

      <h3 className="mt-3">Contract Manager Details</h3>
      <div className="container">
        <DetailRow
          label="First Name"
          // value={manager?.first}
        />
        <DetailRow
          label="Last Name"
          // value={manager?.last}
        />
        <DetailRow
          label="Email"
          //  value={manager?.email}
        />
        <DetailRow
          label="Phone"
          // value={manager?.phone}
        />
      </div>
    </>
  );
};

const Details = () => {
  return (
    <div className="d-flex">
      <div className="container">
        <DetailRow
          label="Name"
          //   value={data?.subscriptionReferenceNumber}
        />
        <DetailRow
          label="Address1"
          // value={customer?.endCustomerCsn}
        />
        <DetailRow
          label="City"
          //  value={customer?.name}
        />
        <DetailRow
          label="ADK main contact"
          // value={customer?.address1}
        />
        <DetailRow
          label="Flex Flag"
          // value={customer?.address2}
        />
        <DetailRow
          label="Flex Flag"
          // value={customer?.city}
        />
        <DetailRow
          label="Industry"
          //  value={customer?.stateProvince}
        />
        <DetailRow
          label="Industry Segment"
          // value={customer?.country}
        />
        <DetailRow
          label="Named Account"
          // value={customer?.postalCode}
        />
        <DetailRow
          label="Phone Number"
          // value={customer?.postalCode}
        />
        <DetailRow
          label="Sales Region"
          // value={customer?.postalCode}
        />
        <DetailRow
          label="Victim CSN"
          // value={customer?.postalCode}
        />
      </div>
      <div className="container">
        <DetailRow
          label="Total Contracts"
          // value={manager?.first}
        />
        <DetailRow
          label="Address2"
          // value={manager?.last}
        />
        <DetailRow
          label="Country/Geo"
          //  value={manager?.email}
        />
        <DetailRow
          label="Contact email"
          // value={manager?.phone}
        />
        <DetailRow
          label="Individual Flag"
          // value={manager?.phone}
        />
        <DetailRow
          label="Industry Group"
          // value={manager?.phone}
        />
        <DetailRow
          label="Sub Segment"
          // value={manager?.phone}
        />
        <DetailRow
          label="Parent Account CSN"
          // value={manager?.phone}
        />
        <DetailRow
          label="Postal"
          // value={manager?.phone}
        />
        <DetailRow
          label="Status"
          // value={manager?.phone}
        />
      </div>
    </div>
  );
};

const ContractTab = () => {
  return <></>;
};

const InsightSummary = () => {
  return <></>;
};

const UsageSummary = () => {
  return <></>;
};

const CustomTabs = () => {
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
        return <EndCustomerTab />;
      case "2":
        return <Details />;
      case "3":
        return <ContractTab />;
      case "4":
        return <InsightSummary />;
      case "5":
        return <UsageSummary />;
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

export default CustomTabs;
