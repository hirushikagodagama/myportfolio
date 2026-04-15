export default function StatCard({ label, value, tone = "bg-accent/35" }) {
  return (
    <div className={`rounded-[1.75rem] ${tone} p-5`}>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-extrabold text-ink">{value}</p>
    </div>
  );
}
