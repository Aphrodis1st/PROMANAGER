const Input = ({ label, error, ...props }) => (
  <div>
    {label && <label className="block mb-1 text-sm">{label}</label>}
    <input
      {...props}
      className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default Input;