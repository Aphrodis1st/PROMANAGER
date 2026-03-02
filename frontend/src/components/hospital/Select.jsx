const Select = ({ label, options = [], ...props }) => (
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

export default Select;