import { styled } from "@mui/material/styles";
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getExportExcelFile } from "@/modules/insightMetrics/slice/insightMetricsSlice";

const StyledQuickFilter = styled(QuickFilter)({
  display: "grid",
  alignItems: "center",
});

const StyledToolbarButton = styled(ToolbarButton)(({ theme, ownerState }) => ({
  gridArea: "1 / 1",
  width: "min-content",
  height: "min-content",
  zIndex: 1,
  opacity: ownerState.expanded ? 0 : 1,
  pointerEvents: ownerState.expanded ? "none" : "auto",
  transition: theme.transitions.create(["opacity"]),
}));

const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
  gridArea: "1 / 1",
  overflowX: "clip",
  width: ownerState.expanded ? 260 : "var(--trigger-width)",
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(["width", "opacity"]),
}));

const CustomToolbar = ({ rows, columns, moduleName, fileName }) => {
  const dispatch = useDispatch();
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuTriggerRef = useRef(null);

  const handleExportCSV = (rows, columns) => {
    const csvRows = [];

    // Extract header
    const headers = columns.map((col) => col.headerName || col.field);
    csvRows.push(headers.join(","));

    // Extract rows
    rows.forEach((row) => {
      const values = columns.map((col) => {
        const val = row[col.field];
        return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val;
      });
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Send CSV to your API (as a file or raw content)
    const formData = new FormData();
    formData.append("module_name", moduleName);
    const file = new File([blob], fileName, {
      type: "text/csv;charset=utf-8;",
    });
    formData.append("exported_file", file);
    // formData.append("exported_file", blob);
    dispatch(getExportExcelFile(formData)).then((res) => {
      if (res?.payload?.status === 201 || res?.payload?.status === 200) {
        // Download CSV
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  return (
    <Toolbar>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge
                badgeContent={state.filterCount}
                color="primary"
                variant="dot"
              >
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>

      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ mx: 0.5 }}
      />
      <Tooltip title="Export">
        <ToolbarButton
          ref={exportMenuTriggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={exportMenuOpen ? "true" : undefined}
          onClick={() => setExportMenuOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

      <Menu
        id="export-menu"
        anchorEl={exportMenuTriggerRef.current}
        open={exportMenuOpen}
        onClose={() => setExportMenuOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          list: {
            "aria-labelledby": "export-menu-trigger",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleExportCSV(rows, columns);
            setExportMenuOpen(false);
          }}
        >
          Download as CSV
        </MenuItem>
        {/* Available to MUI X Premium users */}
        {/* <ExportExcel render={<MenuItem />}>
           Download as Excel
          </ExportExcel> */}
      </Menu>

      <StyledQuickFilter>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <SearchIcon fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
};
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
  isCustomRowSelection = false,
  handleRowSelection,
  sx = {},
  rowSelectionModel,
  moduleName = "",
}) => {
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();
  const dataGridProps = {
    rows,
    columns,
    getRowId,
    checkboxSelection,
    onRowSelectionModelChange: handleRowSelection,
    disableRowSelectionOnClick: disableSelection,
    slots: {
      toolbar: () => (
        <CustomToolbar
          rows={rows}
          columns={columns}
          moduleName={moduleName}
          fileName={`${exportFileName}_${currDate}_${currTime}`}
        />
      ),
    },
    showToolbar: toolbar,
    sx: {
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
    },
  };

  if (isCustomRowSelection) {
    dataGridProps.rowSelectionModel = rowSelectionModel;
  }

  return (
    <div style={{ height, width: "100%" }} className="data-grid-wrapper">
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <DataGrid {...dataGridProps} />
          {additionalToolbar && (
            <div style={{ marginTop: "10px" }}>{additionalToolbar}</div>
          )}
        </>
      )}
    </div>
  );
};

export default CommonTable;
