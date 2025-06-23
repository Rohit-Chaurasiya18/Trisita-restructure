import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import routesConstants from "@/routes/routesConstants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="order-loading-ho-container">
      <div className="order-loading-ho-header">
        <div>
          <div className="commom-header-title mb-0">Upload</div>
          <span className="common-breadcrum-msg">we are in the same team</span>
        </div>
      </div>
      <div className="order-loading-ho-option">
        <label>Select a type of Upload</label>
        <CommonAutocomplete
          onChange={(event, newValue) => {
            setSelected(newValue);
            navigate(routesConstants?.UPLOAD + routesConstants?.UPLOAD_BULK, {
              state: {
                uplodaType: newValue?.value,
              },
            });
          }}
          options={[
            { value: "price_list", label: "Price List" },
            { value: "account_tagging", label: "Account Tagging" },
            { value: "quotation", label: "Quotation" },
          ]}
          label="Select a Upload Type"
          value={selected}
        />
      </div>
    </div>
  );
};

export default Upload;
