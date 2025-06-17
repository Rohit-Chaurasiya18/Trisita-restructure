import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import AddIcon from "@mui/icons-material/Add";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  addUpdateProductMaster,
  getProductMasterById,
  getProductMasterCategory,
  getProductMasterGst,
  getProductMasterOEM,
  getProductMasterStatus,
  getProductMasterUOM,
} from "../slice/ProductSlice";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonModal from "@/components/common/modal/CommonModal";
import AddOptions from "../components/AddOptions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import routesConstants from "@/routes/routesConstants";
import { toast } from "react-toastify";

const findData = (Arr, CurrentId) => {
  let obj = Arr?.find((item) => item?.id === +CurrentId);
  let result = {
    label: obj?.name,
    value: obj?.id,
    taxApply: obj?.value || 0,
  };
  return result;
};

const addButtonClick = {
  category: 1,
  uom: 2,
  oem: 3,
  gstType: 4,
  status: 5,
};

const validationSchema = Yup.object({
  productName: Yup.string().required("Product name is required."),
  productDescription: Yup.string().required("Product description is required."),
  productCategory: Yup.object().required("Product category is required."),
  productSKU: Yup.string().required("Product SKU is required."),
  acvPrice: Yup.number()
    .typeError("ACV price must be a number.")
    .required("ACV price is required."),
  unitPrice: Yup.number()
    .typeError("Unit price must be a number.")
    .required("Unit price is required."),
  unitOfMeasure: Yup.object().required("Unit of measure is required."),
  oem: Yup.object().required("OEM is required."),
  gstType: Yup.object().required("GST type is required."),
  startDate: Yup.string().required("Start date is required."),
  endDate: Yup.string().required("End date is required."),
  status: Yup.object().required("Status is required."),
});

const AddUpdateProductMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productMasterId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get data by id
  useEffect(() => {
    if (productMasterId) {
      dispatch(getProductMasterById(productMasterId));
    }
  }, [productMasterId]);

  const {
    productMasterCategory,
    productMasterGst,
    productMasterOEM,
    productMasterStatus,
    productMasterUOM,
    productMasterById,
    productMasterByIdLoading,
  } = useSelector((state) => ({
    productMasterCategory: state?.product?.productMasterCategory,
    productMasterGst: state?.product?.productMasterGst,
    productMasterOEM: state?.product?.productMasterOEM,
    productMasterStatus: state?.product?.productMasterStatus,
    productMasterUOM: state?.product?.productMasterUOM,
    productMasterById: state?.product?.productMasterById,
    productMasterByIdLoading: state?.product?.productMasterByIdLoading,
  }));

  const [modal, setModal] = useState({
    isOpen: false,
    clickedAdd: null,
  });

  useEffect(() => {
    dispatch(getProductMasterCategory());
    dispatch(getProductMasterGst());
    dispatch(getProductMasterOEM());
    dispatch(getProductMasterStatus());
    dispatch(getProductMasterUOM());
  }, []);

  const checkModalTitle = useMemo(() => {
    switch (modal?.clickedAdd) {
      case addButtonClick?.category:
        return "Add Product Master category";
      case addButtonClick?.gstType:
        return "Add Product Master GST Type";
      case addButtonClick?.oem:
        return "Add Product Master OEM";
      case addButtonClick?.status:
        return "Add Product Master Status";
      case addButtonClick?.uom:
        return "Add Product Master UOM";
      default:
        return;
    }
  }, [modal]);

  const handleClose = () => {
    setModal({
      isOpen: false,
      clickedAdd: null,
    });
  };

  // Form Handle Logic
  const initialValues = {
    productName: productMasterById?.name ?? "",
    productDescription: productMasterById?.product_description ?? "",
    productCategory: productMasterById?.product_category
      ? findData(productMasterCategory, +productMasterById?.product_category)
      : null,
    productSKU: productMasterById?.product_sku ?? "",
    acvPrice: +productMasterById?.acv_price_decimal || null,
    unitPrice: +productMasterById?.dtp_price_decimal || null,
    unitOfMeasure: productMasterById?.uom
      ? findData(productMasterUOM, +productMasterById?.uom)
      : null,
    oem: productMasterById?.oem
      ? findData(productMasterOEM, +productMasterById?.oem)
      : null,
    gstType: productMasterById?.gst_type
      ? findData(productMasterGst, +productMasterById?.gst_type)
      : null,
    gstAmount: productMasterById?.gst_ammount_decimal ?? null,
    startDate: productMasterById?.startDate ?? "",
    endDate: productMasterById?.endDate ?? "",
    status: productMasterById?.status
      ? findData(productMasterStatus, +productMasterById?.status)
      : null,
  };

  const onSubmit = (values) => {
    setIsSubmitting(true);
    const payload = {
      name: values?.productName?.trim(),
      product_description: values?.productDescription?.trim(),
      product_category: values?.productCategory?.value,
      product_sku: values?.productSKU?.trim(),
      acv_price_decimal: values?.acvPrice,
      dtp_price_decimal: Number(parseFloat(values?.unitPrice).toFixed(2)),
      oem: values?.oem?.value,
      uom: values?.unitOfMeasure?.value,
      gst_type: values?.gstType?.value,
      gst_ammount_decimal: Number(parseFloat(values?.gstAmount).toFixed(2)),
      startDate: values?.startDate,
      endDate: values?.endDate,
      status: values?.status?.value,
    };
    dispatch(addUpdateProductMaster({ payload, productMasterId })).then(
      (res) => {
        if (res?.payload?.status === 201 || res?.payload?.status === 200) {
          navigate(routesConstants?.PRODUCT_MASTER);
          toast.success(
            `Product master${
              productMasterId ? "updated" : "added"
            } successfully.`
          );
        }
        setIsSubmitting(false);
      }
    );
  };

  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <div>
        <h2>Add Product Master</h2>
        <div className="add-account-form">
          <h2 className="title">Add Product Master</h2>
          <form className="">
            <CommonInputTextField
              labelName="Product Name"
              id="productName"
              name="productName"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Product Name"
              required
              value={values?.productName}
              isInvalid={errors?.productName && touched?.productName}
              errorText={errors?.productName}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="Product Description"
              id="productDescription"
              name="productDescription"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Product Description"
              required
              value={values?.productDescription}
              isInvalid={
                errors?.productDescription && touched?.productDescription
              }
              errorText={errors?.productDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <div className="quotation_sales">
              <CustomSelect
                label="Product Category"
                name="productCategory"
                options={productMasterCategory?.map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                placeholder="Select a Product Category"
                value={values?.productCategory}
                required
                onChange={(selected) =>
                  setFieldValue("productCategory", selected)
                }
                error={errors?.productCategory && touched?.productCategory}
                errorText={errors?.productCategory}
                // isDisabled={salesStageLoading}
              />
              <AddIcon
                style={{ marginTop: "1rem", cursor: "pointer" }}
                onClick={() => {
                  setModal({
                    isOpen: true,
                    clickedAdd: addButtonClick?.category,
                  });
                }}
              />
            </div>
            <CommonInputTextField
              labelName="Product SKU"
              id="productSKU"
              name="productSKU"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Product SKU"
              required
              value={values?.productSKU}
              isInvalid={errors?.productSKU && touched?.productSKU}
              errorText={errors?.productSKU}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="ACV Price"
              id="acvPrice"
              name="acvPrice"
              className="input"
              type="number"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter ACV Price"
              required
              value={values?.acvPrice}
              isInvalid={errors?.acvPrice && touched?.acvPrice}
              errorText={errors?.acvPrice}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="Unit Price"
              id="unitPrice"
              name="unitPrice"
              className="input"
              type="number"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Unit Price"
              required
              value={values?.unitPrice}
              isInvalid={errors?.unitPrice && touched?.unitPrice}
              errorText={errors?.unitPrice}
              onChange={(e) => {
                setFieldValue("unitPrice", e?.target?.value);
                if (values?.gstType) {
                  const amount =
                    Number(e?.target?.value) +
                    (e?.target?.value * values?.gstType?.taxApply) / 100;
                  setFieldValue("gstAmount", amount);
                }
              }}
              onBlur={handleBlur}
              requiredText
            />
            <div className="quotation_sales">
              <CustomSelect
                label="Unit of Measure"
                name="unitOfMeasure"
                options={productMasterUOM?.map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                placeholder="Select a Unit of Measure"
                value={values?.unitOfMeasure}
                required
                onChange={(selected) =>
                  setFieldValue("unitOfMeasure", selected)
                }
                error={errors?.unitOfMeasure && touched?.unitOfMeasure}
                errorText={errors?.unitOfMeasure}
                // isDisabled={salesStageLoading}
              />
              <AddIcon
                style={{ marginTop: "1rem", cursor: "pointer" }}
                onClick={() => {
                  setModal({
                    isOpen: true,
                    clickedAdd: addButtonClick?.uom,
                  });
                }}
              />
            </div>
            <div className="quotation_sales">
              <CustomSelect
                label="OEM"
                name="oem"
                options={productMasterOEM?.map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                placeholder="Select a OEM"
                value={values?.oem}
                required
                onChange={(selected) => setFieldValue("oem", selected)}
                error={errors?.oem && touched?.oem}
                errorText={errors?.oem}
                // isDisabled={salesStageLoading}
              />
              <AddIcon
                style={{ marginTop: "1rem", cursor: "pointer" }}
                onClick={() => {
                  setModal({
                    isOpen: true,
                    clickedAdd: addButtonClick?.oem,
                  });
                }}
              />
            </div>
            <div className="quotation_sales">
              <CustomSelect
                label="GST Type"
                name="gstType"
                options={productMasterGst?.map((item) => ({
                  label: item?.name + " " + item?.value,
                  value: item?.id,
                  taxApply: item?.value,
                }))}
                placeholder="Select a GST Type"
                value={values?.gstType}
                required
                onChange={(selected) => {
                  setFieldValue("gstType", selected);
                  if (values?.unitPrice) {
                    const amount =
                      Number(values?.unitPrice) +
                      (values?.unitPrice * selected?.taxApply) / 100;
                    setFieldValue("gstAmount", amount);
                  }
                }}
                error={errors?.gstType && touched?.gstType}
                errorText={errors?.gstType}
                // isDisabled={salesStageLoading}
              />
              <AddIcon
                style={{ marginTop: "1rem", cursor: "pointer" }}
                onClick={() => {
                  setModal({
                    isOpen: true,
                    clickedAdd: addButtonClick?.gstType,
                  });
                }}
              />
            </div>
            <CommonInputTextField
              labelName="GST Amount"
              id="gstAmount"
              name="gstAmount"
              className="input"
              type="number"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter GST Amount"
              value={values?.gstAmount}
              onChange={handleChange}
              isDisabled
              onBlur={handleBlur}
            />
            <CommonDatePicker
              label="Start Date"
              name="startDate"
              required
              value={values?.startDate}
              onChange={(date) => setFieldValue("startDate", date)}
              error={touched?.startDate && !!errors?.startDate}
              errorText={errors?.startDate}
            />
            <CommonDatePicker
              label="End Date"
              name="endDate"
              required
              value={values.endDate}
              onChange={(date) => {
                setFieldValue("endDate", date);
                const today = new Date();
                const selectedDate = new Date(date);
                // Normalize both dates (optional but safer for date-only comparison)
                today.setHours(0, 0, 0, 0);
                selectedDate.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                  setFieldValue("status", {
                    label: "Inactive",
                    value: 2,
                  });
                }
              }}
              error={touched?.endDate && !!errors?.endDate}
              errorText={errors?.endDate}
            />
            <div className="quotation_sales">
              <CustomSelect
                label="Status"
                name="status"
                options={productMasterStatus?.map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                placeholder="Select a Status"
                value={values?.status}
                required
                onChange={(selected) => {
                  setFieldValue("status", selected);
                }}
                error={errors?.status && touched?.status}
                errorText={errors?.status}
                // isDisabled={salesStageLoading}
              />
              <AddIcon
                style={{ marginTop: "1rem", cursor: "pointer" }}
                onClick={() => {
                  setModal({
                    isOpen: true,
                    clickedAdd: addButtonClick?.status,
                  });
                }}
              />
            </div>
            <CommonButton
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="add-account-btn"
              isDisabled={isSubmitting}
            >
              {productMasterById
                ? isSubmitting
                  ? "Updating..."
                  : "Update"
                : isSubmitting
                ? "Submitting..."
                : "Submit"}
            </CommonButton>
          </form>
        </div>
      </div>
      <CommonModal
        title={checkModalTitle}
        isOpen={modal?.isOpen}
        handleClose={handleClose}
        scrollable
      >
        <AddOptions modal={modal} handleClose={handleClose} />
      </CommonModal>
    </>
  );
};

export default AddUpdateProductMaster;
