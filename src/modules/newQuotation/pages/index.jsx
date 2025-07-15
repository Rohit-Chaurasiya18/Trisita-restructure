import CommonButton from "@/components/common/buttons/CommonButton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import routesConstants from "@/routes/routesConstants";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Tooltip } from "@mui/material";
import { downloadQuotation, getNewQuotation } from "../slice/quotationSlice";
import { toast } from "react-toastify";

const NewQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    newQuotationList,
    newQuotationListLoading,
    branch_list,
    branchListLoading,
  } = useSelector((state) => ({
    newQuotationList: state?.quotation?.newQuotationList,
    newQuotationListLoading: state?.quotation?.newQuotationListLoading,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
  }));
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    branch: null,
  });

  useEffect(() => {
    dispatch(getNewQuotation());
    dispatch(getAllBranch());
  }, []);

  // Table column definitions
  const columns = useMemo(
    () => [
      {
        field: "quotation_no",
        headerName: "Quotation Number",
        width: 300,
        renderCell: (params) => (
          <Tooltip title={params?.value || ""}>
            <button
              className={`text-red-600  border-0`}
              onClick={() =>
                navigate(routesConstants?.NEW_QUOTATION + `/${params?.row?.id}`)
              }
            >
              <span className="table-cell-truncate">{params.value}</span>
            </button>
          </Tooltip>
        ),
      },
      {
        field: "quotation_date",
        headerName: "Opportunity Date",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "name",
        headerName: "Name",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "sales_stage_name",
        headerName: "Sales Stage Name",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "opportunity",
        headerName: "Opportunity",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "account_name",
        headerName: "Account Name",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "billing_contact",
        headerName: "Billing Contact",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "branch_name",
        headerName: "Branch",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "valid_until",
        headerName: "Valid Until",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "updated_at",
        headerName: "Updated At",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "created_by_name",
        headerName: "Created By",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
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
      {
        field: "download_btn",
        headerName: "Download Quotation",
        width: 200,
        cellClassName: "text-center",
        renderCell: (params, index) => (
          <span
            onClick={() => {
              dispatch(downloadQuotation(params?.row?.id)).then((res) => {
                if (res?.payload) {
                  const blob = new Blob([res.payload], {
                    type: "application/pdf",
                  });
                  const url = URL.createObjectURL(blob);

                  // ✅ Open in new tab
                  window.open(url, "_blank");

                  // Optional: Revoke object URL after use
                  setTimeout(() => URL.revokeObjectURL(url), 500);
                } else {
                  toast.error("Failed to download quotation.");
                }
              });
            }}
            className="assign-button text-black px-3 py-1 rounded border-0"
          >
            Download Quotation
          </span>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    setFilteredData(newQuotationList);
  }, [newQuotationList]);

  useEffect(() => {
    let data = newQuotationList;
    if (filters?.branch?.value) {
      data = data?.filter((item) => item?.branch === filters?.branch?.value);
    }
    setFilteredData(data);
  }, [filters?.branch]);

  return (
    <>
      <div className="new-opportunity-container">
        <div className="quotation-header mb-5">
          <div>
            <h5 className="commom-header-title mb-0">New Quotation</h5>
            <span className="common-breadcrum-msg">
              Manage your new quotation
            </span>
          </div>
          <div className="quotation-filter">
            <CommonButton
              className="common-green-btn"
              style={{ width: "fit-content" }}
              onClick={() => {
                navigate(
                  `${
                    routesConstants?.NEW_QUOTATION +
                    routesConstants?.ADD_NEW_QUOTATION
                  }`
                );
              }}
            >
              Add New Quotation
            </CommonButton>
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
        {newQuotationListLoading ? (
          <SkeletonLoader />
        ) : (
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row?.id}
            toolbar
            exportFileName={`new_opportunity`}
          />
        )}
      </div>
    </>
  );
};

export default NewQuotation;
