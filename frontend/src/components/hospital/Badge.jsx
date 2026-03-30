import React from "react";

const colors = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  secondary: "bg-gray-100 text-gray-700",
  primary: "bg-blue-100 text-blue-700",
  default: "bg-blue-600 text-white",
  outline: "border border-gray-300 bg-white text-gray-700",
};

const Badge = ({ children, variant = "info", className = "" }) => {
  return (
    <span className={`px-3 py-1 text-xs rounded-full font-medium ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
};

export { Badge };
export default Badge;