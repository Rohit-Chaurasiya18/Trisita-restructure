import CommonButton from "@/components/common/buttons/CommonButton";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import { useFormik } from "formik";
import * as Yup from "yup";
const CheckboxWithLabel = ({ label, name, checked, onChange }) => {
  return (
    <div
      style={{
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "baseline",
        gap: "0.5rem",
      }}
    >
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        style={{ width: "16px", height: "16px" }}
      />
      <label
        htmlFor={name}
        style={{
          display: "block",
          fontWeight: "600",
          marginBottom: "0.25rem",
          color: "#2c2c2c",
        }}
      >
        {label}
      </label>
    </div>
  );
};

const AddAccount = () => {
  const validationSchema = Yup.object({
    partnerCSN: Yup.object().required("Partner CSN is required."),
    parentAccountCSN: Yup.string().required("Parent Account CSN is required."),
    csn: Yup.string().required("CSN is required."),
    accountName: Yup.string().required("Account name is required."),
    branch: Yup.object().required("Branch is required."),
    bdPerson: Yup.object().required("BD Person is required."),
    renewalPerson: Yup.object().required("Renewal Person is required."),
    segment: Yup.object().required("Segment is required."),
    accountType: Yup.object().required("Account Type is required."),
    geo: Yup.object().required("Geo is required."),
    status: Yup.object().required("Status is required."),
  });

  const onSubmit = (values) => {
    console.log("Submit", values);
  };

  const initialValues = {
    partnerCSN: "",
    csn: "",
    accountName: "",
    branch: "",
    bdPerson: "",
    renewalPerson: "",
    readinessScore: "",
    segment: "",
    accountType: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    country: "",
    countryCode: "",
    county: "",
    geo: "",
    industry: "",
    phoneNumber: "",
    stateProvince: "",
    postalCode: "",
    parentAccountCSN: "",
    autodeskMainContact: "",
    autodeskMainContactEmail: "",
    salesRegion: "",
    status: "",
    language: "",
    website: "",
    industryGroup: "",
    industrySegment: "",
    industrySubSegment: "",
    localName: "",
    victimCSNs: "",
    latitude: "",
    longitude: "",
    flexCustomerFlag: false,
    isNamedAccount: false,
    individualFlag: false,
    parentIsNamedAccount: false,
    thirdParty: false,
  };

  const { values, touched, errors, handleSubmit, handleChange, handleBlur } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });
  const handleCheckboxChange = (name, event) => {
    const { checked } = event.target;
    handleChange({
      target: {
        name,
        value: checked,
      },
    });
  };
  const handleSelectChange = (name, selectedOption) => {
    handleChange({
      target: {
        name,
        value: selectedOption,
      },
    });
  };

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
            value={values?.partnerCSN}
            onChange={(selectedOption) =>
              handleSelectChange("partnerCSN", selectedOption)
            }
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Partner CSN"
            error={errors?.partnerCSN && touched?.partnerCSN}
            errorText={errors.partnerCSN}
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
            name="branch"
            value={values?.branch}
            onChange={(selectedOption) =>
              handleSelectChange("branch", selectedOption)
            }
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Branch"
            error={errors?.branch && touched?.branch}
            errorText={errors?.branch}
          />
          <CustomSelect
            label="BD Person"
            required
            name="bdPerson"
            value={values?.bdPerson}
            onChange={(selectedOption) =>
              handleSelectChange("bdPerson", selectedOption)
            }
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a BD Person"
            error={errors?.bdPerson && touched?.bdPerson}
            errorText={errors?.bdPerson}
          />
          <CustomSelect
            label="Renewal Person"
            required
            name="renewalPerson"
            value={values?.renewalPerson}
            onChange={(selectedOption) =>
              handleSelectChange("renewalPerson", selectedOption)
            }
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Renewal Person"
            error={errors?.renewalPerson && touched?.renewalPerson}
            errorText={errors?.renewalPerson}
          />
          <CommonInputTextField
            labelName="Buying Readiness Score"
            id="readinessScore"
            name="readinessScore"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.readinessScore}
            placeHolder="Enter buying readiness score"
            isInvalid={errors.readinessScore && touched.readinessScore}
            errorText={errors.readinessScore}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CustomSelect
            label="Segment"
            required
            name="segment"
            value={values?.segment}
            onChange={(selectedOption) =>
              handleSelectChange("segment", selectedOption)
            }
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Segment"
            error={errors?.segment && touched?.segment}
            errorText={errors?.segment}
          />
          <CustomSelect
            label="Account Type"
            required
            name="accountType"
            value={values?.accountType}
            onChange={(selectedOption) =>
              handleSelectChange("accountType", selectedOption)
            }
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Account Type"
            error={errors?.accountType && touched?.accountType}
            errorText={errors?.accountType}
          />
          <CommonInputTextField
            labelName="Address Line 1"
            id="addressLine1"
            name="addressLine1"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.addressLine1}
            placeHolder="Enter address line 1"
            isInvalid={errors.addressLine1 && touched.addressLine1}
            errorText={errors.addressLine1}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Address Line 2"
            id="addressLine2"
            name="addressLine2"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.addressLine2}
            placeHolder="Enter account line 2"
            isInvalid={errors.addressLine2 && touched.addressLine2}
            errorText={errors.addressLine2}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Address Line 3"
            id="addressLine3"
            name="addressLine3"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.addressLine3}
            placeHolder="Enter account line 3"
            isInvalid={errors.addressLine3 && touched.addressLine3}
            errorText={errors.addressLine3}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="City"
            id="city"
            name="city"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.city}
            placeHolder="Enter city"
            isInvalid={errors.city && touched.city}
            errorText={errors.city}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Country"
            id="country"
            name="country"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.country}
            placeHolder="Enter country"
            isInvalid={errors.country && touched.country}
            errorText={errors.country}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Country Code"
            id="countryCode"
            name="countryCode"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.countryCode}
            placeHolder="Enter country code"
            isInvalid={errors.countryCode && touched.countryCode}
            errorText={errors.countryCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="County"
            id="county"
            name="county"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.county}
            placeHolder="Enter county"
            isInvalid={errors.county && touched.county}
            errorText={errors.county}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CustomSelect
            label="Geo"
            required
            name="geo"
            value={values?.geo}
            onChange={(selectedOption) =>
              handleSelectChange("geo", selectedOption)
            }
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Geo"
            error={errors?.geo && touched?.geo}
            errorText={errors?.geo}
          />
          <CommonInputTextField
            labelName="Industry"
            id="industry"
            name="industry"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.industry}
            placeHolder="Enter industry"
            isInvalid={errors.industry && touched.industry}
            errorText={errors.industry}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Phone Number"
            id="phoneNumber"
            name="phoneNumber"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.phoneNumber}
            placeHolder="Enter phone number"
            isInvalid={errors.phoneNumber && touched.phoneNumber}
            errorText={errors.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="State/Province"
            id="stateProvince"
            name="stateProvince"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.stateProvince}
            placeHolder="Enter state / province"
            isInvalid={errors.stateProvince && touched.stateProvince}
            errorText={errors.stateProvince}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Postal Code"
            id="postalCode"
            name="postalCode"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.postalCode}
            placeHolder="Enter postal Code"
            isInvalid={errors.postalCode && touched.postalCode}
            errorText={errors.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Parent Account CSN"
            id="parentAccountCSN"
            name="parentAccountCSN"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.parentAccountCSN}
            placeHolder="Enter parent account csn"
            isInvalid={errors.parentAccountCSN && touched.parentAccountCSN}
            errorText={errors.parentAccountCSN}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            requiredText
          />
          <CommonInputTextField
            labelName="Autodesk Main Contact"
            id="autodeskMainContact"
            name="autodeskMainContact"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.autodeskMainContact}
            placeHolder="Enter autodesk main contact"
            isInvalid={
              errors.autodeskMainContact && touched.autodeskMainContact
            }
            errorText={errors.autodeskMainContact}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Autodesk Main Contact Email"
            id="autodeskMainContactEmail"
            name="autodeskMainContactEmail"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.autodeskMainContactEmail}
            placeHolder="Enter autodesk main contact email"
            isInvalid={
              errors.autodeskMainContactEmail &&
              touched.autodeskMainContactEmail
            }
            errorText={errors.autodeskMainContactEmail}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Sales Region"
            id="salesRegion"
            name="salesRegion"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.salesRegion}
            placeHolder="Enter sales region"
            isInvalid={errors.salesRegion && touched.salesRegion}
            errorText={errors.salesRegion}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CustomSelect
            label="Status"
            required
            name="status"
            value={values?.status}
            onChange={(selectedOption) =>
              handleSelectChange("status", selectedOption)
            }
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Status"
            error={errors?.status && touched?.status}
            errorText={errors?.status}
          />
          <CommonInputTextField
            labelName="Language"
            id="language"
            name="language"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.language}
            placeHolder="Enter language"
            isInvalid={errors.language && touched.language}
            errorText={errors.language}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Website"
            id="website"
            name="website"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.website}
            placeHolder="Enter website"
            isInvalid={errors.website && touched.website}
            errorText={errors.website}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CustomSelect
            label="Industry Group"
            name="industryGroup"
            value={values?.industryGroup}
            onChange={(selectedOption) =>
              handleSelectChange("industryGroup", selectedOption)
            }
            options={[
              { value: 1, label: "Partner 1" },
              { value: 2, label: "Partner 2" },
            ]}
            placeholder="Select a Status"
            // error="yes"
          />
          <CommonInputTextField
            labelName="Industry Segment"
            id="industrySegment"
            name="industrySegment"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.industrySegment}
            placeHolder="Enter industry segment"
            isInvalid={errors.industrySegment && touched.industrySegment}
            errorText={errors.industrySegment}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Industry Sub-Segment"
            id="industrySubSegment"
            name="industrySubSegment"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.industrySubSegment}
            placeHolder="Enter industry sub-segment"
            isInvalid={errors.industrySubSegment && touched.industrySubSegment}
            errorText={errors.industrySubSegment}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Local Name"
            id="localName"
            name="localName"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.localName}
            placeHolder="Enter local name"
            isInvalid={errors.localName && touched.localName}
            errorText={errors.localName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Victim CSNs"
            id="victimCSNs"
            name="victimCSNs"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.victimCSNs}
            placeHolder="Enter victim CSNs"
            isInvalid={errors.victimCSNs && touched.victimCSNs}
            errorText={errors.victimCSNs}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Latitude"
            id="latitude"
            name="latitude"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.latitude}
            placeHolder="Enter latitude"
            isInvalid={errors.latitude && touched.latitude}
            errorText={errors.latitude}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <CommonInputTextField
            labelName="Longitude"
            id="longitude"
            name="longitude"
            className="input"
            mainDiv="form-group"
            labelClass="label"
            value={values?.longitude}
            placeHolder="Enter longitude"
            isInvalid={errors.longitude && touched.longitude}
            errorText={errors.longitude}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            <CheckboxWithLabel
              label="Flex Customer Flag"
              name="flexCustomerFlag"
              checked={values?.flexCustomerFlag}
              onChange={(e) => handleCheckboxChange("flexCustomerFlag", e)}
            />
            <CheckboxWithLabel
              label="Is Named Account"
              name="isNamedAccount"
              checked={values?.isNamedAccount}
              onChange={(e) => handleCheckboxChange("isNamedAccount", e)}
            />
            <CheckboxWithLabel
              label="Individual Flag"
              name="individualFlag"
              checked={values?.individualFlag}
              onChange={(e) => handleCheckboxChange("individualFlag", e)}
            />
            <CheckboxWithLabel
              label="Parent Is Named Account"
              name="parentIsNamedAccount"
              checked={values?.parentIsNamedAccount}
              onChange={(e) => handleCheckboxChange("parentIsNamedAccount", e)}
            />
            <CheckboxWithLabel
              label="Third Party"
              name="thirdParty"
              checked={values?.thirdParty}
              onChange={(e) => handleCheckboxChange("thirdParty", e)}
            />
          </div>
          <CommonButton
            onClick={() => handleSubmit()}
            type="button"
            className="add-account-btn"
          >
            Submit
          </CommonButton>
        </form>
      </div>
    </div>
  );
};
export default AddAccount;
