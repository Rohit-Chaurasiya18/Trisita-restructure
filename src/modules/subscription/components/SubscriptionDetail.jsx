import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { useLocation } from "react-router-dom";
import routesConstants from "@/routes/routesConstants";
import moment from "moment";

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
  const location = useLocation();
  const isSubscription = useMemo(
    () =>
      location.pathname.startsWith(routesConstants?.SUBSCRIPTION) ||
      location.pathname.startsWith(routesConstants?.CAMPAIGN_HISTORY) ||
      location.pathname.startsWith(routesConstants?.CAMPAIGN_AUDIENCE),
    [location?.pathname]
  );
  const isNewSubscription = useMemo(
    () => location.pathname.startsWith(routesConstants?.NEW_SUBSCRIPTION),
    [location?.pathname]
  );
  const isDeletedSubscription = useMemo(
    () => location.pathname.startsWith(routesConstants?.DELETED_SUBSCRIPTION),
    [location?.pathname]
  );
  const isChangedLogSubscription = useMemo(
    () =>
      location.pathname.startsWith(routesConstants?.CHANGED_LOG_SUBSCRIPTION),
    [location?.pathname]
  );
  const isCompareSubscription = useMemo(
    () =>
      location.pathname.startsWith(
        routesConstants?.SUBSCRIPTION_DATA_COMPARISON
      ),
    [location?.pathname]
  );
  const isCalendar = useMemo(
    () => location.pathname.startsWith(routesConstants?.CALENDAR),
    [location?.pathname]
  );

  return useSelector((state) => ({
    loading: isSubscription
      ? state?.subscription?.subscriptionDetailsLoading
      : isDeletedSubscription
      ? state?.subscription?.deletedSubscriptionDetailsLoading
      : isChangedLogSubscription
      ? state?.subscription?.changedLogSubscriptionDetailsLoading
      : isCompareSubscription
      ? state?.subscription?.compareSubscriptionDetailsLoading
      : isCalendar
      ? state?.pages?.calendarSubscriptionLoading
      : state?.subscription?.newSubscriptionDetailsLoading,
    data: isSubscription
      ? state?.subscription?.subscriptionDetails
      : isDeletedSubscription
      ? state?.subscription?.deletedSubscriptionDetails
      : isChangedLogSubscription
      ? state?.subscription?.changedLogSubscriptionDetails
      : isCompareSubscription
      ? state?.subscription?.compareSubscriptionDetails
      : isCalendar
      ? state?.pages?.calendarSubscriptionData
      : state?.subscription?.newSubscriptionDetails,
    isDeletedSubscription,
    isChangedLogSubscription,
    isCompareSubscription,
    isSubscription,
    isNewSubscription,
    isCalendar,
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
  const { loading, data, isDeletedSubscription, isNewSubscription } =
    useContractData();
  const customer = data?.endCustomer_account;
  const manager = data?.endCustomer_contractManager;

  return (
    <>
      <SectionWrapper title="End Customer Details" loading={loading}>
        <DetailRow
          label={`${
            isDeletedSubscription ? "Deleted" : isNewSubscription ? "New" : ""
          } Subscription#`}
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
  const reseller = data?.accounts_reseller;
  return (
    <SectionWrapper title="Reseller Details" loading={loading}>
      <DetailRow
        label="Opportunity#"
        value={data?.subscriptionReferenceNumber}
      />
      <DetailRow label="CSN" value={reseller?.csn} />
      <DetailRow label="Name" value={reseller?.name} />
    </SectionWrapper>
  );
};

const Distributor = () => {
  const { loading, data, isDeletedSubscription, isNewSubscription } =
    useContractData();
  const distributor = data?.accounts_soldTo;
  return (
    <SectionWrapper title="Distributor Details" loading={loading}>
      <DetailRow
        label={`${
          isDeletedSubscription ? "Deleted" : isNewSubscription ? "New" : ""
        } Subscription#`}
        value={data?.subscriptionReferenceNumber}
      />
      <DetailRow label="CSN" value={distributor?.csn} />
      <DetailRow label="Name" value={distributor?.name} />
    </SectionWrapper>
  );
};

const Contract = () => {
  const { loading, data } = useContractData();
  const contract = data?.contract;
  return (
    <SectionWrapper title="Contract Details" loading={loading}>
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
      <DetailRow
        label="Sub start date"
        value={
          data?.startDate ? moment(data?.startDate).format("DD/MM/YYYY") : ""
        }
      />
      <DetailRow
        label="Sub end date"
        value={data?.endDate ? moment(data?.endDate).format("DD/MM/YYYY") : ""}
      />
      <DetailRow label="Quantity" value={data?.quantity} />
    </SectionWrapper>
  );
};

const LineItems = () => {
  const { loading, data } = useContractData();
  return (
    <SectionWrapper title="Line Items 1 Details" loading={loading}>
      <DetailRow label="Serial#" value={data?.subscriptionReferenceNumber} />
      <DetailRow
        label="Renewal SKU"
        value={data?.subscriptionReferenceNumber}
      />
      <DetailRow label="SKU Description" value={data?.id} />
      <DetailRow label="Quantity" value={data?.quantity} />
      <DetailRow label="Seats" value={data?.seats} />
      <DetailRow label="Deployment" value={data?.deployment} />
      <DetailRow label="Status" value={data?.subscriptionStatus} />
      <DetailRow label="Asset Status" value={data?.productStatus} />
      <DetailRow label="Support Program" value={null} />
      <DetailRow label="Program Eligibility" value={null} />
      <DetailRow label="Renew" value={null} />
    </SectionWrapper>
  );
};

const SubscriptionDetail = () => {
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

export default SubscriptionDetail;
