import React from "react";

const PageHeader = ({
  title,
  subtitle,
  action,
  breadcrumbs,
}) => {
  return (
    <div className="mb-6">
      {breadcrumbs && (
        <div className="text-sm text-gray-500 mb-2">
          {breadcrumbs}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export { PageHeader };
export default PageHeader;