import React from "react";

const StatCard = ({
  icon: Icon,
  value,
  title,
  percentage,
  progressColor = "green",
  isLink = false,
}) => {
  return (
    <div className={`stat-card ${isLink && "cursor-pointer"}`}>
      <div className="stat-card-left">
        <div className="stat-text">
          <div className="icon-wrapper">
            <Icon className="stat-icon" />
          </div>
          <div className="stat-value">{value}</div>
          <div className="stat-title">{title}</div>
        </div>
      </div>
      <div className="stat-progress">
        <div className="progress-circle">
          <svg viewBox="0 0 36 36" className="progress-ring">
            <path
              className="progress-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`progress-bar ${progressColor}`}
              strokeDasharray={`${percentage}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
        <span className="progress-text">{percentage}%</span>
      </div>
    </div>
  );
};

export default StatCard;
