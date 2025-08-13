import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductMasterData } from "../slice/ProductSlice";

import CommonButton from "@/components/common/buttons/CommonButton";
import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import CommonSearchInput from "@/components/common/inputTextField/CommonSearch";
import CommonTable from "@/components/common/dataTable/CommonTable";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import routesConstants from "@/routes/routesConstants";
import moment from "moment";

const statusOptions = [
  { value: "All Status", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "In Active" },
];

const ProductMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "Active",
    searchValue: "",
  });
  const [selectedId, setSelectedId] = useState([]);

  const { productMasterData, productMasterDataLoading, userDetail } =
    useSelector((state) => ({
      productMasterData: state?.product?.productMasterData,
      productMasterDataLoading: state?.product?.productMasterDataLoading,
      userDetail: state?.login?.userDetail,
    }));

  // Fetch data on status change
  useEffect(() => {
    dispatch(getProductMasterData({ status: filters.status }));
  }, [filters.status]);

  // Filter data by search text
  const filteredData = useMemo(() => {
    if (!filters.searchValue) return productMasterData || [];
    return productMasterData?.filter((row) =>
      Object.values(row).some((value) =>
        value
          ?.toString()
          .toLowerCase()
          .includes(filters.searchValue.toLowerCase())
      )
    );
  }, [filters.searchValue, productMasterData]);

  // Prepare data to export
  const exportedData = useMemo(
    () => filteredData?.filter((item) => selectedId.includes(item?.id)),
    [selectedId, filteredData]
  );

  const fileName = `product_master_trisita_${userDetail?.first_name}_${
    userDetail?.last_name
  }_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`;

  const handleSelectionChange = (selectedRows) => {
    setSelectedId([...selectedRows?.ids] || []);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""}>
          <span
            className="text-red-600 cursor-pointer"
            onClick={() =>
              navigate(
                routesConstants?.PRODUCT_MASTER +
                  routesConstants?.UPDATE_PRODUCT_MASTER +
                  params?.id
              )
            }
          >
            {params?.value}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "product_category_name",
      headerName: "Product Category",
      width: 200,
    },
    { field: "acv_price_decimal", headerName: "ACV Price" },
    { field: "dtp_price_decimal", headerName: "DTP Price" },
    { field: "uom_name", headerName: "UOM" },
    { field: "oem_name", headerName: "OEM" },
    { field: "gst_type_name", headerName: "GST Type", width: 150 },
    {
      field: "gst_ammount_decimal",
      headerName: "Total Amount(Inc GST)",
      width: 150,
    },
    { field: "status_name", headerName: "Status", width: 150 },
    {
      field: "product_description",
      headerName: "Product Description",
      width: 250,
    },
    { field: "product_sku", headerName: "Product SKU", width: 150 },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 150,
      renderCell: (params) => (
        <>{params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}</>
      ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => (
        <>{params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}</>
      ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 250,
      renderCell: ({ value }) => {
        const formattedDateTime = value
          ? moment(value).format("DD/MM/YYYY [at] hh:mm:ss A")
          : "-";
        return <>{formattedDateTime}</>;
      },
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 200,
      renderCell: ({ value }) => {
        const formattedDateTime = value
          ? moment(value).format("DD/MM/YYYY [at] hh:mm:ss A")
          : "-";
        return <>{formattedDateTime}</>;
      },
    },
  ];

  return (
    <div className="product-master-container">
      <div className="product-master-header">
        <div>
          <div className="commom-header-title mb-0">Product Master</div>
          <span className="common-breadcrum-msg">we are in the same team</span>
        </div>
        <div className="product-master-filter">
          <CommonSelect
            value={filters.status}
            options={statusOptions}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          />
          <CommonButton
            className="add-product-master"
            onClick={() => {
              navigate(
                routesConstants?.PRODUCT_MASTER +
                  routesConstants?.ADD_PRODUCT_MASTER
              );
            }}
          >
            Add Product Master
          </CommonButton>
          <CommonSearchInput
            value={filters.searchValue}
            label="Search..."
            onChange={(text) =>
              setFilters((prev) => ({ ...prev, searchValue: text }))
            }
          />
        </div>
      </div>

      {productMasterDataLoading ? (
        <SkeletonLoader />
      ) : (
        <div>
          <ExportToExcel
            data={exportedData}
            columns={columns}
            fileName={fileName}
            className="insight-export-btn"
            moduleName="Product Master"
          />
          <h3 className="common-insight-title">Product Master Data</h3>
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row?.id}
            checkboxSelection
            toolbar
            exportFileName={fileName}
            handleRowSelection={handleSelectionChange}
            moduleName="Product Master"
          />
        </div>
      )}
    </div>
  );
};

export default ProductMaster;
