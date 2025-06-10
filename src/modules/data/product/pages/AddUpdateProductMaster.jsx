import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import AddIcon from "@mui/icons-material/Add";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  getProductMasterCategory,
  getProductMasterGst,
  getProductMasterOEM,
  getProductMasterStatus,
  getProductMasterUOM,
} from "../slice/ProductSlice";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonModal from "@/components/common/modal/CommonModal";

const addButtonClick = {
  category: 1,
  uom: 2,
  oem: 3,
  gstType: 4,
  status: 5,
};

const AddUpdateProductMaster = () => {
  const dispatch = useDispatch();
  const {
    productMasterCategory,
    productMasterGst,
    productMasterOEM,
    productMasterStatus,
    productMasterUOM,
  } = useSelector((state) => ({
    productMasterCategory: state?.product?.productMasterCategory,
    productMasterGst: state?.product?.productMasterGst,
    productMasterOEM: state?.product?.productMasterOEM,
    productMasterStatus: state?.product?.productMasterStatus,
    productMasterUOM: state?.product?.productMasterUOM,
  }));

  const [modal, setModal] = useState({
    isOpen: false,
    clickedAdd: null,
  });

  console.log({
    productMasterCategory,
    productMasterGst,
    productMasterOEM,
    productMasterStatus,
    productMasterUOM,
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
              //   required
              //   value={values?.productName}
              //   isInvalid={errors.productName && touched.productName}
              //   errorText={errors.productName}
              //   onChange={handleChange}
              //   onBlur={handleBlur}
              //   requiredText
            />
            <CommonInputTextField
              labelName="Product Description"
              id="productDescription"
              name="productDescription"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Product Description"
              //   required
              //   value={values?.productDescription}
              //   isInvalid={errors.productDescription && touched.productDescription}
              //   errorText={errors.productDescription}
              //   onChange={handleChange}
              //   onBlur={handleBlur}
              //   requiredText
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
                // value={values.productCategory}
                // required
                // onChange={(selected) => setFieldValue("productCategory", selected)}
                // error={errors.productCategory && touched.productCategory}
                // errorText={errors.productCategory}
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
              //   required
              //   value={values?.productSKU}
              //   isInvalid={errors.productSKU && touched.productSKU}
              //   errorText={errors.productSKU}
              //   onChange={handleChange}
              //   onBlur={handleBlur}
              //   requiredText
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
              //   required
              //   value={values?.acvPrice}
              //   isInvalid={errors.acvPrice && touched.acvPrice}
              //   errorText={errors.acvPrice}
              //   onChange={handleChange}
              //   onBlur={handleBlur}
              //   requiredText
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
              //   required
              //   value={values?.unitPrice}
              //   isInvalid={errors.unitPrice && touched.unitPrice}
              //   errorText={errors.unitPrice}
              //   onChange={handleChange}
              //   onBlur={handleBlur}
              //   requiredText
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
                // value={values.unitOfMeasure}
                // required
                // onChange={(selected) => setFieldValue("unitOfMeasure", selected)}
                // error={errors.unitOfMeasure && touched.unitOfMeasure}
                // errorText={errors.unitOfMeasure}
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
                // value={values.oem}
                // required
                // onChange={(selected) => setFieldValue("oem", selected)}
                // error={errors.oem && touched.oem}
                // errorText={errors.oem}
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
                }))}
                placeholder="Select a GST Type"
                // value={values.gstType}
                // required
                // onChange={(selected) => setFieldValue("gstType", selected)}
                // error={errors.gstType && touched.gstType}
                // errorText={errors.gstType}
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
              //   required
              //   value={values?.gstAmount}
              //   isInvalid={errors.gstAmount && touched.gstAmount}
              //   errorText={errors.gstAmount}
              //   onChange={handleChange}
              //   onBlur={handleBlur}
              //   requiredText
            />
            <CommonDatePicker
              label="Start Date"
              name="startDate"
              //   required
              //   value={values.startDate}
              //   onChange={(date) => setFieldValue("startDate", date)}
              //   error={touched.startDate && !!errors.startDate}
              //   errorText={errors.startDate}
            />
            <CommonDatePicker
              label="End Date"
              name="endDate"
              //   required
              //   value={values.endDate}
              //   onChange={(date) => setFieldValue("endDate", date)}
              //   error={touched.endDate && !!errors.endDate}
              //   errorText={errors.endDate}
            />
            <div className="quotation_sales">
              <CustomSelect
                label="Status"
                name="status"
                options={productMasterStatus?.map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                placeholder="Select a GST Type"
                // value={values.status}
                // required
                // onChange={(selected) => setFieldValue("status", selected)}
                // error={errors.status && touched.status}
                // errorText={errors.status}
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
              //   onClick={handleSubmit}
              type="button"
              className="add-account-btn"
              //   isDisabled={isSubmitting}
            >
              Submit
            </CommonButton>
          </form>
        </div>
      </div>
      <CommonModal
        title={checkModalTitle}
        isOpen={modal?.isOpen}
        handleClose={() => {
          setModal({
            isOpen: false,
            clickedAdd: null,
          });
        }}
        scrollable
        // maxWidth={"450px"}
      ></CommonModal>
    </>
  );
};

export default AddUpdateProductMaster;
