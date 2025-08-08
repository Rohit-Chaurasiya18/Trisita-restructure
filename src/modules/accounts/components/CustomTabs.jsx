import CommonTable from "@/components/common/dataTable/CommonTable";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import routesConstants from "@/routes/routesConstants";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  const { endCustomerAccount, endCustomerAccountLoading } = useSelector(
    (state) => ({
      endCustomerAccount: state?.account?.endCustomerAccount,
      endCustomerAccountLoading: state?.account?.endCustomerAccountLoading,
    })
  );
  return (
    <>
      {endCustomerAccountLoading ? (
        <SkeletonLoader isDashboard height="350px" />
      ) : (
        <>
          <h3>End Customer Details</h3>
          <div className="container">
            <DetailRow
              label="CSN"
              value={endCustomerAccount?.endcustomer[0]?.endCustomerCsn}
            />
            <DetailRow
              label="Name"
              value={endCustomerAccount?.endcustomer[0]?.name}
            />
            <DetailRow
              label="Address Line 1"
              value={endCustomerAccount?.endcustomer[0]?.address1}
            />
            <DetailRow
              label="Address Line 2"
              value={endCustomerAccount?.endcustomer[0]?.address2}
            />
            <DetailRow
              label="City"
              value={endCustomerAccount?.endcustomer[0]?.city}
            />
            <DetailRow
              label="State"
              value={endCustomerAccount?.endcustomer[0]?.stateProvince}
            />
            <DetailRow
              label="Country"
              value={endCustomerAccount?.endcustomer[0]?.country}
            />
            <DetailRow
              label="Postal"
              value={endCustomerAccount?.endcustomer[0]?.postalCode}
            />
          </div>

          <h3 className="mt-3">Contract Manager Details</h3>
          <div className="container">
            <DetailRow
              label="First Name"
              value={endCustomerAccount?.contract_manager[0]?.first}
            />
            <DetailRow
              label="Last Name"
              value={endCustomerAccount?.contract_manager[0]?.last}
            />
            <DetailRow
              label="Email"
              value={endCustomerAccount?.contract_manager[0]?.email}
            />
            <DetailRow
              label="Phone"
              value={endCustomerAccount?.contract_manager[0]?.phone}
            />
          </div>
        </>
      )}
    </>
  );
};

const Details = () => {
  const { accountDetail, accountDetailLoading } = useSelector((state) => ({
    accountDetail: state?.account?.accountDetail,
    accountDetailLoading: state?.account?.accountDetailLoading,
  }));

  return (
    <>
      {accountDetailLoading ? (
        <SkeletonLoader isDashboard height="350px" />
      ) : (
        <div className="d-flex">
          <div className="container">
            <DetailRow label="Name" value={accountDetail?.name} />
            <DetailRow label="Address1" value={accountDetail?.address1} />
            <DetailRow label="City" value={accountDetail?.city} />
            <DetailRow
              label="ADK main contact"
              value={accountDetail?.autodeskMainContact}
            />
            <DetailRow
              label="Flex Flag"
              value={accountDetail?.flexCustomerFlag}
            />
            <DetailRow label="Industry" value={accountDetail?.industry} />
            <DetailRow
              label="Industry Segment"
              value={accountDetail?.industrySegment}
            />
            <DetailRow
              label="Named Account"
              value={accountDetail?.isNamedAccount}
            />
            <DetailRow
              label="Phone Number"
              value={accountDetail?.phoneNumber}
            />
            <DetailRow
              label="Sales Region"
              value={accountDetail?.salesRegion}
            />
            <DetailRow label="Victim CSN" value={accountDetail?.victimCsn} />
          </div>
          <div className="container">
            <DetailRow
              label="Total Contracts"
              value={accountDetail?.totalNumberOfActiveContracts}
            />
            <DetailRow label="Address2" value={accountDetail?.address2} />
            <DetailRow label="Country/Geo" value={accountDetail?.countryCode} />
            <DetailRow
              label="Contact email"
              value={accountDetail?.autodeskMainContactEmail}
            />
            <DetailRow
              label="Individual Flag"
              value={accountDetail?.individualFlag}
            />
            <DetailRow
              label="Industry Group"
              value={accountDetail?.industryGroup}
            />
            <DetailRow
              label="Sub Segment"
              value={accountDetail?.industrySubSegment}
            />
            <DetailRow
              label="Parent Account CSN"
              value={accountDetail?.parentIsNamedAccount}
            />
            <DetailRow label="Postal" value={accountDetail?.postal} />
            <DetailRow label="Status" value={accountDetail?.status} />
          </div>
        </div>
      )}
    </>
  );
};

const ContractTab = ({ moduleName }) => {
  const { contractsDetails, contractsDetailsLoading } = useSelector(
    (state) => ({
      contractsDetails: state?.account?.contractsDetails,
      contractsDetailsLoading: state?.account?.contractsDetailsLoading,
    })
  );
  const contract_getRowId = (row) => row?.id;
  const contract_columns = [
    { field: "id", headerName: "ID" },
    { field: "contract_number", headerName: "Contract Number" },
    { field: "contract_startDate", headerName: "Start Date" },
    { field: "contract_endDate", headerName: "End Date" },
    { field: "contract_term", headerName: "Term" },
    { field: "billingBehavior", headerName: "billingBehavior" },
    { field: "subType", headerName: "subType" },
    { field: "contract_duration", headerName: "contract_duration" },
  ];

  return (
    <>
      {contractsDetailsLoading ? (
        <SkeletonLoader isDashboard height="350px" />
      ) : (
        <CommonTable
          rows={contractsDetails}
          columns={contract_columns}
          getRowId={contract_getRowId}
          toolbar
          moduleName={moduleName}
        />
      )}
    </>
  );
};

const InsightSummary = ({ moduleName }) => {
  const { insightMetrics, insightMetricsCsnLoading } = useSelector((state) => ({
    insightMetrics: state?.account?.insightMetricsCsn,
    insightMetricsCsnLoading: state?.account?.insightMetricsCsnLoading,
  }));

  const insight_getRowId = (row) => row?.contractNumber;
  const insight_columns = [
    { field: "contractNumber", headerName: "Contract#" },
    { field: "engagementCategory", headerName: "risk Cat" },
    { field: "premiumFlag", headerName: "Preminum Flag" },
    { field: "productLineCode", headerName: "PLC" },
    { field: "riskCategory", headerName: "Risk Cat" },
    { field: "seatsInUseProRated", headerName: "seatsInUseProRated" },
    { field: "seatsPurchased", headerName: "seatsPurchased" },
    { field: "tenantId", headerName: "tenantId" },
    { field: "usageRate", headerName: "usageRate" },
    { field: "usersAssignedProRated", headerName: "usersAssignedProRated" },
  ];
  return (
    <>
      {insightMetricsCsnLoading ? (
        <SkeletonLoader isDashboard height="350px" />
      ) : (
        <CommonTable
          rows={insightMetrics}
          columns={insight_columns}
          getRowId={insight_getRowId}
          toolbar
          moduleName={moduleName}
        />
      )}
    </>
  );
};

const UsageSummary = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h3
        className="account-link"
        onClick={() => navigate(routesConstants?.GET_USAGE)}
      >
        Click here
      </h3>
      <p className="account-link-para">To go Get Usage Page</p>
    </div>
  );
};

const CustomTabs = ({ moduleName = "" }) => {
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
        return <ContractTab moduleName={moduleName} />;
      case "4":
        return <InsightSummary moduleName={moduleName} />;
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
