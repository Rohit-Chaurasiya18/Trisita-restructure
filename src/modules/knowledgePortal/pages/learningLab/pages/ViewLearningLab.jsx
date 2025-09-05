import React from "react";
import {
  Container,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";

// MUI Icons
import DesignServicesIcon from "@mui/icons-material/DesignServices"; // AutoCAD
import ArchitectureIcon from "@mui/icons-material/Architecture"; // Revit
import ViewInArIcon from "@mui/icons-material/ViewInAr"; // Navisworks
import TimelineIcon from "@mui/icons-material/Timeline"; // BIM 360
import BuildIcon from "@mui/icons-material/Build"; // Autodesk Build
import DescriptionIcon from "@mui/icons-material/Description"; // Autodesk Docs

const products = [
  {
    name: "AutoCAD",
    desc: "Conceptual & Detailed Engineering",
    icon: <DesignServicesIcon color="primary" />,
  },
  {
    name: "Revit",
    desc: "Building Information Modeling",
    icon: <ArchitectureIcon color="secondary" />,
  },
  {
    name: "Navisworks",
    desc: "3D Coordination & Clash Detection",
    icon: <ViewInArIcon sx={{ color: "#6a1b9a" }} />,
  },
  {
    name: "BIM 360",
    desc: "Planning & Scheduling",
    icon: <TimelineIcon color="success" />,
  },
  {
    name: "Autodesk Build",
    desc: "Site Execution & QA/QC",
    icon: <BuildIcon color="warning" />,
  },
  {
    name: "Autodesk Docs",
    desc: "Handover & Commissioning",
    icon: <DescriptionIcon color="error" />,
  },
];

const ViewLearningLab = () => {
  return (
    <>
      <div className="mb-4">
        <div className="commom-header-title mb-0">View Learning Lab</div>
        <span className="common-breadcrum-msg">View the learning lab</span>
      </div>
      <div>
        {/* Header */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Engineering, Procurement & Construction (EPC)
        </Typography>
        <Typography variant="h6" gutterBottom>
          Key Products:
        </Typography>
        <Box sx={{ mb: 4 }}>
          {products.map((p) => (
            <Chip
              key={p.name}
              label={p.name}
              color="primary"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        {/* Workflow Timeline */}
        <Typography variant="h5" gutterBottom>
          Workflow
        </Typography>
        <Timeline position="alternate">
          {products.map((p, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index < products.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography color="text.secondary">{p.desc}</Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        {/* Product Cards */}
        <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
          Product Details
        </Typography>
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.name}>
              <Card
                sx={{
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {p.name}
                  </Typography>
                  <Typography color="text.secondary">{p.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};

export default ViewLearningLab;
