import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CommonAccordion = ({ title, content, mainDiv }) => {
  const isArray = Array.isArray(content);
  const isObject = typeof content === "object" && content !== null && !isArray;

  const renderTable = (data) => {
    const headers = Object.keys(data[0] || {});
    return (
      <TableContainer component={Paper} className={mainDiv}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map((key) => (
                <TableCell key={key} sx={{ fontWeight: "bold" }}>
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((key) => (
                  <TableCell key={key}>{row[key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isArray ? (
          renderTable(content)
        ) : isObject ? (
          renderTable([content])
        ) : (
          <Typography variant="body2">{content}</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default CommonAccordion;
