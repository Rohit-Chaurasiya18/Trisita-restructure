import CommonTable from "@/components/common/dataTable/CommonTable";
import { Tooltip } from "@mui/material";

const ProductDetailModal = ({
  data = [],
  handleDeleteRow,
  handleRowSelect,
  moduleName = "",
}) => {
  const columns = [
    {
      field: "id",
      headerName: "SR No",
      width: 100,
    },
    {
      field: "product_master_label",
      headerName: "Product Master",
      width: 450,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <button
            className={`text-red-600  border-0`}
            onClick={() => {
              handleRowSelect(params?.row);
            }}
          >
            <span className="table-cell-truncate">{params.value}</span>
          </button>
        </Tooltip>
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
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <button
          className="text-red-600 border-0"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="product-detail-modal">
      <CommonTable
        rows={data}
        columns={columns}
        getRowId={(row) => row?.id}
        toolbar
        moduleName={moduleName}
      />
    </div>
  );
};

export default ProductDetailModal;
