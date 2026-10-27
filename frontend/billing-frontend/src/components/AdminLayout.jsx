import { useContext, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { AuthContext } from "../context/AuthContext";

function AdminLayout({ children }) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <div className={`${open ? "block" : "hidden"} lg:block`}>
        <AdminSidebar />
      </div>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-void/70 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}
      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brand/15 bg-void/80 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-brand/25 px-2 py-1 text-sm text-brand lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              Menu
            </button>
            <p className="text-sm text-ink-soft">Admin console</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm font-medium text-ink sm:block">
              {user?.full_name || user?.email || "Admin"}
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-void">
              {(user?.full_name || user?.email || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="px-5 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
