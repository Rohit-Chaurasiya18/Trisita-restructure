import React from "react";
import { useSelector } from "react-redux";

const PageLoader = () => {
  const { pageLoader } = useSelector((state) => state.login);
  return (
    <div className={`loader-overlay ${!pageLoader ? "hide-loader" : ""}`}>
      <div className="loader-wrapper">
        <div className="loader-spinner"></div>
      </div>
    </div>
  );
};
export default PageLoader;
