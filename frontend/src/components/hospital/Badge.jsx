import React from "react";

const colors = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  secondary: "bg-gray-100 text-gray-700",
  primary: "bg-blue-100 text-blue-700",
};

const Badge = ({ children, variant = "info" }) => {
  return (
    <span className={`px-3 py-1 text-xs rounded-full font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;