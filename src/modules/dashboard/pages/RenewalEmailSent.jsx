import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetRenewalEmailSentList } from "../slice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonDateRangePicker from "@/components/common/date/CommonDateRangePicker";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";
import { getAllBranch } from "@/modules/insightMetrics/slice/insightMetricsSlice";
import useDebounce from "@/hooks/useDebounce";
import CommonModal from "@/components/common/modal/CommonModal";
import ViewTemplate from "../components/ViewTemplate";

const RenewalEmailSent = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState([null, null]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    branch: null,
  });

  const {
    renewalEmailSentList,
    renewalEmailSentListLoading,
    userDetail,
    branch_list,
    branchListLoading,
    filter,
  } = useSelector((state) => ({
    renewalEmailSentList: state?.dashboard?.renewalEmailSentList,
    renewalEmailSentListLoading: state?.dashboard?.renewalEmailSentListLoading,
    userDetail: state?.login?.userDetail,
    branch_list: state?.insightMetrics?.branchList,
    branchListLoading: state?.insightMetrics?.branchListLoading,
    filter: state?.layout?.filter,
  }));
  const [selectedId, setSelectedId] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    data: null,
  });

  useEffect(() => {
    dispatch(getAllBranch());
  }, []);

  const debounce = useDebounce(filters?.endDate, 500);

  useEffect(() => {
    const { startDate } = filters;

    let payload = {
      id: filter?.csn === "All CSN" ? "" : filter?.csn,
    };
    if (debounce) {
      payload.startDate = startDate;
      payload.endDate = debounce;
    } else {
      payload.startDate = null;
      payload.endDate = null;
    }
    dispatch(GetRenewalEmailSentList(payload));
  }, [debounce, filter?.csn]);

  useEffect(() => {
    setFilteredData(renewalEmailSentList);
  }, [renewalEmailSentList]);

  const getRandomLightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 90%)`; // Light pastel color
  };

  const columns = [
    {
      field: "subscription_ref",
      headerName: "Subscription",
      width: 200,
    },

    { field: "account_name", headerName: "Account Name", width: 250 },
    {
      field: "subscription_endDate",
      headerName: "Subscription End Date",
      width: 200,
    },
    { field: "seats", headerName: "Seats", width: 250 },
    {
      field: "trisita_status",
      headerName: "Trisita Status",
      width: 200,
    },
    {
      field: "bd_person",
      headerName: "BD Person Name",
      width: 200,
      renderCell: (params) => (
        <div>
          {params?.value ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "renewal_person",
      headerName: "Renewal Person Name",
      width: 200,
      renderCell: (params) => (
        <div>
          {params?.value ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    { field: "branch", headerName: "Branch", width: 200 },
    {
      field: "contract_manager_phone",
      headerName: "Contact Mgr. Phone",
      width: 200,
      renderCell: (params) => (
        <div>
          {params?.value ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "contract_manager_email",
      headerName: "Contact Mgr. Email",
      width: 200,
      renderCell: (params) => (
        <div>
          {params?.value ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },

    {
      field: "cc_emails",
      headerName: "CC Emails",
      width: 200,
      renderCell: (params) => (
        <div>
          {params?.value ? (
            params?.value
          ) : (
            <span style={{ color: "red" }}>Undefined</span>
          )}
        </div>
      ),
    },
    {
      field: "trigger_days",
      headerName: "Trigger Name Days",
      width: 200,
      renderCell: (params) => {
        return <>{params?.value}</>;
      },
    },
    {
      field: "sent_at",
      headerName: "Trigger Date Time",
      width: 200,
      renderCell: (params) => {
        let formatted = "-";
        if (params?.value) {
          const inputDate = new Date(params?.value);

          const pad = (n) => n.toString().padStart(2, "0");

          formatted = `${pad(inputDate.getDate())}/${pad(
            inputDate.getMonth() + 1
          )}/${inputDate.getFullYear()} ${pad(inputDate.getHours())}:${pad(
            inputDate.getMinutes()
          )}:${pad(inputDate.getSeconds())}`;
        }
        return <>{formatted}</>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params, index) => (
        <span
          onClick={() => {
            setModal({
              isOpen: true,
              data: params?.row,
            });
          }}
          className="assign-button text-black px-3 py-1 rounded border-0"
        >
          Show Template
        </span>
      ),
    },
  ];

  const handleSelectionChange = (selectedRows) => {
    const idArray = [...selectedRows?.ids];
    if (idArray?.length > 0) {
      setSelectedId(idArray);
    } else {
      setSelectedId([]);
    }
  };

  const exportedData = useMemo(
    () =>
      renewalEmailSentList?.filter((item) =>
        selectedId.includes(item?.index_id)
      ),
    [selectedId]
  );

  const handleDateChange = (newValue) => {
    const [start, end] = newValue;
    setFilters((prev) => ({
      ...prev,
      startDate: start?.format("YYYY-MM-DD") || null,
      endDate: end ? end.format("YYYY-MM-DD") : "",
    }));
    setDateRange(newValue);
  };

  useEffect(() => {
    if (filters?.branch?.label) {
      let filteredList = renewalEmailSentList?.filter(
        (item) => item?.branch === filters?.branch?.label
      );
      setFilteredData(filteredList);
    } else {
      setFilteredData(renewalEmailSentList);
    }
  }, [filters?.branch]);

  return (
    <>
      {renewalEmailSentListLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="renewal-email-sent-header">
            <div>
              <h3 className="mb-0 commom-header-title">Renewal Email Sent</h3>
              <span className="common-breadcrum-msg">
                Welcome to your Renewal Email Sent
              </span>
            </div>
            <div className="subscription-filter">
              <CommonDateRangePicker
                value={dateRange}
                onChange={handleDateChange}
                width="180px"
                placeholderStart="Start date"
                placeholderEnd="End date"
                disabled={renewalEmailSentListLoading}
              />
              <CommonAutocomplete
                onChange={(event, newValue) => {
                  setFilters((prev) => ({
                    ...prev,
                    branch: newValue,
                  }));
                }}
                options={branch_list}
                label="Select a Branch"
                loading={branchListLoading || renewalEmailSentListLoading}
                value={filters?.branch}
              />
            </div>
          </div>
          <div className="renewal-email-sent-table">
            <ExportToExcel
              data={exportedData}
              columns={columns}
              fileName={`renewal_email_sent_${userDetail?.first_name}_${
                userDetail?.last_name
              }_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`}
              className="account-export-btn"
              moduleName="Renewal Email"
            />
            <CommonTable
              rows={filteredData}
              columns={columns}
              getRowId={(row) => row?.index_id}
              checkboxSelection
              handleRowSelection={handleSelectionChange}
              toolbar
              exportFileName={`renewal_email_sent_${userDetail?.first_name}_${userDetail?.last_name}`}
              moduleName="Renewal Email"
            />
          </div>
          <CommonModal
            isOpen={modal?.isOpen}
            handleClose={() => {
              setModal((prev) => ({
                ...prev,
                isOpen: false,
                data: null,
              }));
            }}
            scrollable
            title={"View Template"}
          >
            <ViewTemplate data={modal?.data} />
          </CommonModal>
        </>
      )}
    </>
  );
};
export default RenewalEmailSent;
