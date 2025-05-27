import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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
    <div className="col-6 fw-bold">{label}</div>
    <div className="col-6">{value ?? "-"}</div>
  </div>
);

const useContractData = () => {
  return useSelector((state) => ({
    loading: state?.insightMetricsV2?.insightMetricsContractV2Loading,
    data: state?.insightMetricsV2?.insightMetricsV2Contract,
  }));
};

const SectionWrapper = ({ title, children, loading }) => (
  <>
    {loading ? (
      <SkeletonLoader isDashboard height="350px" />
    ) : (
      <>
        <h3>{title}</h3>
        <div className="container">{children}</div>
      </>
    )}
  </>
);

const EndCustomerTab = () => {
  const { loading, data } = useContractData();
  const customer = data?.[0]?.endCustomer_account;
  const manager = data?.[0]?.endCustomer_contractManager;
  return (
    <>
      <SectionWrapper title="End Customer Details" loading={loading}>
        <DetailRow
          label="Subscription#"
          value={data?.[0]?.subscriptionReferenceNumber}
        />
        <DetailRow label="CSN" value={customer?.endCustomerCsn} />
        <DetailRow label="Name" value={customer?.name} />
        <DetailRow label="Address Line 1" value={customer?.address1} />
        <DetailRow label="Address Line 2" value={customer?.address2} />
        <DetailRow label="City" value={customer?.city} />
        <DetailRow label="State" value={customer?.stateProvince} />
        <DetailRow label="Country" value={customer?.country} />
        <DetailRow label="Postal" value={customer?.postalCode} />
      </SectionWrapper>

      <SectionWrapper title="Contract Manager Details" loading={loading}>
        <DetailRow label="First Name" value={manager?.first} />
        <DetailRow label="Last Name" value={manager?.last} />
        <DetailRow label="Email" value={manager?.email} />
        <DetailRow label="Phone" value={manager?.phone} />
      </SectionWrapper>
    </>
  );
};

const Reseller = () => {
  const { loading, data } = useContractData();
  const reseller = data?.[0]?.accounts_reseller;
  return (
    <SectionWrapper title="Reseller Details" loading={loading}>
      <DetailRow
        label="Subscription#"
        value={data?.[0]?.subscriptionReferenceNumber}
      />
      <DetailRow label="CSN" value={reseller?.csn} />
      <DetailRow label="Name" value={reseller?.name} />
    </SectionWrapper>
  );
};

const Distributor = () => {
  const { loading, data } = useContractData();
  const distributor = data?.[0]?.accounts_soldTo;
  return (
    <SectionWrapper title="Distributor Details" loading={loading}>
      <DetailRow
        label="Subscription#"
        value={data?.[0]?.subscriptionReferenceNumber}
      />
      <DetailRow label="CSN" value={distributor?.csn} />
      <DetailRow label="Name" value={distributor?.name} />
    </SectionWrapper>
  );
};

const Contract = () => {
  const { loading, data } = useContractData();
  const contract = data?.[0]?.contract;
  return (
    <SectionWrapper title="Contract Details" loading={loading}>
      <DetailRow
        label="Serial No#"
        value={data?.[0]?.subscriptionReferenceNumber}
      />
      <DetailRow label="Contract#" value={contract?.contract_number} />
      <DetailRow label="Type" value={contract?.subType} />
      <DetailRow label="Product Line Name" value={data?.[0]?.productLine} />
      <DetailRow label="Term" value={contract?.contract_term} />
      <DetailRow label="Duration" value={contract?.contract} />
      <DetailRow
        label="Retention Health"
        value={data?.[0]?.ews_retentionHealth}
      />
      <DetailRow label="Sub start date" value={data?.[0]?.startDate} />
      <DetailRow label="Sub end date" value={data?.[0]?.endDate} />
      <DetailRow label="Quantity" value={data?.[0]?.quantity} />
    </SectionWrapper>
  );
};

const LineItems = () => {
  const { loading, data } = useContractData();
  return (
    <SectionWrapper title="Line Items 1 Details" loading={loading}>
      <DetailRow
        label="Serial#"
        value={data?.[0]?.subscriptionReferenceNumber}
      />
      <DetailRow label="Quantity" value={data?.[0]?.quantity} />
      <DetailRow label="Seats" value={data?.[0]?.seats} />
      <DetailRow label="Deployment" value={data?.[0]?.deployment} />
      <DetailRow label="Status" value={data?.[0]?.subscriptionStatus} />
      <DetailRow label="Asset Status" value={data?.[0]?.productStatus} />
      <DetailRow label="Support Program" value={null} />
      <DetailRow label="Program Eligibility" value={null} />
      <DetailRow label="Renew" value={null} />
    </SectionWrapper>
  );
};

const InsightMetricsContract = () => {
  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("1");

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

export default InsightMetricsContract;
