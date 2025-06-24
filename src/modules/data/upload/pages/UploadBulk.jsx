import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getProductMasterCategory,
  getProductMasterGst,
  getProductMasterOEM,
  getProductMasterUOM,
} from "../../product/slice/ProductSlice";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonButton from "@/components/common/buttons/CommonButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  downloadCSV,
  downloadHistory,
  uploadBulkData,
} from "../slice/UploadSlice";
import { toast } from "react-toastify";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";

const UploadBulk = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { state } = useLocation();
  const {
    productMasterCategory,
    productMasterGst,
    productMasterOEM,
    productMasterUOM,
  } = useSelector((state) => state?.product);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const isAccountTagging = useMemo(
    () => state?.uplodaType === "account_tagging",
    [state]
  );
  const isProductMaster = useMemo(
    () => state?.uplodaType === "price_list",
    [state]
  );
  const isQuotation = useMemo(() => state?.uplodaType === "quotation", [state]);
  useEffect(() => {
    dispatch(getProductMasterCategory());
    dispatch(getProductMasterUOM());
    dispatch(getProductMasterOEM());
    dispatch(getProductMasterGst());
  }, []);

  const pageTitle = useMemo(() => {
    switch (state?.uplodaType) {
      case "price_list":
        return "Product Master";
      case "account_tagging":
        return "Account Tagging";
      case "quotation":
        return "Quotation";
      default:
        break;
    }
  }, [state]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      csvFile: null,
      productCategory: null,
      unitOfMeasure: null,
      oem: null,
      gstType: null,
    },
    validationSchema: Yup.object({
      csvFile:
        isAccountTagging || isProductMaster
          ? Yup.mixed()
              .required("CSV file is required")
              .test("fileType", "Only CSV files are allowed", (value) => {
                return value && value.type === "text/csv";
              })
          : Yup.string().notRequired().nullable(),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      if (isProductMaster) {
        formData.append("csv_file", values?.csvFile);
        formData.append("product_category", values?.productCategory?.value);
        formData.append("uom", values?.unitOfMeasure?.value);
        formData.append("oem", values?.oem?.value);
        formData.append("gst_type", values?.gstType?.value);
      } else if (isAccountTagging) {
        formData.append("file", values?.csvFile);
      }
      dispatch(
        uploadBulkData({ payload: formData, isAccountTagging, isProductMaster })
      ).then((res) => {
        if (res?.payload?.status === 201 || res?.payload?.status === 200) {
          toast.success(res?.payload?.data?.message);
          formik.resetForm();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
        setIsSubmitting(false);
      });
    },
  });

  const handleDownloadHistory = () => {
    dispatch(
      downloadHistory({
        isAccountTagging,
        isProductMaster,
        filter: dateFilter,
      })
    ).then((res) => {
      if (res?.payload?.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res?.payload?.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          isAccountTagging
            ? "account_tagging_history.csv"
            : "product_master_history.csv"
        );
        document.body.appendChild(link);
        link.click();
        toast.success("CSV format downloaded successfully!");
      } else {
      }
    });
  };

  const handleDownloadCSV = () => {
    dispatch(
      downloadCSV({
        isAccountTagging,
        isProductMaster,
      })
    ).then((res) => {
      if (res?.payload?.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res?.payload?.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          isAccountTagging
            ? "account_tagging_format.csv"
            : "product_master_format.csv"
        );
        document.body.appendChild(link);
        link.click();
        toast.success("CSV format downloaded successfully!");
      } else {
      }
    });
  };

  const handleDateChange = (newValue) => {
    const [start, end] = newValue;
    setDateFilter(() => ({
      startDate: start?.format("YYYY-MM-DD") || "",
      endDate: end ? end.format("YYYY-MM-DD") : "",
    }));
    setDateRange(newValue);
  };

  return (
    <div className="order-loading-ho-container">
      <div className="order-loading-ho-header upload-container">
        <div>
          <div className="commom-header-title mb-0">Upload {pageTitle}</div>
          <span className="common-breadcrum-msg">we are in the same team</span>
        </div>
        {!isQuotation && (
          <div className="upload-bulk-filter">
            <CommonDateRangePicker
              value={dateRange}
              onChange={handleDateChange}
              width="180px"
              placeholderStart="Start date"
              placeholderEnd="End date"
            />
            <CommonButton
              className="order-loading-ho-btn"
              onClick={handleDownloadHistory}
            >
              Download History
            </CommonButton>
            <CommonButton
              className="order-loading-ho-btn"
              onClick={handleDownloadCSV}
            >
              Download CSV Format
            </CommonButton>
          </div>
        )}
      </div>
      {(isAccountTagging || isProductMaster) && (
        <div className="add-account-form">
          <h2 className="title">Bulk {pageTitle} Form</h2>
          <form className="">
            {(isAccountTagging || isProductMaster) && (
              <div className="form-group">
                <label className="form-label label requiredText">
                  CSV File<span className="text-danger"> *</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  className={`form-control ${
                    formik.errors?.csvFile && formik.touched?.csvFile
                      ? "is-invalid"
                      : ""
                  } input`}
                  name="csvFile"
                  id="csvFile"
                  accept=".csv"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue("csvFile", e.target.files[0])
                  }
                />
                {formik.errors?.csvFile && formik.touched?.csvFile && (
                  <div class="invalid-feedback ">{formik.errors?.csvFile}</div>
                )}
              </div>
            )}
            {isProductMaster && (
              <>
                <CustomSelect
                  label="Product Category"
                  name="productCategory"
                  options={productMasterCategory?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                  placeholder="Select a Product Category"
                  value={formik.values?.productCategory}
                  onChange={(selected) =>
                    formik.setFieldValue("productCategory", selected)
                  }
                />
                <CustomSelect
                  label="Unit of Measure"
                  name="unitOfMeasure"
                  options={productMasterUOM?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                  placeholder="Select a Unit of Measure"
                  value={formik.values?.unitOfMeasure}
                  onChange={(selected) =>
                    formik.setFieldValue("unitOfMeasure", selected)
                  }
                />
                <CustomSelect
                  label="OEM"
                  name="oem"
                  options={productMasterOEM?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                  placeholder="Select a OEM"
                  value={formik.values?.oem}
                  onChange={(selected) => formik.setFieldValue("oem", selected)}
                />
                <CustomSelect
                  label="GST Type"
                  name="gstType"
                  options={productMasterGst?.map((item) => ({
                    label: item?.name + " " + item?.value,
                    value: item?.id,
                  }))}
                  placeholder="Select a GST Type"
                  value={formik.values?.gstType}
                  onChange={(selected) => {
                    formik.setFieldValue("gstType", selected);
                  }}
                />
              </>
            )}
            <CommonButton
              onClick={() => {
                formik.handleSubmit();
              }}
              type="button"
              className="add-account-btn"
              isDisabled={isSubmitting}
            >
              Upload Bulk
            </CommonButton>
          </form>
        </div>
      )}
    </div>
  );
};
export default UploadBulk;
