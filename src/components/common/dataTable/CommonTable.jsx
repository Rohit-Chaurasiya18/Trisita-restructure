// src/components/common/dataTable/CommonTable.jsx

import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const CommonTable = ({
  rows,
  columns,
  getRowId,
  loading = false,
  error = null,
  height = "80vh",
  toolbar = false,
  exportFileName = "exported_data",
  additionalToolbar = null,
  checkboxSelection = false,
  disableSelection = false,
  handleRowSelection,
  sx = {},
}) => {
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();
  return (
    <div style={{ height, width: "100%" }} className="data-grid-wrapper">
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            checkboxSelection={checkboxSelection}
            onRowSelectionModelChange={handleRowSelection}
            disableRowSelectionOnClick={disableSelection}
            showToolbar={toolbar}
            slotProps={{
              toolbar: {
                csvOptions: {
                  fileName: `${exportFileName}_${currDate}_${currTime}`,
                  fields: columns.map((col) => col?.field),
                },
              },
            }}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1976d2",
                color: "#fff",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#f2f0f0",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#1976d2",
                color: "#fff",
                borderTop: "none",
              },
              "& .MuiCheckbox-root": {
                color: "#66bb6a !important", // Customize as needed
              },
              "& .MuiTablePagination-toolbar": {
                alignItems: "baseline !important", // Customize as needed
                paddingTop: "10px !important",
              },
              ...sx,
            }}
          />
          {additionalToolbar && (
            <div style={{ marginTop: "10px" }}>{additionalToolbar}</div>
          )}
        </>
      )}
    </div>
  );
};

export default CommonTable;
