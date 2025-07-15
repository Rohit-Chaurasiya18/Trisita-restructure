import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { getProductMasterById } from "@/modules/data/product/slice/ProductSlice";
import { getActiveProductMaster } from "@/modules/orderLoadingApi/slice/OrderLoadingApiSlice";
import { useFormik } from "formik";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import routesConstants from "@/routes/routesConstants";

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
    stateCode: props?.stateCode || state?.orderLoadingApi?.stateCode,
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

  const initialValues = {
    productMaster: null,
    quantity: "",
    sellingAmount: "",
    purchaseAmount: "",
    remarks: "",
    totalACVAmount: 0,
  };
  const onSubmit = (values, { resetForm }) => {
    if (!stateCode) {
      toast.error("Please select branch for the gst process!");
      return;
    } else {
      let formattedData = {
        product_master: values?.productMaster?.value,
        product_master_label: values?.productMaster?.label,
        quantity: values?.quantity,
        selling_amount: values?.sellingAmount,
        purchase_amount: values?.purchaseAmount,
        total_selling_amount_exc_gst:
          +values?.sellingAmount * +values?.quantity,
        total_purchase_amount_exc_gst:
          +values?.purchaseAmount * +values?.quantity,
        total_acv_amount_exc_gst:
          +values?.totalACVAmount * +values?.sellingAmount,
        sgst_amount: sgstAmount,
        cgst_amount: cgstAmount,
        igst_amount: igstAmount,
        remarks: values?.remarks,
        id: data?.selectedProduct?.id,
      };
      props?.handleAddProductDetail(formattedData);
    }
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

  const { data } = props;
  const { sgstAmount, cgstAmount, igstAmount } = useMemo(() => {
    const billingStateCode = data?.billingGSTNumber?.substring(0, 2);
    const sellingAmount = parseFloat(values?.sellingAmount) || 0;
    const isSameState = +billingStateCode === +stateCode;
    if (isSameState) {
      const sgst = sellingAmount * 0.09;
      const cgst = sellingAmount * 0.09;
      return {
        sgstAmount: parseFloat(sgst)?.toFixed(2),
        cgstAmount: parseFloat(cgst)?.toFixed(2),
        igstAmount: 0,
      };
    } else {
      const igst = sellingAmount * 0.18;
      return {
        sgstAmount: 0,
        cgstAmount: 0,
        igstAmount: parseFloat(igst)?.toFixed(2),
      };
    }
  }, [data, stateCode, values?.sellingAmount]);

  useEffect(() => {
    if (data?.selectedProduct) {
      let productDetails = data?.selectedProduct;
      setFieldValue("productMaster", {
        value: productDetails?.product_master,
        label: productDetails?.product_master_label,
      });
      setFieldValue("quantity", productDetails?.quantity);
      setFieldValue("sellingAmount", productDetails?.selling_amount);
      setFieldValue("purchaseAmount", productDetails?.purchase_amount);
      setFieldValue("remarks", productDetails?.remarks);
      setFieldValue("totalACVAmount", productDetails?.total_acv_amount_exc_gst);
    }
  }, [data?.selectedProduct]);

  // Expose submit function to parent using ref
  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(),
  }));

  return (
    <>
      <form onSubmit={handleSubmit} className="order-loading-add-product-form">
        <div className="col-sm-12">
          <div className="col-sm-3">Product Master:</div>
          <div className="col-sm-9 product-master-field">
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
            <AddIcon
              onClick={() => {
                const newPath =
                  routesConstants?.PRODUCT_MASTER +
                  routesConstants?.ADD_PRODUCT_MASTER;
                window.open(newPath, "_blank");
              }}
            />
            <RefreshIcon
              onClick={() => {
                dispatch(getActiveProductMaster());
              }}
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
            {+values?.quantity * +values?.purchaseAmount}
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
          <div className="col-sm-9">{parseFloat(igstAmount)?.toFixed(2)}</div>
        </div>
        {props?.isRemark && (
          <div className="col-sm-12 mb-3">
            <div className="col-sm-3">Remarks:</div>
            <div className="col-sm-9">
              <CommonInputTextField
                id="remarks"
                name="remarks"
                className="input"
                mainDiv="form-group"
                placeHolder="Enter Remarks"
                value={values?.remarks}
                isInvalid={errors?.remarks && touched?.remarks}
                errorText={errors?.remarks}
                onChange={handleChange}
                onBlur={handleBlur}
                min={1}
              />
            </div>
          </div>
        )}
      </form>
    </>
  );
});
export default AddProductDetail;
