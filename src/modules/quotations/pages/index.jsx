import CommonButton from "@/components/common/buttons/CommonButton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonSearchInput from "@/components/common/inputTextField/CommonSearch";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import routesConstants from "@/routes/routesConstants";
import { useDispatch, useSelector } from "react-redux";
import { getQuotationData } from "../slice/quotationSlice";
import moment from "moment";
import ExportToExcel from "@/components/common/buttons/ExportToExcel";

const Quotations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);

  const getRowId = (row) => row.id;
  useEffect(() => {
    dispatch(getQuotationData());
  }, []);

  const { quotationData, userDetail } = useSelector((state) => ({
    quotationData: state?.quotation?.quotationData,
    userDetail: state?.login?.userDetail,
  }));

  const filterData = (data, text) => {
    return data?.filter((row) => {
      return Object.values(row).some(
        (value) =>
          value && value.toString().toLowerCase().includes(text.toLowerCase())
      );
    });
  };

  useEffect(() => {
    let data = quotationData;
    if (searchValue) {
      data = filterData(data, searchValue?.trim());
    }
    setFilteredData(data);
  }, [quotationData]);

  const columns = [
    { field: "quotation_date", headerName: "Quotation Date", width: 150 },
    { field: "quotation_no", headerName: "Quotation No", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "general_total", headerName: "General Total", width: 150 },
    { field: "sales_stage", headerName: "Sales Stage", width: 150 },
    { field: "opportunity", headerName: "Opportunity", width: 150 },
    { field: "account", headerName: "Account", width: 150 },
    { field: "billing_contact", headerName: "Billing Contact", width: 150 },
    { field: "valid_until", headerName: "Valid Until", width: 150 },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 150,
      renderCell: (params, index) => (
        <span
          title={moment(params?.row?.updated_at).format(
            "DD MMM YYYY [at] hh:mm A"
          )}
        >
          {moment(params?.row?.updated_at).format("DD MMM YYYY [at] hh:mm A")}
        </span>
      ),
    },
    { field: "updated_by", headerName: "Updated By", width: 150 },
    {
      field: "created_at",
      headerName: "Created At",
      width: 150,
      renderCell: (params, index) => (
        <span
          title={moment(params?.row?.created_at).format(
            "DD MMM YYYY [at] hh:mm A"
          )}
        >
          {moment(params?.row?.created_at).format("DD MMM YYYY [at] hh:mm A")}
        </span>
      ),
    },
    { field: "created_by", headerName: "Created By", width: 150 },
  ];

  const handleSelectionChange = (selectedRows) => {
    const idArray = [...selectedRows?.ids];
    if (idArray?.length > 0) {
      setSelectedId(idArray);
    } else {
      setSelectedId([]);
    }
  };

  const exportedData = useMemo(
    () => filteredData?.filter((item) => selectedId.includes(item?.id)),
    [selectedId]
  );

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
            label="Search Quotation"
            loading={false}
            debounceTime={400}
            onChange={(text) => {
              setSearchValue(text);
              if (text?.trim()) {
                const data = filterData(quotationData, text?.trim());
                setFilteredData(data);
              } else {
                setFilteredData(quotationData);
              }
            }}
          />
        </div>
      </div>
      <div className="quotation-table">
        <ExportToExcel
          data={exportedData}
          columns={columns}
          fileName={`quotation_master_${userDetail?.first_name}_${
            userDetail?.last_name
          }_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`}
          className="account-export-btn"
        />
        <CommonTable
          rows={filteredData}
          columns={columns}
          getRowId={getRowId}
          checkboxSelection
          handleRowSelection={handleSelectionChange}
          toolbar
          exportFileName={`quotation_master_${userDetail?.first_name}_${userDetail?.last_name}`}
        />
      </div>
    </>
  );
};
export default Quotations;
