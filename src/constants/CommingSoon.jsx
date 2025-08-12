import React from "react";

const ComingSoon = ({
  title = "Coming Soon",
  message = "We're working hard to bring this feature to you!",
}) => {
  return (
    <div className="text-center p-4">
      <h1 className="display-4 fw-bold mb-3">{title}</h1>
      <p className="lead mb-4">{message}</p>

      <p className="text-muted">Stay tuned for updates</p>
    </div>
  );
};

export default ComingSoon;
