function InputField({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon
}) {
  return (
    <div className="relative mb-5">

      {Icon && (
        <Icon
          className="absolute left-4 top-4 text-gray-400"
        />
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border rounded-xl py-3 pl-12 pr-4
        focus:outline-none focus:ring-2
        focus:ring-blue-500"
      />

    </div>
  );
}

export default InputField;