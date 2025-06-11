import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addUpdateProduct } from "../slice/ProductSlice";
import routesConstants from "@/routes/routesConstants";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const manufacturerOptions = [
  { value: "Microsoft", label: "Microsoft" },
  { value: "Google", label: "Google" },
  { value: "Enjay", label: "Enjay" },
];

const productTypeOptions = [
  { value: "Hardware", label: "Hardware" },
  { value: "Software", label: "Software" },
  { value: "Service", label: "Service" },
];
const productCategoryOptions = [
  { value: "CRM", label: "CRM" },
  { value: "Tally_cloud", label: "Tally_cloud" },
  { value: "Mobile_app", label: "Mobile_app" },
  { value: "Synapse", label: "Synapse" },
  { value: "Thin_client", label: "Thin_client" },
  { value: "Tiguin", label: "Tiguin" },
];
const productStatusOptions = [
  { value: "Sold", label: "Sold" },
  { value: "AMC", label: "AMC" },
  { value: "Discontinue", label: "Discontinue" },
];
const warrantyPeriodOptions = [
  { value: "6 Months", label: "6 Months" },
  { value: "1 Year", label: "1 Year" },
  { value: "2 Years", label: "2 Years" },
  { value: "3 Years", label: "3 Years" },
  { value: "Custom", label: "Custom" },
];

const validationSchema = Yup.object({
  productName: Yup.string().required("Product name is required."),
  serialNumber: Yup.number()
    .typeError("Serial number must be a number.")
    .required("Serial number is required."),
  accountName: Yup.string().required("Account name is required."),
  manufacturer: Yup.object().required("Manufacturer is required."),
  productType: Yup.object().required("Product type is required."),
  productCategory: Yup.object().required("Partner category is required."),
  price: Yup.number()
    .typeError("Price must be a number.")
    .required("Price is required."),
  productStatus: Yup.object().required("Product status is required."),
  warrantyStartDate: Yup.string().required("Warranty start date is required."),
  warrantyEndDate: Yup.string().required("Warranty end date is required."),
  warrantyPeriod: Yup.object().required("Warranty period is required."),

  assignedTo: Yup.string().required("Assigned to is required."),
});

const AddUpdateProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form Handle Logic
  const initialValues = {
    productName: "",
    serialNumber: null,
    accountName: "",
    manufacturer: null,
    productType: null,
    productCategory: null,
    price: null,
    productStatus: null,
    warrantyStartDate: "",
    warrantyEndDate: "",
    warrantyPeriod: null,
    assignedTo: "",
  };

  const onSubmit = (values) => {
    // debugger;
    setIsSubmitting(true);
    const requestData = {
      name: values?.productName?.trim(),
      serial_number: values?.serialNumber,
      account_name: values?.accountName?.trim(),
      manufacturer: values?.manufacturer?.value,
      product_type: values?.productType?.value,
      product_category: values?.productCategory?.value,
      price: values?.price,
      product_status: values?.productStatus?.value,
      warrenty_startDate: values?.warrantyStartDate,
      warrenty_endDate: values?.warrantyEndDate,
      warrenty_period: values?.warrantyPeriod?.value,
      assigned_to: values?.assignedTo?.trim(),
    };
    dispatch(addUpdateProduct(requestData)).then((res) => {
      if (res?.payload?.status === 201 || res?.payload?.status === 200) {
        navigate(routesConstants?.PRODUCT);
        toast.success(`Product added successfully.`);
      }
      setIsSubmitting(false);
    });
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
        <h2>Add Product</h2>
        <div className="add-account-form">
          <h2 className="title">Add Product</h2>
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
              labelName="Serial Number"
              id="serialNumber"
              name="serialNumber"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              type="number"
              placeHolder="Enter Serial Number"
              required
              value={values?.serialNumber}
              isInvalid={errors?.serialNumber && touched?.serialNumber}
              errorText={errors?.serialNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CommonInputTextField
              labelName="Account Name"
              id="accountName"
              name="accountName"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Account Name"
              required
              value={values?.accountName}
              isInvalid={errors?.accountName && touched?.accountName}
              errorText={errors?.accountName}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CustomSelect
              label="Manufacturer"
              name="manufacturer"
              placeholder="Select a Manufacturer"
              options={manufacturerOptions}
              value={values?.manufacturer}
              required
              onChange={(selectedOption) =>
                setFieldValue("manufacturer", selectedOption)
              }
              error={errors?.manufacturer && touched?.manufacturer}
              errorText={errors.manufacturer}
            />
            <CustomSelect
              label="Product Type"
              name="productType"
              placeholder="Select a Product Type"
              options={productTypeOptions}
              value={values?.productType}
              required
              onChange={(selectedOption) =>
                setFieldValue("productType", selectedOption)
              }
              error={errors?.productType && touched?.productType}
              errorText={errors.productType}
            />
            <CustomSelect
              label="Product Category"
              name="productCategory"
              placeholder="Select a Product Category"
              options={productCategoryOptions}
              value={values?.productCategory}
              required
              onChange={(selectedOption) =>
                setFieldValue("productCategory", selectedOption)
              }
              error={errors?.productCategory && touched?.productCategory}
              errorText={errors.productCategory}
            />
            <CommonInputTextField
              labelName="Price"
              id="price"
              name="price"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              type="number"
              placeHolder="Enter Price"
              required
              value={values?.price}
              isInvalid={errors?.price && touched?.price}
              errorText={errors?.price}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CustomSelect
              label="Product Status"
              name="productStatus"
              placeholder="Select a Product Status"
              options={productStatusOptions}
              value={values?.productStatus}
              required
              onChange={(selectedOption) =>
                setFieldValue("productStatus", selectedOption)
              }
              error={errors?.productStatus && touched?.productStatus}
              errorText={errors.productStatus}
            />
            <CommonDatePicker
              label="Warranty Start Date"
              name="warrantyStartDate"
              required
              value={values?.warrantyStartDate}
              onChange={(date) => setFieldValue("warrantyStartDate", date)}
              error={touched?.warrantyStartDate && !!errors?.warrantyStartDate}
              errorText={errors?.warrantyStartDate}
            />
            <CommonDatePicker
              label="Warranty End Date"
              name="warrantyEndDate"
              required
              value={values?.warrantyEndDate}
              onChange={(date) => setFieldValue("warrantyEndDate", date)}
              error={touched?.warrantyEndDate && !!errors?.warrantyEndDate}
              errorText={errors?.warrantyEndDate}
            />
            <CustomSelect
              label="Warranty Period"
              name="warrantyPeriod"
              placeholder="Select a Warranty Period"
              options={warrantyPeriodOptions}
              value={values?.warrantyPeriod}
              required
              onChange={(selectedOption) =>
                setFieldValue("warrantyPeriod", selectedOption)
              }
              error={errors?.warrantyPeriod && touched?.warrantyPeriod}
              errorText={errors.warrantyPeriod}
            />
            <CommonInputTextField
              labelName="Assigned To"
              id="assignedTo"
              name="assignedTo"
              className="input"
              mainDiv="form-group"
              labelClass="label"
              placeHolder="Enter Account Name"
              required
              value={values?.assignedTo}
              isInvalid={errors?.assignedTo && touched?.assignedTo}
              errorText={errors?.assignedTo}
              onChange={handleChange}
              onBlur={handleBlur}
              requiredText
            />
            <CommonButton
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="add-account-btn"
              // isDisabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </CommonButton>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUpdateProduct;
