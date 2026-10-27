import AdminLayout from "./AdminLayout";
import PageHeader from "./PageHeader";
import EmptyState from "./EmptyState";

function AdminPlaceholder({ title, description, icon: Icon }) {
  return (
    <AdminLayout>
      <PageHeader eyebrow="Admin" title={title} description={description} />
      <div className="rounded-2xl border border-brand/15 bg-surface p-6">
        <EmptyState
          icon={Icon}
          title={`${title} will appear here`}
          description="This screen is styled for operations. Data stays on the existing APIs — no backend changes in this UI pass."
        />
      </div>
    </AdminLayout>
  );
}

export default AdminPlaceholder;
