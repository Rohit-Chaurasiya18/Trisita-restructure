import ExportToExcel from "@/components/common/buttons/ExportToExcel";
import CommonTable from "@/components/common/dataTable/CommonTable";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import CommonSelect from "@/components/common/dropdown/CommonSelect";
import { columns, processedData } from "../constants";

const AlertSubscription = () => {
  const handleStatusChange = () => {
    console.log("CLiked");
  };
  const getRowId = (row) => row.id;

  return (
    <>
      <div className="alert-subscription">
        <div className="commom-header-title">
          ROR Change Alert / Lost to Competition
        </div>
        <div className="filter">
          <CommonDatePicker
            label="Start Date"
            onChange={(value) => console.log(value)}
          />
          <CommonDatePicker
            label="End Date"
            onChange={(value) => console.log(value)}
          />
          <CommonSelect
            onChange={handleStatusChange}
            value={"All"}
            options={[
              { value: "All", label: "All" },
              { value: "ROR", label: "ROR Change Alert" },
              { value: "LTC", label: "LTC (Lost to Competition)" },
            ]}
            sx={{
              width: "100px",
            }}
          />
          <CommonSelect
            onChange={handleStatusChange}
            value={"All Status"}
            options={[
              { value: "All Status", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Expired", label: "Expired" },
            ]}
          />
        </div>
      </div>
      <div className="alert-subscription-table">
        <ExportToExcel
          data={processedData}
          columns={columns}
          fileName={`subs_trisita`}
          className="insight-export-btn"
        />
        <h3 className="common-insight-title">Deleted Data</h3>
        <CommonTable
          rows={processedData}
          columns={columns}
          getRowId={getRowId}
          checkboxSelection
          toolbar
          exportFileName={`subs_trisita`}
        />
      </div>
    </>
  );
};

export default AlertSubscription;
