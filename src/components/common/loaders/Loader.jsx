import React from "react";

const Loader = () => {
  return (
    <div className="suspense-loader-div">
      <div className={`loader-overlay`}>
        <div className="loader-wrapper">
          <div className="loader-spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
