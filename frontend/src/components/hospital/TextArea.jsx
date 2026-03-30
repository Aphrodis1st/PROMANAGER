import React from 'react';

const Textarea = ({ value, onChange, rows = 3, className = "", ...props }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

export { Textarea };
export default Textarea;