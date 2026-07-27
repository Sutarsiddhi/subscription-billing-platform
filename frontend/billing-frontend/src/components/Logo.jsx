import { FaCreditCard } from "react-icons/fa";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white text-blue-700 p-3 rounded-xl shadow-md">
        <FaCreditCard size={28} />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">
          Billing Platform
        </h1>

        <p className="text-blue-100 text-sm">
          Subscription & Billing Automation
        </p>
      </div>
    </div>
  );
}

export default Logo;