function PrimaryButton({
  title,
  onClick,
  type = "button",
  disabled = false
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        bg-violet-600
        hover:bg-violet-700
        text-white
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-300
        disabled:bg-gray-400
      "
    >
      {title}
    </button>
  );
}

export default PrimaryButton;