import CommonButton from "@/components/common/buttons/CommonButton";

const OrderLoadingDistributor = () => {
  const openLinkInNewTab = (url) => {
    window.open(url, "_blank");
  };
  return (
    <>
      <div>
        <div className="order-loading-ho-header">
          <div>
            <div className="commom-header-title mb-0">
              Order Loading Distributor
            </div>
            <span className="common-breadcrum-msg">
              we are in the same team
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="order-loading-distributor">
            <CommonButton
              className="btn-1"
              onClick={() => openLinkInNewTab("https://in.datechportal.com/en")}
            >
              Tech Data Advanced Private Limited
            </CommonButton>
            <CommonButton
              className="btn-2"
              onClick={() =>
                openLinkInNewTab(
                  "https://redingtonconnect.com/Autodesk/partner/Dashboard"
                )
              }
            >
              Redington Limited
            </CommonButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderLoadingDistributor;
