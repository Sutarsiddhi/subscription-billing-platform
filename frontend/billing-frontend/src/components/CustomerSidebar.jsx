import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
  FaCreditCard,
  FaHome,
  FaBoxOpen,
  FaFileInvoice,
  FaUser,
  FaSignOutAlt,
  FaReceipt,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import BrandMark from "./BrandMark";

const items = [
  { to: "/customer/dashboard", label: "Overview", icon: FaHome },
  { to: "/customer/mysubscription", label: "Subscription", icon: FaBoxOpen },
  { to: "/customer/plans", label: "Plans", icon: FaCreditCard },
  { to: "/customer/billing", label: "Billing", icon: FaReceipt },
  { to: "/customer/invoices", label: "Invoices", icon: FaFileInvoice },
  { to: "/customer/profile", label: "Profile", icon: FaUser },
];

function CustomerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-brand/15 bg-void text-ink">
      <div className="px-5 py-6">
        <BrandMark light to="/customer/dashboard" />
        <p className="mt-4 truncate text-xs text-ink-soft">{user?.email || "Customer portal"}</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-gold-dim font-semibold text-brand"
                  : "text-ink-soft hover:bg-gold-dim/60 hover:text-ink"
              }`}
            >
              <Icon className="text-base" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-gold-dim hover:text-ink"
        >
          <FaSignOutAlt />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default CustomerSidebar;
