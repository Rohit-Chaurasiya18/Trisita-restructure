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
    saveAs(blob, fileNameWithExtension);
    const formData = new FormData();
    formData.append("module_name", moduleName);
    formData.append("exported_file", blob);
    dispatch(getExportExcelFile(formData)).then((res) => {});
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
