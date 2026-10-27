import { useContext } from "react";
import { FaEnvelope, FaUser, FaIdBadge } from "react-icons/fa";
import CustomerLayout from "../../components/CustomerLayout";
import PageHeader from "../../components/PageHeader";
import { AuthContext } from "../../context/AuthContext";
import { useCurrentSubscription } from "../../hooks/useCurrentSubscription";

function Profile() {
  const { user } = useContext(AuthContext);
  const { plan } = useCurrentSubscription();

  return (
    <CustomerLayout>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Details stored on this session. Password changes are not available from this screen."
      />
      <div className="max-w-xl rounded-2xl border border-brand/15 bg-surface p-6">
        <div className="flex items-center gap-4 border-b border-brand/15 pb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-xl font-semibold text-void">
            {(user?.full_name || user?.email || "C").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.full_name || "Customer"}</p>
            <p className="text-sm capitalize text-ink-soft">{user?.role || "customer"}</p>
          </div>
        </div>
        <dl className="mt-5 space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <FaUser className="text-brand" />
            <div>
              <dt className="text-ink-soft">Name</dt>
              <dd className="font-medium">{user?.full_name || "—"}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaIdBadge className="text-brand" />
            <div>
              <dt className="text-ink-soft">Current plan</dt>
              <dd className="font-medium">{plan?.name || "No plan selected"}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-brand" />
            <div>
              <dt className="text-ink-soft">Email</dt>
              <dd className="font-medium">{user?.email || "—"}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaIdBadge className="text-brand" />
            <div>
              <dt className="text-ink-soft">Role</dt>
              <dd className="font-medium capitalize">{user?.role || "—"}</dd>
            </div>
          </div>
        </dl>
      </div>
    </CustomerLayout>
  );
}

export default Profile;
