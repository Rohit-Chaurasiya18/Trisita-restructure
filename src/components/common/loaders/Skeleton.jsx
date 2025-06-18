const SkeletonLoader = ({
  isDashboard = true,
  height = "250px",
  width = "100%",
}) => {
  return (
    <>
      {isDashboard ? (
        <div
          className="skeleton-rectangle mt-2 mb-2"
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
