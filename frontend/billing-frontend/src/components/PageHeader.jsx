function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-ink-soft">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export default PageHeader;
