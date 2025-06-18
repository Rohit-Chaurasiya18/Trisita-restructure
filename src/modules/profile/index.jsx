import CommonButton from "@/components/common/buttons/CommonButton";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import {
  FirstNameRequired,
  LastNameRequired,
  PhoneRegex,
  PhoneRequired,
  PhoneValidation,
} from "@/constants/SchemaValidation";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { getUserProfile, updateUserProfile } from "./slice/profileSlice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { toast } from "react-toastify";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const userData = useSelector((state) => state?.profile?.userDetail);

  const [selectedImage, setSelectedImage] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    first_name: Yup.string().trim().required(FirstNameRequired),
    last_name: Yup.string().trim().required(LastNameRequired),
    phone: Yup.string()
      .matches(PhoneRegex, PhoneValidation)
      .required(PhoneRequired),
  });

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    dispatch(getUserProfile(id)).then((res) => {
      const imageUrl = res?.payload?.data?.profile_image;
      if (imageUrl) setSelectedImage(imageUrl);
      setIsLoading(false);
    });
  }, [id, dispatch]);

  const initialValues = {
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    phone: userData?.phone || "",
    designation: userData?.designation || "",
  };

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("phone", values.phone);

    if (selectedFile instanceof File) {
      formData.append("profile_image", selectedFile);
    }

    const payload = { formData, id: +id };

    setIsSubmitting(true);
    dispatch(updateUserProfile(payload)).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success(
          res?.payload?.data?.message || "Profile updated successfully."
        );
      }
      setIsSubmitting(false);
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const { values, touched, errors, handleSubmit, handleChange, handleBlur } =
    formik;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  return (
    <>
      <h3>Manage Profile</h3>
      <div className="update-profile">
        {isLoading ? (
          <SkeletonLoader isDashboard={false} />
        ) : (
          <>
            <h2 className="title">Update Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group image-upload">
                <div className="image-wrapper">
                  <img
                    src={selectedImage}
                    alt="Profile"
                    className="profile-img"
                  />
                  <div className="edit-icon">
                    <label htmlFor="imageInput" className="icon-btn">
                      ✏️
                    </label>
                    <input
                      type="file"
                      id="imageInput"
                      name="profile_image"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <label htmlFor="profile_image" className="label">
                  Profile Image
                </label>
              </div>
              <CommonInputTextField
                labelName="First Name"
                id="first_name"
                name="first_name"
                className="input"
                required
                mainDiv="form-group"
                labelClass="label"
                value={values.first_name}
                placeHolder="Enter your first name"
                isInvalid={touched.first_name && errors.first_name}
                errorText={errors.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <CommonInputTextField
                labelName="Last Name"
                id="last_name"
                name="last_name"
                className="input"
                required
                mainDiv="form-group"
                labelClass="label"
                value={values.last_name}
                placeHolder="Enter your last name"
                isInvalid={touched.last_name && errors.last_name}
                errorText={errors.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <CommonInputTextField
                labelName="Phone"
                id="phone"
                name="phone"
                className="input"
                required
                mainDiv="form-group"
                labelClass="label"
                value={values.phone}
                placeHolder="Enter your phone number"
                isInvalid={touched.phone && errors.phone}
                errorText={errors.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <CommonInputTextField
                labelName="Designation"
                id="designation"
                name="designation"
                className="input"
                mainDiv="form-group"
                labelClass="label"
                value={values.designation}
                placeHolder="Enter your designation"
                isInvalid={touched.designation && errors.designation}
                errorText={errors.designation}
                isDisabled
              />
              <CommonButton
                className="submit-btn"
                type="submit"
                isDisabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </CommonButton>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
