import React from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { getExportExcelFile } from "@/modules/insightMetrics/slice/insightMetricsSlice";

const ExportToExcel = ({
  data,
  columns,
  fileName,
  className,
  moduleName = "",
}) => {
  const dispatch = useDispatch();
  const exportToExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const exportData = data.map((row) => columns.map((col) => row[col.field]));
    const ws = XLSX.utils.aoa_to_sheet([
      columns.map((col) => col.headerName),
      ...exportData,
    ]);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: fileType });
    const fileNameWithExtension = fileName + fileExtension;
    const formData = new FormData();
    formData.append("module_name", moduleName);
    const file = new File([blob], fileNameWithExtension, { type: fileType });
    formData.append("exported_file", file);
    // formData.append("exported_file", blob);
    dispatch(getExportExcelFile(formData)).then((res) => {
      if (res?.payload?.status === 201 || res?.payload?.status === 200) {
        // Download Excel
        saveAs(blob, fileNameWithExtension);
      }
    });
  };

  return (
    <Button
      onClick={exportToExcel}
      style={{ marginLeft: 16 }}
      variant="contained"
      color="primary"
      className={className}
    >
      Export Excel
    </Button>
  );
};

export default ExportToExcel;
