import CommonButton from "@/components/common/buttons/CommonButton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { getNewOpportunityData } from "@/modules/opportunity/slice/opportunitySlice";
import routesConstants from "@/routes/routesConstants";
import { Tooltip } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NewOpportunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    newOpportunityData,
    newOpportunityDataLoading,
    branch_list,
    branchListLoading,
  } = useSelector((state) => ({
    newOpportunityData: state?.opportunity?.newOpportunityData,
    newOpportunityDataLoading: state?.opportunity?.newOpportunityDataLoading,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
  }));

  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    branch: null,
    status: "All Status",
  });

  useEffect(() => {
    setFilteredData(newOpportunityData);
  }, [newOpportunityData]);

  useEffect(() => {
    dispatch(getNewOpportunityData());
    dispatch(getAllBranch());
  }, []);

  // Table column definitions
  const columns = useMemo(
    () => [
      {
        field: "contract_no",
        headerName: "Proposal No",
        width: 250,
        renderCell: (params) => (
          <Tooltip title={params?.value || ""}>
            <button
              className={`text-red-600  border-0`}
              onClick={() => {
                navigate(
                  routesConstants?.NEW_OPPORTUNITY + `/${params?.row?.id}`
                );
              }}
            >
              <span className="table-cell-truncate">{params.value}</span>
            </button>
          </Tooltip>
        ),
      },
      {
        field: "contract_date",
        headerName: "Proposal Date",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "location",
        headerName: "Location",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      { field: "branch_name", headerName: "Branch", width: 200 },
      { field: "segment", headerName: "Segment", width: 250 },
      {
        field: "bd_person_details",
        headerName: "Trisita Account Manager",
        width: 200,
        renderCell: ({ value }) => {
          let Arr = value?.join(", ");
          return <div>{Arr}</div>;
        },
      },
      { field: "customer_type", headerName: "Customer Type", width: 250 },
      { field: "account_name", headerName: "End User", width: 250 },
      {
        field: "opportunity_category",
        headerName: "Opportunity Category",
        width: 250,
      },
      { field: "opportunity_type", headerName: "Opportunity Type", width: 250 },
      { field: "product_name", headerName: "Product", width: 250 },
      { field: "industry_group", headerName: "Product Category", width: 250 },
      {
        field: "quantity",
        headerName: "Quantity",
        width: 150,
        renderCell: (params) => <div>{Number(params.value)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "acv_price",
        headerName: "ACV Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "acv_total",
        headerName: "Total ACV Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "dtp_price",
        headerName: "DTP Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "dtp_total",
        headerName: "Total DTP Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "last_quoated_price",
        headerName: "Last Quoated Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "total_last_quotated_price",
        headerName: "Total Last Quoated Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "sales_name",
        headerName: "Sales Stage",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "oem_quarter",
        headerName: "OEM Quarter",
        width: 200,
        renderCell: (params) => {
          return (
            <div>{params?.row?.financial_year + " " + params?.row?.quater}</div>
          );
        },
      },
      {
        field: "month",
        headerName: "Month",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "week",
        headerName: "Week",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "sales_update_date",
        headerName: "Sales Update Date",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
    ],
    []
  );

  return (
    <>
      <div className="quotation-header mb-5">
        <div>
          <h5 className="commom-header-title mb-0">New Opportunity</h5>
          <span className="common-breadcrum-msg">
            Manage your new opportunity
          </span>
        </div>
        <div className="quotation-filter">
          <CommonButton
            className="common-green-btn"
            style={{ width: "fit-content" }}
            onClick={() => {
              navigate(
                `${
                  routesConstants?.NEW_OPPORTUNITY +
                  routesConstants?.ADD_NEW_OPPORTUNITY
                }`
              );
            }}
          >
            Add New Opportunity
          </CommonButton>

          {/* <CommonAutocomplete
            onChange={(event, newValue) => {
              setFilters((prev) => ({
                ...prev,
                branch: newValue,
              }));
            }}
            options={branch_list}
            label="Select a Branch"
            loading={branchListLoading}
            value={filters?.branch}
          /> */}
        </div>
      </div>
      {newOpportunityDataLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="new-opp-table">
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row?.id}
            // checkboxSelection
            toolbar
            exportFileName={`new_opp_trisita`}
          />
        </div>
      )}
    </>
  );
};
export default NewOpportunity;
