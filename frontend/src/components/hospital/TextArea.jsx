const TextArea = ({ label, ...props }) => (
  <div>
    {label && <label className="block mb-1 text-sm">{label}</label>}
    <textarea
      {...props}
      className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800"
      rows={4}
    />
  </div>
);

export default TextArea;