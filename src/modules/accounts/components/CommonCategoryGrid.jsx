import { Box, Typography } from "@mui/material";

const CommonCategoryCard = ({ title, active, inactive, total }) => (
  <Box
    sx={{
      backgroundColor: "#e0e0e0",
      borderRight: "2px solid blue",
      borderLeft: "2px solid blue",
      borderRightWidth: 0,
      "&:last-child": { borderRightWidth: "2px" },
      p: 2,
      textAlign: "center",
      flex: 1,
      minWidth: 120,
    }}
  >
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2">{active} active account</Typography>
    <Typography variant="body2">{inactive} inactive account</Typography>
    <Typography variant="body2" color="primary">
      {total} total accounts
    </Typography>
  </Box>
);

const CommonCategoryGrid = ({ data = [] }) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      backgroundColor: "#f0f0f0",
    }}
  >
    {data.map((item, index) => (
      <CommonCategoryCard
        key={index}
        title={item.title}
        active={item.active}
        inactive={item.inactive}
        total={item.total}
      />
    ))}
  </Box>
);

export default CommonCategoryGrid;
