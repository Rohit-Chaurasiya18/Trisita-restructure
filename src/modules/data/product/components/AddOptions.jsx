import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useState } from "react";
import {
  addProductMasterCategory,
  addProductMasterGst,
  addProductMasterOEM,
  addProductMasterStatus,
  addProductMasterUOM,
  getProductMasterCategory,
  getProductMasterGst,
  getProductMasterOEM,
  getProductMasterStatus,
  getProductMasterUOM,
} from "../slice/ProductSlice";

const addButtonClick = {
  category: 1,
  uom: 2,
  oem: 3,
  gstType: 4,
  status: 5,
};

const AddOptions = ({ modal, handleClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const selectedType = modal?.clickedAdd;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productCategory: "",
      uom: "",
      oem: "",
      status: "",
      gstTypeName: "",
      gstTypeValue: null,
    },
    validationSchema: Yup.object({
      productCategory: Yup.string()
        .trim()
        .when([], {
          is: () => selectedType === addButtonClick.category,
          then: (schema) => schema.required("Product category is required."),
          otherwise: (schema) => schema.notRequired(),
        }),
      uom: Yup.string()
        .trim()
        .when([], {
          is: () => selectedType === addButtonClick.uom,
          then: (schema) =>
            schema.required("Unit of measure name is required."),
          otherwise: (schema) => schema.notRequired(),
        }),
      oem: Yup.string()
        .trim()
        .when([], {
          is: () => selectedType === addButtonClick.oem,
          then: (schema) => schema.required("OEM name is required."),
          otherwise: (schema) => schema.notRequired(),
        }),
      status: Yup.string()
        .trim()
        .when([], {
          is: () => selectedType === addButtonClick.status,
          then: (schema) => schema.required("Status name is required."),
          otherwise: (schema) => schema.notRequired(),
        }),
      gstTypeName: Yup.string()
        .trim()
        .when([], {
          is: () => selectedType === addButtonClick.gstType,
          then: (schema) => schema.required("GST name is required."),
          otherwise: (schema) => schema.notRequired(),
        }),
      gstTypeValue: Yup.number().when([], {
        is: () => selectedType === addButtonClick.gstType,
        then: (schema) => schema.required("GST value is required."),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const apiMap = {
        [addButtonClick.category]: {
          action: addProductMasterCategory,
          payload: { name: values.productCategory.trim() },
          fetch: getProductMasterCategory,
        },
        [addButtonClick.uom]: {
          action: addProductMasterUOM,
          payload: { name: values.uom.trim() },
          fetch: getProductMasterUOM,
        },
        [addButtonClick.oem]: {
          action: addProductMasterOEM,
          payload: { name: values.oem.trim() },
          fetch: getProductMasterOEM,
        },
        [addButtonClick.status]: {
          action: addProductMasterStatus,
          payload: { name: values.status.trim() },
          fetch: getProductMasterStatus,
        },
        [addButtonClick.gstType]: {
          action: addProductMasterGst,
          payload: {
            name: values.gstTypeName.trim(),
            value: values.gstTypeValue,
          },
          fetch: getProductMasterGst,
        },
      };

      const current = apiMap[selectedType];

      if (current) {
        const res = await dispatch(current.action(current.payload));
        if (res?.payload?.status === 201 || res?.payload?.status === 200) {
          handleClose();
          dispatch(current.fetch());
        }
      }

      setLoading(false);
    },
  });

  const renderField = (label, name, type = "text", placeholder) => (
    <div className="d-flex col-10 mb-4">
      <div className="col-5">
        <label>{label}</label>
      </div>
      <div className="col-5">
        <CommonInputTextField
          id={name}
          name={name}
          className="input"
          mainDiv="form-group"
          type={type}
          placeHolder={placeholder}
          required
          value={formik.values?.[name]}
          isInvalid={formik.errors?.[name] && formik.touched?.[name]}
          errorText={formik.errors?.[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          requiredText
        />
      </div>
    </div>
  );

  const fieldsConfig = {
    [addButtonClick.category]: () =>
      renderField(
        "Category Name",
        "productCategory",
        "text",
        "Enter Category Name"
      ),
    [addButtonClick.uom]: () =>
      renderField("Unit of Measure Name", "uom", "text", "Enter UOM Name"),
    [addButtonClick.oem]: () =>
      renderField("OEM Name", "oem", "text", "Enter OEM Name"),
    [addButtonClick.status]: () =>
      renderField("Status Name", "status", "text", "Enter Status Name"),
    [addButtonClick.gstType]: () => (
      <>
        {renderField("GST Name", "gstTypeName", "text", "Enter GST Name")}
        {renderField("GST Value", "gstTypeValue", "number", "Enter GST Value")}
      </>
    ),
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {fieldsConfig[selectedType]?.()}
      <div className="form-group col-12 justify-content-center mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding" : "ADD"}
        </button>
      </div>
    </form>
  );
};

export default AddOptions;
