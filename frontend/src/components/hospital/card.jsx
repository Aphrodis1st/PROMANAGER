import React from "react";

const Card = ({
  title,
  subtitle,
  value,
  icon,
  children,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="flex justify-between items-start mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {icon && <div className="text-blue-600">{icon}</div>}
        </div>
      )}

      {value && (
        <div className="text-3xl font-bold text-gray-900 mb-4">
          {value}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;