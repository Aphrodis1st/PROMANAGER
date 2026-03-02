const DatePicker = ({ label, ...props }) => (
  <div>
    {label && <label className="block mb-1 text-sm">{label}</label>}
    <input
      type="date"
      {...props}
      className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800"
    />
  </div>
);

export default DatePicker;