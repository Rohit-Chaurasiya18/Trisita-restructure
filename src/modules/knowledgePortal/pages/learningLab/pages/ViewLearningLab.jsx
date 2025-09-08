import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { viewLearningLab } from "@/modules/knowledgePortal/slice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

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
  const dispatch = useDispatch();
  const { learningLabId } = useParams();
  const { learningLabDetail, learningLabDetailLoading } = useSelector(
    (state) => ({
      learningLabDetail: state?.knowledgePortal?.learningLabDetail,
      learningLabDetailLoading:
        state?.knowledgePortal?.learningLabDetailLoading,
    })
  );
  useEffect(() => {
    dispatch(viewLearningLab(learningLabId));
  }, [learningLabId]);
  return (
    <>
      {learningLabDetailLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="mb-4">
            <div className="commom-header-title mb-0">View Learning Lab</div>
            <span className="common-breadcrum-msg">View the learning lab</span>
          </div>
          <div>
            {/* Header */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {learningLabDetail?.product || "N/A"}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Key Products:
            </Typography>
            <Box sx={{ mb: 4 }}>
              {learningLabDetail?.subcategories?.map((p) => (
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
              {learningLabDetail?.subcategories?.map((p, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    {index < learningLabDetail?.subcategories?.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">{p.name}</Typography>
                    <Typography color="text.secondary">{p.description}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>

            {/* Product Cards */}
            <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
              Product Details
            </Typography>
            <Grid container spacing={3}>
              {learningLabDetail?.subcategories?.map((p) => (
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
                      <Typography color="text.secondary">{p.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </>
      )}
    </>
  );
};

export default ViewLearningLab;
