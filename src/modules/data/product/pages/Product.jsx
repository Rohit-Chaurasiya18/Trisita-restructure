import CommonButton from "@/components/common/buttons/CommonButton";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductData } from "../slice/ProductSlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonTable from "@/components/common/dataTable/CommonTable";
import routesConstants from "@/routes/routesConstants";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState([]);
  const { productData, productDataLoading, userDetail } = useSelector(
    (state) => ({
      productData: state?.product?.productData,
      productDataLoading: state?.product?.productDataLoading,
      userDetail: state?.login?.userDetail,
    })
  );
  useEffect(() => {
    dispatch(getProductData());
  }, []);

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "serial_number", headerName: "Serial Number", width: 200 },
    { field: "account_name", headerName: "Account Name", width: 200 },
    { field: "manufacturer", headerName: "Manufacturer", width: 200 },
    { field: "product_type", headerName: "Product Type", width: 200 },
    { field: "product_category", headerName: "Product Category", width: 200 },
    { field: "price", headerName: "Price", width: 200 },
    { field: "product_status", headerName: "Product Status", width: 200 },
    {
      field: "warrenty_startDate",
      headerName: "Warrenty Start Date",
      width: 200,
      renderCell: (params) => (
        <>{params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}</>
      ),
    },
    {
      field: "warrenty_endDate",
      headerName: "Warrenty End Date",
      width: 200,
      renderCell: (params) => (
        <>{params?.value ? moment(params?.value).format("DD/MM/YYYY") : ""}</>
      ),
    },
    { field: "warrenty_period", headerName: "Warrenty Period", width: 200 },
    { field: "assigned_to", headerName: "Assigned To", width: 200 },
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
      width: 250,
      renderCell: ({ value }) => {
        const formattedDateTime = value
          ? moment(value).format("DD/MM/YYYY [at] hh:mm:ss A")
          : "-";
        return <>{formattedDateTime}</>;
      },
    },
  ];
  const exportedData = useMemo(
    () => productData?.filter((item) => selectedId.includes(item?.id)),
    [selectedId, productData]
  );
  const fileName = `product_trisita_${userDetail?.first_name}_${
    userDetail?.last_name
  }_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`;

  const handleSelectionChange = (selectedRows) => {
    setSelectedId([...selectedRows?.ids] || []);
  };
  return (
    <>
      <div className="product-master-container">
        <div className="product-master-header">
          <div>
            <div className="commom-header-title mb-0">Product</div>
            <span className="common-breadcrum-msg">
              we are in the same team
            </span>
          </div>
          <div className="product-master-filter">
            <CommonButton
              className="add-product-master"
              onClick={() => {
                navigate(
                  routesConstants?.PRODUCT + routesConstants?.ADD_PRODUCT
                );
              }}
            >
              Add Product
            </CommonButton>
          </div>
        </div>
        {productDataLoading ? (
          <SkeletonLoader />
        ) : (
          <div>
            <ExportToExcel
              data={exportedData}
              columns={columns}
              fileName={fileName}
              className="insight-export-btn"
              moduleName="Product"
            />
            <h3 className="common-insight-title">Product Data</h3>
            <CommonTable
              rows={productData}
              columns={columns}
              getRowId={(row) => row?.id}
              checkboxSelection
              toolbar
              exportFileName={fileName}
              handleRowSelection={handleSelectionChange}
              moduleName="Product"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Product;
