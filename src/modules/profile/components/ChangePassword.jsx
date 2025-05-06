import CommonButton from "@/components/common/buttons/CommonButton";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { changedPassword } from "../slice/profileSlice";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    old_password: Yup.string().trim().required("Old password is required"),

    new_password: Yup.string()
      .trim()
      .min(6, "New password must be at least 6 characters")
      .required("New password is required"),

    confirmNewPassword: Yup.string()
      .trim()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const onSubmit = (values) => {
    setIsLoading(true);
    dispatch(changedPassword(values)).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success(
          res?.payload?.data?.message || "Password changed successfully"
        );
        resetForm();
      }
      setIsLoading(false);
    });
  };

  const initialValues = {
    old_password: "",
    new_password: "",
    confirmNewPassword: "",
  };

  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  return (
    <>
      <h3>Change Password</h3>
      <div className="update-profile">
        <h2 className="title">Change Password Form</h2>
        <form onSubmit={handleSubmit} className="change-password">
          <CommonInputTextField
            labelName="Old Password"
            id="old_password"
            type="password"
            required
            value={values.old_password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeHolder="Enter old password"
            isInvalid={errors.old_password && touched.old_password}
            errorText={errors.old_password}
            errorClass="Password-error"
          />
          <CommonInputTextField
            labelName="New Password"
            id="new_password"
            type="password"
            required
            value={values.new_password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeHolder="Enter new password"
            isInvalid={errors.new_password && touched.new_password}
            errorText={errors.new_password}
            errorClass="Password-error"
          />
          <CommonInputTextField
            labelName="Confirm Password"
            id="confirmNewPassword"
            type="password"
            required
            value={values.confirmNewPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeHolder="Enter confirm password"
            isInvalid={errors.confirmNewPassword && touched.confirmNewPassword}
            errorText={errors.confirmNewPassword}
            errorClass="Password-error"
          />
          <CommonButton
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            Set Password
          </CommonButton>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
