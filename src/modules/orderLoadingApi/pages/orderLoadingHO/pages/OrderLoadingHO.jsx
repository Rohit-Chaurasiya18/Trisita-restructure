import CommonButton from "@/components/common/buttons/CommonButton";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import routesConstants from "@/routes/routesConstants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderLoadingHO = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  return (
    <div className="order-loading-ho-container">
      <div className="order-loading-ho-header">
        <div>
          <div className="commom-header-title mb-0">Order Loading PO</div>
          <span className="common-breadcrum-msg">we are in the same team</span>
        </div>
        <div className="order-loading-ho-filter">
          <CommonButton
            className="order-loading-ho-btn"
            onClick={() => {
              navigate(
                routesConstants?.ORDER_LOADING_PO +
                  routesConstants?.ORDER_LOADING_PO_LIST
              );
            }}
          >
            Order Loading PO History
          </CommonButton>
        </div>
      </div>
      <div className="order-loading-ho-option">
        <label>Select a type of Order</label>
        <CommonAutocomplete
          onChange={(event, newValue) => {
            setSelectedType(newValue);
            navigate(
              routesConstants?.ORDER_LOADING_PO +
                routesConstants?.ADD_ORDER_LOADING_PO,
              {
                state: {
                  user: newValue,
                },
              }
            );
          }}
          options={[
            { value: "EndUser", label: "EndUser" },
            { value: "ThirdParty", label: "3rd Party" },
          ]}
          label="Select a Order Type"
          value={selectedType}
        />
      </div>
    </div>
  );
};

export default OrderLoadingHO;
