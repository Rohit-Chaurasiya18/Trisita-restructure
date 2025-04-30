import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddAccount = () => {
  const validationSchema = Yup.object({
    partnerCSN: Yup.string().required("Partner CSN is required."),
    csn: Yup.string().required("CSN is required."),
    accountName: Yup.string().required("Account name is required."),
  });
  const onSubmit = (values) => {
    console.log("Submit", values);
  };
  const initialValues = {
    partnerCSN: "",
    csn: "",
    accountName: "",
  };
  const { values, touched, errors, handleSubmit, handleChange, handleBlur } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });
  return (
    <div>
      <h2>Add Account</h2>
      <div className="add-account-form">
        <h2 className="title">Add Account</h2>
        <form className="">
          <CustomSelect
            label="Partner CSN"
            required
            name="partnerCSN"
            value={null}
            // onChange={setPartner}
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Partner CSN"
            // error="yes"
          />
          <CommonInputTextField
            labelName="CSN"
            id="csn"
            name="csn"
            className="input"
            required
            mainDiv="form-group"
            labelClass="label"
            value={values?.csn}
            placeHolder="Enter CSN"
            isInvalid={errors.csn && touched.csn}
            errorText={errors.csn}
            onChange={handleChange}
            onBlur={handleBlur}
            requiredText
          />
          <CommonInputTextField
            labelName="Account Name"
            id="accountName"
            name="accountName"
            className="input"
            required
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
            requiredText
          />
          <CustomSelect
            label="Branch"
            required
            name="partnerCSN"
            value={null}
            // onChange={setPartner}
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Branch"
            // error="yes"
          />
          <CustomSelect
            label="BD Person"
            required
            name="partnerCSN"
            value={null}
            // onChange={setPartner}
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a BD Person"
            // error="yes"
          />
          <CustomSelect
            label="Renewal Person"
            required
            name="partnerCSN"
            value={null}
            // onChange={setPartner}
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Renewal Person"
            // error="yes"
          />
          <CommonInputTextField
            labelName="Buying Readiness Score"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CustomSelect
            label="Segment"
            required
            name="partnerCSN"
            value={null}
            // onChange={setPartner}
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Segment"
            // error="yes"
          />
          <CustomSelect
            label="Account Type"
            required
            name="partnerCSN"
            value={null}
            // onChange={setPartner}
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Account Type"
            // error="yes"
          />
          <CommonInputTextField
            labelName="Address Line 1"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Address Line 2"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Address Line 3"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="City"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Country"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Country Code"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="County"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CustomSelect
            label="Geo"
            required
            name="partnerCSN"
            value={null}
            // onChange={setPartner}
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Geo"
            // error="yes"
          />
          <CommonInputTextField
            labelName="Industry"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Phone Number"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="State/Province"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Postal Code"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Parent Account CSN"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            requiredText
          />
          <CommonInputTextField
            labelName="Autodesk Main Contact"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Autodesk Main Contact Email"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Sales Region"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CustomSelect
            label="Status"
            required
            name="partnerCSN"
            value={null}
            // onChange={setPartner}
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Status"
            // error="yes"
          />
          <CommonInputTextField
            labelName="Language"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Website"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CustomSelect
            label="Industry Group"
            name="partnerCSN"
            value={null}
            // onChange={setPartner}
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Status"
            // error="yes"
          />
          <CommonInputTextField
            labelName="Industry Segment"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Industry Sub-Segment"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Local Name"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Victim CSNs"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Latitude"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Longitude"
            id="accountName"
            name="accountName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.accountName}
            placeHolder="Enter account name"
            isInvalid={errors.accountName && touched.accountName}
            errorText={errors.accountName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </form>
      </div>
    </div>
  );
};
export default AddAccount;
