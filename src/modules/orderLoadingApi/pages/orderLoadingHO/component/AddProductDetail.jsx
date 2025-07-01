import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { getProductMasterById } from "@/modules/data/product/slice/ProductSlice";
import { getActiveProductMaster } from "@/modules/orderLoadingApi/slice/OrderLoadingApiSlice";
import { useFormik } from "formik";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
const AddProductDetail = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const {
    activeProductMasterLoading,
    activeProductMaster,
    productMasterById,
    productMasterByIdLoading,
    stateCode,
  } = useSelector((state) => ({
    activeProductMasterLoading:
      state?.orderLoadingApi?.activeProductMasterLoading,
    activeProductMaster: state?.orderLoadingApi?.activeProductMaster,
    productMasterById: state?.product?.productMasterById,
    productMasterByIdLoading: state?.product?.productMasterByIdLoading,
    stateCode: state?.orderLoadingApi?.stateCode,
  }));

  useEffect(() => {
    dispatch(getActiveProductMaster());
  }, []);

  const validationSchema = Yup.object().shape({
    productMaster: Yup.object().required("Product Master is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive("Quantity must be a positive number")
      .integer("Quantity must be an integer"),
    sellingAmount: Yup.number()
      .required("Selling Amount is required")
      .positive("Selling Amount must be a positive number"),
    purchaseAmount: Yup.number()
      .required("Purchase Amount is required")
      .positive("Purchase Amount must be a positive number"),
  });

  const onSubmit = (values, { resetForm }) => {
    if (!stateCode) {
      toast.error("Please select branch for the gst process!");
    } else {
      console.log("Form Submitted", values);
      // Perform any action with the form values
    }
  };

  const initialValues = {
    productMaster: null,
    quantity: "",
    sellingAmount: "",
    purchaseAmount: "",
    totalACVAmount: 0,
  };

  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  // Expose submit function to parent using ref
  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(),
  }));

  const { billingGSTNumber } = props;

  const { sgstAmount, cgstAmount, igstAmount } = useMemo(() => {
    const billingStateCode = billingGSTNumber?.substring(0, 2);
    const sellingAmount = parseFloat(values?.sellingAmount) || 0;
    const isSameState = +billingStateCode === +stateCode;

    if (isSameState) {
      const sgst = sellingAmount * 0.09;
      const cgst = sellingAmount * 0.09;
      return { sgstAmount: sgst, cgstAmount: cgst, igstAmount: 0 };
    } else {
      const igst = sellingAmount * 0.18;
      return { sgstAmount: 0, cgstAmount: 0, igstAmount: igst };
    }
  }, [billingGSTNumber, stateCode, values?.sellingAmount]);

  return (
    <>
      <form onSubmit={handleSubmit} className="order-loading-add-product-form">
        <div className="col-sm-12">
          <div className="col-sm-3">Product Master:</div>
          <div className="col-sm-9">
            <CustomSelect
              name="productMaster"
              placeholder="Select a Product Master"
              options={activeProductMaster}
              value={values?.productMaster}
              onChange={(selectedOption) => {
                setFieldValue("productMaster", selectedOption);
                dispatch(getProductMasterById(selectedOption?.value)).then(
                  (res) => {
                    if (res?.payload?.data?.product_master) {
                      setFieldValue(
                        "totalACVAmount",
                        Number(res?.payload?.data?.product_master?.acv_price)
                      );
                    }
                  }
                );
              }}
              error={errors?.productMaster && touched?.productMaster}
              errorText={errors.productMaster}
            />
          </div>
        </div>

        <div className="col-sm-12 mb-3">
          <div className="col-sm-3">Quantity:</div>
          <div className="col-sm-9">
            <CommonInputTextField
              id="quantity"
              name="quantity"
              className="input"
              mainDiv="form-group"
              type="number"
              placeHolder="Enter Quantity"
              value={values?.quantity}
              isInvalid={errors?.quantity && touched?.quantity}
              errorText={errors?.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              min={1}
            />
          </div>
        </div>

        <div className="col-sm-12 mb-3">
          <div className="col-sm-3">Selling Amount:</div>
          <div className="col-sm-9">
            <CommonInputTextField
              id="sellingAmount"
              name="sellingAmount"
              className="input"
              mainDiv="form-group"
              type="number"
              placeHolder="Enter Selling Amount"
              value={values?.sellingAmount}
              isInvalid={errors?.sellingAmount && touched?.sellingAmount}
              errorText={errors?.sellingAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              min={1}
            />
          </div>
        </div>

        <div className="col-sm-12 mb-3">
          <div className="col-sm-3">Purchase Amount:</div>
          <div className="col-sm-9">
            <CommonInputTextField
              id="purchaseAmount"
              name="purchaseAmount"
              className="input"
              mainDiv="form-group"
              type="number"
              placeHolder="Enter Purchase Amount"
              value={values?.purchaseAmount}
              isInvalid={errors?.purchaseAmount && touched?.purchaseAmount}
              errorText={errors?.purchaseAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              min={1}
            />
          </div>
        </div>

        <div className="col-sm-12 mb-3">
          <div className="col-sm-3">Total Selling Amount:</div>
          <div className="col-sm-9">
            {+values?.sellingAmount * +values?.quantity}
          </div>
        </div>

        <div className="col-sm-12 mb-3">
          <div className="col-sm-3">Total Purchase Amount:</div>
          <div className="col-sm-9">
            {+values?.sellingAmount * +values?.purchaseAmount}
          </div>
        </div>
        <div className="col-sm-12 mb-3">
          <div className="col-sm-3">Total ACV Amount:</div>
          <div className="col-sm-9">
            {+values?.totalACVAmount * +values?.sellingAmount}
          </div>
        </div>

        <div className="col-sm-12 mb-3">
          <div className="col-sm-3">SGST Amount (per unit):</div>
          <div className="col-sm-9">{sgstAmount}</div>
        </div>

        <div className="col-sm-12 mb-3">
          <div className="col-sm-3">CGST Amount (per unit):</div>
          <div className="col-sm-9">{cgstAmount}</div>
        </div>

        <div className="col-sm-12 mb-3">
          <div className="col-sm-3">IGST Amount (per unit):</div>
          <div className="col-sm-9">{parseFloat(igstAmount)}</div>
        </div>
      </form>
    </>
  );
});
export default AddProductDetail;
