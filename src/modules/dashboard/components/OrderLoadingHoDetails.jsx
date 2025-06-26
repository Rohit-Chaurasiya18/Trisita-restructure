import CommonTable from "@/components/common/dataTable/CommonTable";
import { Tooltip } from "@mui/material";
import { useSelector } from "react-redux";

const OrderLoadingHoDetails = ({ selected }) => {
  const { orderLoadingHoDetail, orderLoadingHoDetailLoading } = useSelector(
    (state) => ({
      orderLoadingHoDetail: state?.dashboard?.orderLoadingHoDetail,
      orderLoadingHoDetailLoading:
        state?.dashboard?.orderLoadingHoDetailLoading,
    })
  );
  const product_master_Columns = [
    {
      field: "product_master_name",
      headerName: "Product Master",
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""}>
          <span className="whitespace-normal break-words overflow-hidden line-clamp-3">
            {params?.value}
          </span>
        </Tooltip>
      ),
    },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "selling_amount", headerName: "Selling Amount", flex: 1 },
    {
      field: "total_selling_amount_exc_gst",
      headerName: "Total Selling Amount (Ex GST)",
      flex: 1,
    },
    { field: "purchase_amount", headerName: "Purchase Amount", flex: 1 },
    {
      field: "total_purchase_amount_exc_gst",
      headerName: "Total Purchase Amount (Ex GST)",
      flex: 1,
    },
    {
      field: "total_acv_amount_exc_gst",
      headerName: "Total ACV Amount (Ex GST)",
      flex: 1,
    },
    { field: "sgst_amount", headerName: "SGST Amount (per unit)", flex: 1 },
    { field: "cgst_amount", headerName: "CGST Amount (per unit)", flex: 1 },
    { field: "igst_amount", headerName: "IGST Amount (per unit)", flex: 1 },
  ];

  const purchase_columns = [
    {
      field: "purchase_from_name",
      headerName: "Purchase From",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""}>
          <span className="whitespace-normal break-words overflow-hidden line-clamp-3">
            {params?.value}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "purchase_invoice_number",
      headerName: "Purchase Invoice Number",
      flex: 1,
    },
    {
      field: "purchase_invoice_date",
      headerName: "Purchase Invoice Date",
      flex: 1,
    },
    {
      field: "purchase_invoice_amount_ex_gst",
      headerName: "Purchase Invoice Amount (Ex GST)",
      flex: 1,
    },
    {
      field: "purchase_gst_amount",
      headerName: "Purchase GST Amount",
      flex: 1,
    },
    {
      field: "total_purchase_invoice_amount_inc_gst",
      headerName: "Total Purchase Invoice Amount (Inc GST)",
      flex: 1,
    },
    {
      field: "purchase_invoice",
      headerName: "Invoice Document",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <a href={`${params.value}`} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        ) : (
          "No File"
        ),
    },
  ];

  const payment_columns = [
    { field: "payment_no", headerName: "Payment No", flex: 1 },
    { field: "payment_method", headerName: "Payment Method", flex: 1 },
    { field: "payment_status", headerName: "Payment Status", flex: 1 },
    {
      field: "payment_received_amount",
      headerName: "Received Amount",
      flex: 1,
    },
    { field: "payment_date", headerName: "Payment Date", flex: 1 },
  ];

  return (
    <>
      <CommonTable
        rows={
          selected?.type === 1
            ? orderLoadingHoDetail?.product_details
            : selected?.type === 2
            ? orderLoadingHoDetail?.purchase_invoice
            : selected?.type === 3
            ? orderLoadingHoDetail?.payment
            : []
        }
        columns={
          selected?.type === 1
            ? product_master_Columns
            : selected?.type === 2
            ? purchase_columns
            : selected?.type === 3
            ? payment_columns
            : []
        }
        getRowId={(row) => row?.id}
        toolbar
      />
    </>
  );
};

export default OrderLoadingHoDetails;
