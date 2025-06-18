import CommonButton from "@/components/common/buttons/CommonButton";
import CustomSelect from "@/components/common/dropdown/CustomSelect";
import CommonInputTextField from "@/components/common/inputTextField/CommonInputTextField";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import {
  addEditAccount,
  getBdRenewalPerson,
  getExportedAccount,
} from "@/modules/accounts/slice/accountSlice";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import routesConstants from "@/routes/routesConstants";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
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

const validationSchema = Yup.object({
  partnerCSN: Yup.object().required("Partner CSN is required."),

  parentAccountCSN: Yup.number()
    .typeError("Parent Account CSN must be a number.")
    .required("Parent Account CSN is required."),

  csn: Yup.number()
    .typeError("CSN must be a number.")
    .required("CSN is required."),

  accountName: Yup.string().required("Account name is required."),

  branch: Yup.object().required("Branch is required."),

  bdPerson: Yup.array()
    .of(Yup.object().required("BD Person object is required."))
    .min(1, "At least one BD Person is required.")
    .required("BD Person is required."),

  renewalPerson: Yup.array()
    .of(Yup.object().required("Renewal Person object is required."))
    .min(1, "At least one Renewal Person is required.")
    .required("Renewal Person is required."),

  segment: Yup.object().required("Segment is required."),

  accountType: Yup.object().required("Account Type is required."),

  geo: Yup.object().required("Geo is required."),

  status: Yup.object().required("Status is required."),

  readinessScore: Yup.number()
    .typeError("Buying Readiness Score must be a number.")
    .nullable(true),

  website: Yup.string()
    .matches(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      "Enter a valid website URL."
    )
    .nullable(true),

  account_associated_with: Yup.array()
    .nullable()
    .test({
      name: "accountAssociatedWith",
      test: function (value, context) {
        const isThirdParty = context?.from?.[0]?.value?.thirdParty;

        if (isThirdParty) {
          if (Array.isArray(value) && value.length > 0) {
            return true;
          } else {
            return this.createError({
              message: "At least one associated account is required.",
            });
          }
        }

        // If thirdParty is false, no validation error
        return true;
      },
    }),
});
const allPartnerCsn = [
  { value: 5102086717, label: "5102086717" },
  { value: 5117963549, label: "5117963549" },
];
const allSegmentList = [
  { value: "Emerging", label: "Emerging" },
  { value: "Strategic Account", label: "Strategic Account" },
  { value: "Mature", label: "Mature" },
  { value: "Named Account", label: "Named Account" },
  { value: "Territory New", label: "Territory New" },
  { value: "Midmarket Federal", label: "Midmarket Federal" },
  { value: "Territory", label: "Territory" },
  { value: "Midmarket", label: "Midmarket" },
];

const allAccountList = [
  { value: "End Customer", label: "End Customer" },
  { value: "Government", label: "Government" },
  { value: "Strategic Account", label: "Strategic Account" },
  { value: "Reseller", label: "Reseller" },
  { value: "Distributor", label: "Distributor" },
];

const allGeoList = [
  { value: "Americas", label: "Americas" },
  { value: "APAC", label: "APAC" },
  { value: "EMEA", label: "EMEA" },
];

const allStatusList = [
  { value: "Active", label: "Active" },
  { value: "Contract Pending", label: "Contract Pending" },
  { value: "Inactive", label: "Inactive" },
  { value: "Marked for Deletion", label: "Marked for Deletion" },
  { value: "Out of Business", label: "Out of Business" },
];

const allIndustryGroup = [
  { value: "EDU", label: "EDU" },
  { value: "MFG", label: "MFG" },
  { value: "OTH", label: "OTH" },
  { value: "AEC", label: "AEC" },
  { value: "M&E", label: "M&E" },
];

const AddAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [bdPersonList, setBdPersonList] = useState([]);
  const [renewalPersonList, setRenewalPersonList] = useState([]);
  const [accountDetail, setAccountDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { allBranch, filter, exportedAccountData } = useSelector((state) => ({
    allBranch: state?.insightMetrics?.branchList,
    filter: state?.layout?.filter,
    exportedAccountData: state?.account?.exportedAccountData,
  }));

  const accountOptions = useMemo(
    () =>
      exportedAccountData?.map((account) => ({
        value: account?.id,
        label: `${account?.name} (${account?.csn})`,
      })) || [],
    [exportedAccountData]
  );

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  useEffect(() => {
    dispatch(
      getExportedAccount({ id: filter?.csn === "All CSN" ? "" : filter?.csn })
    );
  }, [filter?.csn]);

  const onSubmit = (values) => {
    const requestData = {
      partner_csn: values?.partnerCSN?.value,
      csn: +values?.csn,
      name: values?.accountName,
      flexCustomerFlag: values?.flexCustomerFlag,
      buyingReadinessScore: values?.readinessScore,
      isNamedAccount: values?.isNamedAccount,
      segment: values?.segment?.value,
      individualFlag: values?.individualFlag,
      address1: values?.addressLine1,
      address2: values?.addressLine2,
      address3: values?.addressLine3,
      city: values?.city,
      country: values?.country,
      countryCode: values?.countryCode,
      county: values?.county,
      geo: values?.geo?.value,
      industry: values?.industry,
      phoneNumber: values?.phoneNumber,
      stateProvince: values?.stateProvince,
      postal: values?.postalCode,
      parentAccountCsn: values?.parentAccountCSN,
      autodeskMainContact: values?.autodeskMainContact,
      autodeskMainContactEmail: values?.autodeskMainContactEmail,
      salesRegion: values?.salesRegion,
      language: values?.language,
      website: values?.website,
      third_party: values?.thirdParty,
      status: values?.status?.value,
      latitude: values?.latitude,
      longitude: values?.longitude,
      parentIsNamedAccount: values?.parentIsNamedAccount,
      localName: values?.localName,
      branch: values?.branch?.value,
      renewal_person: values?.renewalPerson?.map((item) => item?.value),
      industryGroup: values?.industryGroup?.value,
      industrySegment: values?.industrySegment,
      industrySubSegment: values?.industrySubSegment,
      victimCsns: values?.victimCSNs,
      type: values?.accountType?.value,
      user_assign: values?.bdPerson?.map((item) => item?.value),
      account_associated_with: values?.thirdParty
        ? values?.account_associated_with?.map((item) => item?.value)
        : [],
    };
    setIsSubmitting(true);
    if (id) {
      dispatch(
        addEditAccount({ updatedAccountId: id, updatedPayload: requestData })
      ).then((res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          toast.success("Third Party Account updated Successfully");
          navigate(routesConstants?.ACCOUNT);
          resetForm();
        }
        setIsSubmitting(false);
      });
    } else {
      dispatch(addEditAccount(requestData)).then((res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          toast.success("Third Party Account created Successfully");
          navigate(routesConstants?.ACCOUNT);
          resetForm();
        }
        setIsSubmitting(false);
      });
    }
  };

  const initialValues = {
    partnerCSN:
      allPartnerCsn?.find(
        (item) => item?.value === accountDetail?.partner_csn
      ) || "",
    csn: accountDetail?.csn || "",
    accountName: accountDetail?.name || "",
    branch:
      allBranch?.find((item) => item?.value == accountDetail?.branch) || "",
    bdPerson:
      bdPersonList.filter((option) =>
        accountDetail?.user_assign.includes(option?.value)
      ) || "",
    renewalPerson:
      renewalPersonList.filter((option) =>
        accountDetail?.renewal_person.includes(option?.value)
      ) || "",
    readinessScore: accountDetail?.buyingReadinessScore || "",
    segment:
      allSegmentList?.find((item) => item?.value === accountDetail?.segment) ||
      "",
    accountType:
      allAccountList?.find((item) => item?.value === accountDetail?.type) || "",
    addressLine1: accountDetail?.address1 || "",
    addressLine2: accountDetail?.address2 || "",
    addressLine3: accountDetail?.address3 || "",
    city: accountDetail?.city || "",
    country: accountDetail?.country || "",
    countryCode: accountDetail?.countryCode || "",
    county: accountDetail?.county || "",
    geo: allGeoList?.find((item) => item?.value === accountDetail?.geo) || "",
    industry: accountDetail?.industry || "",
    phoneNumber: accountDetail?.phoneNumber || "",
    stateProvince: accountDetail?.stateProvince || "",
    postalCode: accountDetail?.postal || "",
    parentAccountCSN: accountDetail?.parentAccountCsn || "",
    autodeskMainContact: accountDetail?.autodeskMainContact || "",
    autodeskMainContactEmail: accountDetail?.autodeskMainContactEmail || "",
    salesRegion: accountDetail?.salesRegion || "",
    status:
      allStatusList?.find((item) => item?.value === accountDetail?.status) ||
      "",
    language: accountDetail?.language || "",
    website: accountDetail?.website || "",
    industryGroup:
      allIndustryGroup?.find(
        (item) => item?.value === accountDetail?.industryGroup
      ) || "",
    industrySegment: accountDetail?.industrySegment || "",
    industrySubSegment: accountDetail?.industrySubSegment || "",
    localName: accountDetail?.localName || "",
    victimCSNs: accountDetail?.victimCsns || "",
    latitude: accountDetail?.latitude || "",
    longitude: accountDetail?.longitude || "",
    flexCustomerFlag: accountDetail?.flexCustomerFlag || false,
    isNamedAccount: accountDetail?.isNamedAccount || false,
    individualFlag: accountDetail?.individualFlag || false,
    parentIsNamedAccount: accountDetail?.parentIsNamedAccount || false,
    thirdParty: accountDetail?.third_party || false,
    account_associated_with:
      accountOptions.filter((option) =>
        accountDetail?.account_associated_with.includes(option?.value)
      ) || "",
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
  const handleBdRenewalPerson = (selectedOption) => {
    dispatch(getBdRenewalPerson(selectedOption)).then((res) => {
      if (res?.payload?.data?.bd_person) {
        const bdPersonOptions =
          res?.payload?.data?.bd_person?.map((user) => ({
            value: user?.id,
            label: `${user?.first_name} ${user?.last_name}`,
          })) || [];
        setBdPersonList(bdPersonOptions);
      }
      if (res?.payload?.data?.renewal_person) {
        const renewalOptions =
          res?.payload?.data?.renewal_person?.map((user) => ({
            value: user?.id,
            label: `${user?.first_name} ${user?.last_name}`,
          })) || [];
        setRenewalPersonList(renewalOptions);
      }
      setFieldValue("bdPerson", "");
      setFieldValue("renewalPerson", "");
    });
  };
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch(addEditAccount({ accountId: id })).then((res) => {
        if (res?.payload?.data?.account) {
          setAccountDetail(res?.payload?.data?.account);
          if (res?.payload?.data?.account?.branch) {
            handleBdRenewalPerson(res?.payload?.data?.account?.branch);
          }
        }
        setIsLoading(false);
      });
    } else {
      setAccountDetail(null);
    }
  }, [id]);

  return (
    <>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div>
          <h2>{id ? "Update" : "Add"} Account</h2>
          <div className="add-account-form">
            <h2 className="title">{id ? "Update" : "Add"} Account</h2>
            <form className="">
              <CustomSelect
                label="Partner CSN"
                required
                name="partnerCSN"
                value={values?.partnerCSN}
                onChange={(selectedOption) =>
                  handleSelectChange("partnerCSN", selectedOption)
                }
                options={allPartnerCsn}
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
                onChange={(selectedOption) => {
                  handleSelectChange("branch", selectedOption);
                  if (selectedOption?.value) {
                    handleBdRenewalPerson(selectedOption?.value);
                  }
                }}
                options={allBranch}
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
                isMulti
                options={bdPersonList}
                placeholder="Select a BD Person"
                error={errors?.bdPerson && touched?.bdPerson}
                errorText={errors?.bdPerson}
              />
              <CustomSelect
                label="Renewal Person"
                required
                name="renewalPerson"
                isMulti
                value={values?.renewalPerson}
                onChange={(selectedOption) =>
                  handleSelectChange("renewalPerson", selectedOption)
                }
                options={renewalPersonList}
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
                options={allSegmentList}
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
                options={allAccountList}
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
                options={allGeoList}
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
                options={allStatusList}
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
                options={allIndustryGroup}
                placeholder="Select a Status"
                isClearable
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
                isInvalid={
                  errors.industrySubSegment && touched.industrySubSegment
                }
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
                  onChange={(e) =>
                    handleCheckboxChange("parentIsNamedAccount", e)
                  }
                />
                <CheckboxWithLabel
                  label="Third Party"
                  name="thirdParty"
                  checked={values?.thirdParty}
                  onChange={(e) => handleCheckboxChange("thirdParty", e)}
                />
              </div>
              {values?.thirdParty && (
                <CustomSelect
                  label="Account Associated With"
                  name="account_associated_with"
                  value={values?.account_associated_with}
                  onChange={(selectedOption) =>
                    handleSelectChange(
                      "account_associated_with",
                      selectedOption
                    )
                  }
                  options={accountOptions}
                  placeholder="Select a account associated with"
                  required
                  isMulti
                  error={
                    errors?.account_associated_with &&
                    touched?.account_associated_with
                  }
                  errorText={errors?.account_associated_with}
                />
              )}
              <CommonButton
                onClick={() => {
                  handleSubmit();
                }}
                type="button"
                className="add-account-btn"
                isDisabled={isSubmitting}
              >
                {id
                  ? isSubmitting
                    ? "Updating..."
                    : "Update"
                  : isSubmitting
                  ? "Submiting..."
                  : "Submit"}
              </CommonButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default AddAccount;
