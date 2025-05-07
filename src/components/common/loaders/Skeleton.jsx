const SkeletonLoader = ({
  isDashboard = false,
  height = "250px",
  width = "100%",
}) => {
  return (
    <>
      {isDashboard ? (
        <div
          className="skeleton-rectangle"
          style={{ height: height, width: width }}
        />
      ) : (
        <div className="skeleton-loader">
          <div className="skeleton avatar" />
          <div className="skeleton line" />
          <div className="skeleton line" />
          <div className="skeleton line" />
        </div>
      )}
    </>
  );
};

export default SkeletonLoader;
