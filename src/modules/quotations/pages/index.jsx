import CommonButton from "@/components/common/buttons/CommonButton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonSearchInput from "@/components/common/inputTextField/CommonSearch";
import { useState } from "react";
import { columns } from "../constants";
import { useNavigate } from "react-router-dom";
import routesConstants from "@/routes/routesConstants";

const Quotations = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const getRowId = (row) => row.id;

  return (
    <>
      <div className="quotation-header">
        <div>
          <h5 className="commom-header-title mb-0">Quotation Master</h5>
          <span className="common-breadcrum-msg">Manage your quotations</span>
        </div>
        <div className="quotation-filter">
          <CommonButton
            className="common-green-btn"
            style={{ width: "fit-content" }}
            onClick={() => {
              navigate(
                `${routesConstants?.QUOTATION + routesConstants?.ADD_QUOTATION}`
              );
            }}
          >
            Add Quotation
          </CommonButton>
          <CommonSearchInput
            value={searchValue}
            label="Search..."
            loading={false}
            debounceTime={500}
            onChange={(text) => {
              console.log("Debounced Search Text:", text);
              setSearchValue(text);
              account_trisita;
            }}
          />
        </div>
      </div>
      <div className="quotation-table">
        <CommonTable
          rows={[]}
          columns={columns}
          getRowId={getRowId}
          checkboxSelection
          toolbar
          exportFileName={`quotation_master`}
        />
      </div>
    </>
  );
};
export default Quotations;
