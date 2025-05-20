import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountInformation } from "../slice/accountSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Autocomplete, TextField } from "@mui/material";
import { toast } from "react-toastify";

// Reusable Autocomplete Field
const AutocompleteField = ({
  label,
  name,
  options,
  multiple = false,
  getOptionLabel,
  formik,
  width = 300,
}) => (
  <div className="form-group col-10">
    <div className="col-5">
      <label>{label} :</label>
    </div>
    <div className="col-5">
      <Autocomplete
        multiple={multiple}
        options={options || []}
        getOptionLabel={getOptionLabel}
        value={formik.values[name]}
        onChange={(_, value) => formik.setFieldValue(name, value)}
        sx={{ width }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Select ${label}`}
            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
          />
        )}
      />
    </div>
  </div>
);

const AssignUserBranch = ({ id, handleCallback }) => {
  const dispatch = useDispatch();
  const { accountInformation, allUserData, allClientData, branch_list } =
    useSelector((state) => ({
      accountInformation: state?.account?.accountInformation,
      allUserData: state?.account?.allUserData?.User || [],
      allClientData: state?.account?.allUserData?.Client || [],
      branch_list: state?.insightMetrics?.branchList || [],
    }));

  useEffect(() => {
    if (id) {
      dispatch(getAccountInformation({ accountId: id }));
    }
  }, [id, dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bdPerson: accountInformation?.user_assign ?? [],
      branch: accountInformation?.branch?.id
        ? branch_list?.find(
            (item) => item?.value === accountInformation?.branch?.id
          )
        : null,
      renewalPerson: accountInformation?.renewal_person ?? [],
      client: accountInformation?.client ?? [],
    },
    validationSchema: Yup.object({
      bdPerson: Yup.array().min(1, "At least one BD person is required"),
      branch: Yup.object().nullable().required("Branch is required"),
      renewalPerson: Yup.array().min(
        1,
        "At least one renewal person is required"
      ),
      client: Yup.array().min(1, "At least one client is required"),
    }),
    onSubmit: (values) => {
      // Submit your API call here
      const requestBody = {
        user_assign: values?.bdPerson?.map((user) => user?.id),
        branch: values?.branch?.value || null,
        renewal_person: values?.renewalPerson?.map((user) => user?.id),
        client: values?.client?.map((user) => user?.id),
      };
      dispatch(
        getAccountInformation({ accountId: id, isUpdate: true, requestBody })
      ).then((res) => {
        if (res?.payload?.status === 200) {
          toast.success("Account Allocated");
        }
        handleCallback();
      });
    },
  });
  return (
    <form className="allocate-form" onSubmit={formik.handleSubmit}>
      <AutocompleteField
        label="BD Person"
        name="bdPerson"
        options={allUserData}
        multiple
        getOptionLabel={(option) =>
          `${option?.first_name || ""} ${option?.last_name || ""}`
        }
        formik={formik}
      />

      <AutocompleteField
        label="Branch"
        name="branch"
        options={branch_list}
        getOptionLabel={(option) => option?.label || ""}
        formik={formik}
      />

      <AutocompleteField
        label="Renewal Person"
        name="renewalPerson"
        options={allUserData}
        multiple
        getOptionLabel={(option) =>
          `${option?.first_name || ""} ${option?.last_name || ""}`
        }
        formik={formik}
      />

      <AutocompleteField
        label="Client"
        name="client"
        options={allClientData}
        multiple
        getOptionLabel={(option) =>
          `${option?.first_name || ""} ${option?.last_name || ""}`
        }
        formik={formik}
      />

      <div className="form-group col-12 justify-content-center mt-4">
        <button type="submit" className="btn btn-primary">
          ALLOCATE
        </button>
      </div>
    </form>
  );
};

export default AssignUserBranch;
