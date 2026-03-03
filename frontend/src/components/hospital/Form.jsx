import React from "react";

export const Form = ({ title, children, onSubmit }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {title}
        </h2>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </div>
  );
};

export const Input = ({ label, error, ...props }) => (
  <div>
    {label && <label className="block mb-1 text-sm">{label}</label>}
    <input
      {...props}
      className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export const Select = ({ label, options = [], ...props }) => (
  <div>
    {label && <label className="block mb-1 text-sm">{label}</label>}
    <select
      {...props}
      className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const TextArea = ({ label, ...props }) => (
  <div>
    {label && <label className="block mb-1 text-sm">{label}</label>}
    <textarea
      {...props}
      className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800"
      rows={4}
    />
  </div>
);

export default Form;