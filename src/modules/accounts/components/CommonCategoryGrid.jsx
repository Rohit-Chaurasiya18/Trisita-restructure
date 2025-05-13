import { Box, Typography } from "@mui/material";

const CommonCategoryCard = ({
  title,
  active,
  inactive,
  total,
  handleClick,
  selectedValue,
}) => {
  return (
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
      <Typography
        variant="body2"
        sx={{
          cursor: "pointer",
          "&:hover": { color: "blue" },
          color: `${
            title === selectedValue?.title && selectedValue?.status === "Active"
              ? "blue"
              : "black"
          }`,
        }}
        onClick={() => handleClick?.(title, "Active")}
      >
        {active} active account
      </Typography>
      <Typography
        variant="body2"
        sx={{
          cursor: "pointer",
          "&:hover": { color: "blue" },
          color: `${
            title === selectedValue?.title &&
            selectedValue?.status === "Expired"
              ? "blue"
              : "black"
          }`,
        }}
        onClick={() => handleClick?.(title, "Expired")}
      >
        {inactive} expired account
      </Typography>
      <Typography
        variant="body2"
        sx={{
          cursor: "pointer",
          "&:hover": { color: "blue" },
          color: `${
            title === selectedValue?.title && selectedValue?.status === "Total"
              ? "blue"
              : "black"
          }`,
        }}
        onClick={() => handleClick?.(title, "Total")}
      >
        {total} total accounts
      </Typography>
    </Box>
  );
};

const CommonCategoryGrid = ({ data = [], handleClick, selectedValue }) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      backgroundColor: "#f0f0f0",
    }}
  >
    {data?.map((item, index) => (
      <CommonCategoryCard
        key={index}
        title={item?.title}
        active={item?.active}
        inactive={item?.expired}
        total={item?.total}
        handleClick={handleClick}
        selectedValue={selectedValue}
      />
    ))}
  </Box>
);

export default CommonCategoryGrid;
