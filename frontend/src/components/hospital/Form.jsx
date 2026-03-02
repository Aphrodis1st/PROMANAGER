import React from "react";

const Form = ({ title, children, onSubmit }) => {
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

export default Form;