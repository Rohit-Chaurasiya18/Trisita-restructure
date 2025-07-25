import CommonButton from "@/components/common/buttons/CommonButton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import useDebounce from "@/hooks/useDebounce";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { getSalesStage } from "@/modules/newQuotation/slice/quotationSlice";
import { getNewOpportunityData } from "@/modules/opportunity/slice/opportunitySlice";
import routesConstants from "@/routes/routesConstants";
import { Tooltip } from "@mui/material";
import moment from "moment";
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
    salesStageList,
    salesStageListLoading,
  } = useSelector((state) => ({
    newOpportunityData: state?.opportunity?.newOpportunityData,
    newOpportunityDataLoading: state?.opportunity?.newOpportunityDataLoading,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    salesStageList: state?.quotation?.salesStage,
    salesStageListLoading: state?.quotation?.salesStageLoading,
  }));

  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const [filters, setFilters] = useState({
    branch: null,
    salesStage: null,
    from_date: "",
    to_date: "",
  });

  const handleDateChange = (newValue) => {
    const [start, end] = newValue;
    setFilters((prev) => ({
      ...prev,
      from_date: start?.format("YYYY-MM-DD") || null,
      to_date: end ? end.format("YYYY-MM-DD") : "",
    }));

    setDateRange(newValue);
  };

  useEffect(() => {
    setFilteredData(newOpportunityData);
  }, [newOpportunityData]);

  useEffect(() => {
    dispatch(getAllBranch());
    dispatch(getSalesStage());
  }, []);

  const debounce = useDebounce(filters?.to_date, 500);

  useEffect(() => {
    const payload = {
      branch: filters?.branch?.value,
      salesStage: filters?.salesStage?.value,
      ...(debounce
        ? {
            from_date: filters?.from_date,
            to_date: debounce,
          }
        : {
            from_date: null,
            to_date: null,
          }),
    };
    dispatch(getNewOpportunityData(payload));
  }, [filters?.branch, filters?.salesStage, debounce]);

  // Table column definitions
  const columns = useMemo(
    () => [
      {
        field: "contract_no",
        headerName: "Opportunity No",
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
        headerName: "Opportunity Date",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      { field: "branch_name", headerName: "Branch", width: 200 },
      {
        field: "bd_person_details",
        headerName: "BD Person",
        width: 200,
        renderCell: ({ value }) => {
          let Arr = value?.join(", ");
          return <div>{Arr}</div>;
        },
      },
      { field: "account_name", headerName: "Account Name", width: 250 },
      { field: "segment", headerName: "Account Group", width: 250 },
      { field: "customer_type", headerName: "Customer Type", width: 250 },
      {
        field: "location",
        headerName: "Location",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "opportunity_category",
        headerName: "Opportunity Category",
        width: 250,
      },
      { field: "opportunity_type", headerName: "Opportunity Type", width: 250 },
      { field: "product_name", headerName: "Product", width: 250 },
      { field: "industry_group", headerName: "Product Line Code", width: 250 },
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
        headerName: "Closure date",
        width: 200,
        renderCell: (params) => <div>{params?.value}</div>,
      },
      {
        field: "created_at",
        headerName: "Created At",
        width: 200,
        renderCell: (params) => (
          <div>{moment(params?.value).format("DD MMM YYYY [at] hh:mm A")}</div>
        ),
      },
      {
        field: "updated_at",
        headerName: "Updated At",
        width: 200,
        renderCell: (params) => (
          <div>{moment(params?.value).format("DD MMM YYYY [at] hh:mm A")}</div>
        ),
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
        </div>
      </div>
      <div className="subscription-header mb-4 opportunity-filter">
        <div className="subscription-filter">
          <CommonButton
            className="common-green-btn"
            onClick={() => {
              setFilters({
                branch: null,
                from_date: null,
                to_date: null,
                salesStage: null,
              });
              setDateRange([null, null]);
            }}
          >
            All
          </CommonButton>
          <CommonDateRangePicker
            value={dateRange}
            onChange={handleDateChange}
            width="180px"
            placeholderStart="Start date"
            placeholderEnd="End date"
            disabled={newOpportunityDataLoading}
          />
          <CommonAutocomplete
            onChange={(event, newValue) => {
              setFilters((prev) => ({
                ...prev,
                salesStage: newValue,
              }));
            }}
            options={salesStageList?.map((item) => ({
              label: item?.name,
              value: item?.id,
            }))}
            label="Select a Sales Stage"
            loading={salesStageListLoading}
            value={filters?.salesStage}
          />
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
