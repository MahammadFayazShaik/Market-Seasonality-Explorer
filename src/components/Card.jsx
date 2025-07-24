// src/components/dashboard/StatCard.jsx
import React from "react";

const Card = ({ label, value, subValue, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-top">
        {icon && <span className="stat-icon">{icon}</span>}
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      {subValue && <div className="stat-sub">{subValue}</div>}
    </div>
  );
};

export default Card;
