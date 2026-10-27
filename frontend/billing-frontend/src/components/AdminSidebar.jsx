import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
  FaHome,
  FaUsers,
  FaLayerGroup,
  FaFileInvoice,
  FaCreditCard,
  FaRedo,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import BrandMark from "./BrandMark";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaHome },
  { to: "/admin/customers", label: "Customers", icon: FaUsers },
  { to: "/admin/plans", label: "Plans", icon: FaLayerGroup },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: FaRedo },
  { to: "/admin/invoices", label: "Invoices", icon: FaFileInvoice },
  { to: "/admin/payments", label: "Payments", icon: FaCreditCard },
];

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-brand/15 bg-void text-ink">
      <div className="px-5 py-6">
        <BrandMark light to="/admin/dashboard" />
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-ink-soft">Operations</p>
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
              <Icon />
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
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-gold-dim"
        >
          <FaSignOutAlt /> Sign out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
