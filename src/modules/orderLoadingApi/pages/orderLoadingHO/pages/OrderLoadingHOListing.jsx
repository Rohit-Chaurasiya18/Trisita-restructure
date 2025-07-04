import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import CommonSearchInput from "@/components/common/inputTextField/CommonSearch";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import {
  getOrderLoadingPo,
  updateLockUnlockStatus,
} from "@/modules/dashboard/slice";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaLock, FaUnlock } from "react-icons/fa";
import CommonModal from "@/components/common/modal/CommonModal";
import SetOrderAction from "@/modules/dashboard/components/SetOrderAction";
import OrderLoadingHoDetails from "@/modules/dashboard/components/OrderLoadingHoDetails";
import { getOrderLoadingHOList } from "@/modules/orderLoadingApi/slice/OrderLoadingApiSlice";
import CommonButton from "@/components/common/buttons/CommonButton";
import routesConstants from "@/routes/routesConstants";
import { useNavigate } from "react-router-dom";

const OrderLoadingHOListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    orderLoadingHOList,
    orderLoadingHOLoading,
    branch_list,
    branchListLoading,
  } = useSelector((state) => ({
    orderLoadingHOList: state?.orderLoadingApi?.orderLoadingHOList,
    orderLoadingHOLoading: state?.orderLoadingApi?.orderLoadingHOLoading,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
  }));

  const [selected, setSelected] = useState({
    isOpen: false,
    type: null,
  });
  const [filters, setFilters] = useState({
    branch: null,
    search: "",
  });

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getOrderLoadingHOList());
    dispatch(getAllBranch());
  }, []);

  useEffect(() => {
    setFilteredData(orderLoadingHOList);
  }, [orderLoadingHOList]);

  const ShowTablesDetailsList = (id, type) => {
    dispatch(getOrderLoadingPo(id));
    setSelected({
      isOpen: true,
      type: type,
    });
  };

  const updateLockUnlock = (id, status) => {
    dispatch(updateLockUnlockStatus({ id, status })).then((res) => {
      if (res?.payload?.status === 200) {
        let data = filteredData?.map((item) => {
          if (item?.id === id) {
            return { ...item, locked: status };
          }
          return item;
        });
        setFilteredData(data);
        toast.success(`Order ${status ? "locked" : "unlocked"} successfully!`);
      }
    });
  };

  const columns = [
    {
      field: "order_number",
      headerName: "Order Number",
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <button
            className={`text-red-600 ${
              params?.row?.locked ? "cursor-not-allowed" : ""
            } border-0`}
            onClick={
              !params.row.locked
                ? () =>
                    navigate(
                      routesConstants?.ORDER_LOADING_PO +
                        routesConstants?.UPDATE_ORDER_LOADING_PO +
                        `/${params?.id}`
                    )
                : null
            }
            disabled={params?.row?.locked}
          >
            <span className="table-cell-truncate">{params.value}</span>
          </button>
        </Tooltip>
      ),
      width: 280,
    },
    { field: "order_type", headerName: "Order Type", width: 150 },
    { field: "user_type", headerName: "User Type", width: 150 },
    {
      field: "locked",
      headerName: "Lock / Unlock",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center w-full justify-center">
          {!params?.row.locked ? (
            <button
              // onClick={
              //   userType === "Superadmin"
              //     ? () => toggleLock(params?.row.id, "true")
              //     : null
              // }
              // className={`action-button bg-transparent text-black px-3 py-1 rounded
              //   ${
              //   userType !== "Superadmin" && "cursor-not-allowed"
              // }
              //   `}
              onClick={() => {
                dispatch(updateLockUnlock(params?.row.id, true));
              }}
              className={
                "action-button bg-transparent text-center px-3 py-1 rounded border-0"
              }
            >
              <FaUnlock color="rgb(34 197 94 / 1)" />
            </button>
          ) : (
            <button
              // onClick={
              //   userType === "Superadmin"
              //     ? () => toggleLock(params?.row.id, "false")
              //     : null
              // }
              // className={`action-button bg-transparent text-black px-3 py-1 rounded ${
              //   userType !== "Superadmin" && "cursor-not-allowed"
              // }`}
              // disabled={userType !== "Superadmin"}
              onClick={() => {
                dispatch(updateLockUnlock(params?.row.id, false));
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
      field: "order_loading_date",
      headerName: "Order Loading Date",
      width: 200,
    },
    { field: "branch_name", headerName: "Branch", width: 200 },
    { field: "bd_person_name", headerName: "BD Person", width: 200 },

    {
      field: "account_name",
      headerName: "Account",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    { field: "po_number", headerName: "PO Number", width: 200 },
    {
      field: "po_date",
      headerName: "PO Date",
      width: 200,
    },
    {
      field: "po_copy",
      headerName: "PO Copy",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <a href={`${params.value}`} target="_blank" rel="noopener noreferrer">
            Download PO Copy {params.value}
          </a>
        ) : (
          "No File"
        ),
    },
    {
      field: "client_po_copy",
      headerName: "Client PO Copy",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <a href={`${params.value}`} target="_blank" rel="noopener noreferrer">
            Download Client PO Copy
          </a>
        ) : (
          "No File"
        ),
    },
    {
      field: "third_party_account_name",
      headerName: "Third Party Account",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "billing_address",
      headerName: "Billing Address",
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "billing_gst_number",
      headerName: "Billing GST Number",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "shipping_address",
      headerName: "Shipping Address",
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "shipping_gst_number",
      headerName: "Shipping GST Number",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "product",
      headerName: "Product Details",
      width: 150,
      renderCell: (params) => (
        <div className="text-center">
          <span
            onClick={() => ShowTablesDetailsList(params?.row?.id, 1)}
            className="assign-button text-black px-3 py-1 rounded border-0"
          >
            Show
          </span>
        </div>
      ),
    },

    {
      field: "do_slip",
      headerName: "DO Slip",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <a href={`${params.value}`} target="_blank" rel="noopener noreferrer">
            Download DO Slip
          </a>
        ) : (
          "No File"
        ),
    },
    {
      field: "license_contract_manager_name",
      headerName: "License Contract Manager Name",
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "license_contract_manager_phone",
      headerName: "License Contract Manager Phone",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "license_contract_manager_email_id",
      headerName: "License Contract Manager Email",
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "proposed_license_activation_date",
      headerName: "Proposed License Activation",
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "proposed_order_loading_date",
      headerName: "Proposed License Activation Date",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      field: "manual_cif_form",
      headerName: "Manual CIF Form",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <a href={`${params.value}`} target="_blank" rel="noopener noreferrer">
            Download Manual CIF Form
          </a>
        ) : (
          "No File"
        ),
    },

    {
      field: "selling_payment_terms",
      headerName: "Selling Payment Terms",
      width: 200,
      renderCell: (params) => (
        <div>{params.value !== null ? `${params.value} days` : ""}</div>
      ),
    },
    {
      field: "purchase_payment_terms",
      headerName: "Purchase Payment Terms",
      width: 200,
      renderCell: (params) => (
        <div>{params.value !== null ? `${params.value} days` : ""}</div>
      ),
    },
    {
      field: "license_activation_date",
      headerName: "License Activation Date",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "license_certificate",
      headerName: "License Certificate",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <a href={`${params.value}`} target="_blank" rel="noopener noreferrer">
            Download License Certificate
          </a>
        ) : (
          "No File"
        ),
    },
    {
      field: "sales_invoice_number",
      headerName: "Sales Invoice Number",
      width: 200,
    },
    {
      field: "sales_invoice_date",
      headerName: "Sales Invoice Date",
      width: 200,
    },
    {
      field: "sales_invoice_amount_ex_gst",
      headerName: "Sales Invoice Amount (Ex GST)",
      width: 250,
    },
    {
      field: "sales_gst_amount",
      headerName: "Sales GST Amount (18%)",
      width: 200,
    },
    {
      field: "tota_sales_invoice_amount_inc_gst",
      headerName: "Total Sales Invoice Amount (Inc GST)",
      width: 250,
    },
    {
      field: "purchase",
      headerName: "Purchase Invoice",
      width: 150,
      renderCell: (params) => (
        <div className="text-center">
          <span
            onClick={() => ShowTablesDetailsList(params?.row?.id, 2)}
            className="assign-button text-black px-3 py-1 rounded border-0"
          >
            Show
          </span>
        </div>
      ),
    },

    {
      field: "payment",
      headerName: "Payment Details",
      width: 150,
      renderCell: (params) => (
        <div className="text-center">
          <span
            onClick={() => ShowTablesDetailsList(params?.row?.id, 3)}
            className="assign-button text-black px-3 py-1 rounded border-0"
          >
            Show
          </span>
        </div>
      ),
    },
    {
      field: "balance_amount",
      headerName: "Balance Amount (Inc GST)",
      width: 200,
    },
    {
      field: "payment_delayed_by_days",
      headerName: "Payment Delayed By Days",
      width: 200,
      renderCell: (params) => (
        <div>{params.value !== null ? `${params.value} days` : ""}</div>
      ),
    },
    {
      field: "branch_interest_per_month",
      headerName: "Branch Interest Per Month",
      width: 200,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span className="table-cell-truncate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params, index) => (
        <div className="text-center">
          <span
            onClick={() => {
              if (params?.row.locked) return;
              setSelected({
                isOpen: true,
                type: 4,
              });
            }}
            className={`assign-button text-black px-3 py-1 rounded border-0 ${
              params?.row.locked && "cursor-not-allowed"
            }`}
          >
            Action
          </span>
        </div>
      ),
    },
    ,
  ];

  useEffect(() => {
    let filteredList = orderLoadingHOList;
    if (filters?.branch?.label || filters?.search) {
      if (filters?.branch?.label) {
        filteredList = filteredList?.filter(
          (item) => item?.branch_name === filters?.branch?.label
        );
      }
      if (filters?.search) {
        filteredList = filteredList?.filter((item) =>
          Object.values(item).some((value) =>
            value
              ?.toString()
              .toLowerCase()
              .includes(filters?.search?.toLowerCase())
          )
        );
      }
      setFilteredData(filteredList);
    } else {
      setFilteredData(filteredList);
    }
  }, [filters?.branch, filters?.search]);

  return (
    <>
      <div className="renewal-email-sent-header mb-4">
        <div>
          <h3 className="mb-0 commom-header-title">List of Order Loading PO</h3>
          <span className="common-breadcrum-msg">
            Welcome to your List of Order Loading PO
          </span>
        </div>
        <div className="subscription-filter">
          <CommonAutocomplete
            onChange={(event, newValue) => {
              setFilters((prev) => ({
                ...prev,
                branch: newValue,
              }));
            }}
            options={branch_list}
            label="Select a Branch"
            loading={branchListLoading || orderLoadingHOLoading}
            value={filters?.branch}
          />
          <CommonSearchInput
            value={filters?.search}
            label="Search..."
            onChange={(text) =>
              setFilters((prev) => ({ ...prev, search: text }))
            }
          />
          <CommonButton
            className="common-btn-orderLoadingHO"
            onClick={() => {
              navigate(routesConstants?.ORDER_LOADING_PO);
            }}
          >
            Add Order Loading PO
          </CommonButton>
        </div>
      </div>
      {orderLoadingHOLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="payments-overdue-table">
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row?.id}
            toolbar
          />
        </div>
      )}
      <CommonModal
        isOpen={selected?.isOpen}
        handleClose={() => {
          setSelected((prev) => ({ ...prev, isOpen: false, type: null }));
        }}
        size={selected?.type === 4 ? "l" : "xl"}
        title={
          selected?.type === 1
            ? "Product Details"
            : selected?.type === 2
            ? "Purchase Details"
            : selected?.type === 3
            ? "Payments Details"
            : selected?.type === 4
            ? "Set Actions"
            : ""
        }
      >
        {selected?.type === 4 ? (
          <SetOrderAction />
        ) : (
          <OrderLoadingHoDetails selected={selected} />
        )}
      </CommonModal>
    </>
  );
};

export default OrderLoadingHOListing;
