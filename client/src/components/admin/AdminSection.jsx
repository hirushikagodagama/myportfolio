export default function AdminSection({ title, description, children }) {
  return (
    <section className="rounded-[2rem] border border-line bg-surface p-6 shadow-soft lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
