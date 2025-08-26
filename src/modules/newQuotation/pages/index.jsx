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
import {
  downloadQuotation,
  getNewQuotation,
  lockUnlockQuotation,
  quotationTemplate,
} from "../slice/quotationSlice";
import { toast } from "react-toastify";
import CommonModal from "@/components/common/modal/CommonModal";
import SetTrigger from "@/modules/subscription/components/SetTrigger";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import { FaLock, FaUnlock } from "react-icons/fa";
import DownloadQuotation from "../components/DownloadQuotation";

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
    status: "All Status",
  });
  const [modal, setModal] = useState({
    show: false,
    id: null,
    type: null,
    productDetails: [],
  });

  useEffect(() => {
    dispatch(getNewQuotation());
    dispatch(getAllBranch());
  }, []);

  const handleLockUnlock = (row, is_locked) => {
    dispatch(lockUnlockQuotation({ id: row?.id, status: !is_locked })).then(
      (res) => {
        if (res?.payload?.status === 200) {
          dispatch(getNewQuotation());
          toast.success(
            `Quotation ${!is_locked ? "locked" : "unlocked"} successfully.`
          );
        }
      }
    );
  };

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
              onClick={() => {
                if (params?.row.is_locked && params?.row.is_revise) {
                  toast.error(
                    "You can't update because quotation is already locked and revised."
                  );
                } else {
                  navigate(
                    routesConstants?.NEW_QUOTATION + `/${params?.row?.id}`
                  );
                }
              }}
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
        renderCell: (params) => (
          <span>
            {params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}
          </span>
        ),
      },
      {
        field: "name",
        headerName: "Name",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "locked",
        headerName: "Lock / Unlock",
        width: 150,
        renderCell: (params) => (
          <div className="flex items-center w-full justify-center">
            {!params?.row.is_locked ? (
              <button
                onClick={() => {
                  if (params?.row.is_locked && params?.row.is_revise) {
                    toast.error(
                      "You can't lock because quotation is already locked and revised."
                    );
                  } else {
                    handleLockUnlock(params?.row, params?.row.is_locked);
                  }
                }}
                className={
                  "action-button bg-transparent text-center px-3 py-1 rounded border-0"
                }
              >
                <FaUnlock color="rgb(34 197 94 / 1)" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (params?.row.is_locked && params?.row.is_revise) {
                    toast.error(
                      "You can't unlock because quotation is already locked and revised."
                    );
                  } else {
                    handleLockUnlock(params?.row, params?.row.is_locked);
                  }
                }}
                className={
                  "action-button bg-transparent text-center px-3 py-1 rounded border-0"
                }
              >
                <FaLock color="rgb(239 68 68 / 1)" />
              </button>
            )}
          </div>
        ),
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
        field: "product",
        headerName: "Product Details",
        width: 120,
        renderCell: (params) => (
          <div className="">
            <span
              onClick={() => {
                setModal({
                  show: true,
                  id: params?.row?.id,
                  type: 2,
                  productDetails: params?.row?.product_details,
                });
              }}
              className="assign-button text-black px-3 py-1 rounded border-0"
            >
              Show
            </span>
          </div>
        ),
      },
      {
        field: "sub_total",
        headerName: "Sub Total",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "gst_total",
        headerName: "GST Total",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "grand_total",
        headerName: "Grand Total",
        width: 150,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "valid_until",
        headerName: "Valid Until",
        width: 150,
        renderCell: (params) => (
          <span>
            {params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}
          </span>
        ),
      },
      {
        field: "updated_at",
        headerName: "Updated At",
        width: 200,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "created_by_name",
        headerName: "Created By",
        width: 200,
        renderCell: (params) => <span>{params?.value}</span>,
      },
      {
        field: "created_at",
        headerName: "Created At",
        width: 200,
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
        cellClassName: "",
        renderCell: (params, index,) => (


          <DownloadQuotation
           className="assign-button text-black px-3 py-1 rounded border-0"
            params={params}
          
          />
        ),
      },

      {
        field: "action",
        headerName: "Action",
        width: 200,
        cellClassName: "",
        renderCell: (params, index) => (
          <span
            onClick={() => {
              setModal({
                show: true,
                id: params?.row?.id,
                type: 1,
                productDetails: [],
              });
            }}
            className="assign-button text-black px-3 py-1 rounded border-0"
          >
            Send Quotation
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
    if (filters?.status !== "All Status") {
      data = data?.filter((item) => item?.status === filters?.status);
    }
    setFilteredData(data);
  }, [filters?.branch, filters?.status]);

  const product_master_Columns = [
    {
      field: "product_name",
      headerName: "Product Master",
      width: 450,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>{params?.value}</Tooltip>
      ),
    },
    { field: "quantity", headerName: "Quantity" },
    { field: "selling_amount", headerName: "Selling Amount" },
    {
      field: "total_selling_amount_exc_gst",
      headerName: "Total Selling Amount",
    },
    { field: "purchase_amount", headerName: "Purchase Amount" },
    {
      field: "total_purchase_amount_exc_gst",
      headerName: "Total Purchase Amount",
    },
    { field: "total_acv_amount_exc_gst", headerName: "Total ACV Amount" },
    { field: "sgst_amount", headerName: "SGST Amount (per unit)" },
    { field: "cgst_amount", headerName: "CGST Amount (per unit)" },
    { field: "igst_amount", headerName: "IGST Amount (per unit)" },
  ];
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
            <CommonSelect
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
        {newQuotationListLoading ? (
          <SkeletonLoader />
        ) : (
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row?.id}
            toolbar
            exportFileName={`new_quotation`}
            moduleName="New Quotation"
          />
        )}
      </div>
      <CommonModal
        isOpen={modal.show}
        handleClose={() =>
          setModal({ show: false, id: null, type: null, productDetails: [] })
        }
        scrollable
        title={modal?.type === 1 ? "Send Quotation" : "Product details"}
        size={modal?.type === 1 ? "lg" : "xl"}
      >
        {modal?.type === 1 ? (
          <SetTrigger
            modal={modal}
            isQuotation={true}
            handleClose={() => {
              setModal({
                id: null,
                show: false,
                type: null,
                productDetails: [],
              });
            }}
          />
        ) : (
          <CommonTable
            rows={modal?.productDetails}
            columns={product_master_Columns}
            getRowId={(row) => row?.product_detail_id}
            toolbar
            moduleName="New Quotation"
          />
        )}
      </CommonModal>
    </>
  );
};

export default NewQuotation;
