import React, { useState } from "react";

export const Form = ({ title, children, onSubmit, defaultValues = {} }) => {
  const [formData, setFormData] = useState(defaultValues);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formElements = e.target.elements;
    const data = {};
    
    for (let element of formElements) {
      if (element.name) {
        data[element.name] = element.value;
      }
    }
    
    onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {title}
        </h2>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
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

export const Select = ({ label, options = [], placeholder, ...props }) => (
  <div>
    {label && <label className="block mb-1 text-sm">{label}</label>}
    <select
      {...props}
      className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800"
    >
      {placeholder && <option value="">{placeholder}</option>}
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