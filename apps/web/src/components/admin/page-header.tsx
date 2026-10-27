export function AdminPageHeader({
  label,
  title,
  description,
  action,
}: {
  label: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="admin-page-head">
      <div>
        <p className="admin-page-head__label">{label}</p>
        <h1 className="admin-page-head__title">{title}</h1>
        {description && (
          <p className="admin-page-head__description">{description}</p>
        )}
      </div>
      {action && <div className="admin-page-head__action">{action}</div>}
    </header>
  );
}

export function AdminNotice({
  type = "info",
  children,
}: {
  type?: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  if (!children) {
    return null;
  }

  return (
    <p className={`admin-notice admin-notice--${type}`} role="status">
      {children}
    </p>
  );
}

export function AdminLoading({ label = "Chargement…" }: { label?: string }) {
  return <p className="admin-loading">{label}</p>;
}
