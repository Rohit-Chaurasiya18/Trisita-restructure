import CommonButton from "@/components/common/buttons/CommonButton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { getFunnelData } from "@/modules/opportunity/slice/opportunitySlice";
import routesConstants from "@/routes/routesConstants";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NewOpportunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { funnelData, funnelDataLoading, branch_list, branchListLoading } =
    useSelector((state) => ({
      funnelData: state?.opportunity?.funnelData,
      funnelDataLoading: state?.opportunity?.funnelDataLoading,
      branch_list: state?.insightMetrics?.branchList,
      branchListLoading: state?.insightMetrics?.branchListLoading,
    }));
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    branch: null,
    status: "All Status",
  });

  useEffect(() => {
    setFilteredData(funnelData);
  }, [funnelData]);

  useEffect(() => {
    dispatch(getFunnelData());
    dispatch(getAllBranch());
  }, []);

  // Table column definitions
  const columns = useMemo(
    () => [
      {
        field: "contract_number",
        headerName: "Contract Number",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "end_user",
        headerName: "End User",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      { field: "customer_type", headerName: "Customer Type", width: 150 },
      { field: "client_type", headerName: "Client Type", width: 150 },
      { field: "account_group", headerName: "Account Group", width: 150 },
      { field: "lead_type", headerName: "Lead Type", width: 150 },
      { field: "product_name", headerName: "Product", width: 150 },
      {
        field: "ome_account_manager",
        headerName: "Ome Account Manager",
        width: 200,
      },
      {
        field: "trisita_account_manager",
        headerName: "Trisita Account Manager",
        width: 200,
      },
      { field: "branch_name", headerName: "Branch", width: 100 },
      {
        field: "product_line_code",
        headerName: "Product Line Code",
        width: 100,
      },
      {
        field: "Quantity",
        headerName: "Quantity",
        width: 150,
        renderCell: (params) => <div>{Number(params.value)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "acv_price",
        headerName: "Total ACV Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "dtp_price",
        headerName: "Total DTP Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value).toFixed(2)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "last_quoted_price",
        headerName: "Last Quoted Price",
        width: 150,
        renderCell: (params) => <div>{Number(params.value)}</div>,
        sortComparator: (v1, v2) => Number(v1) - Number(v2),
      },
      {
        field: "contract_date",
        headerName: "Contract Date",
        width: 150,
        renderCell: ({ value }) => <span>{value}</span>,
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
          {/* <CommonSelect
            value={filters?.status}
            options={[
              { value: "All Status", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Expired", label: "Expired" },
            ]}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                status: e.target.value,
              }));
            }}
          /> */}
          <CommonAutocomplete
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
          />
        </div>
      </div>
      {funnelDataLoading ? (
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
