const SkeletonLoader = ({ isDashboard = false }) => {
  return (
    <>
      {isDashboard ? (
        <div className="skeleton-rectangle" />
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
