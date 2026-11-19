import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "flex items-center gap-3 rounded-sm border border-white/10 bg-void/60 px-4 transition-colors focus-within:border-ember-400";

  return (
    <div className="fx-shell flex min-h-screen items-center justify-center px-6 py-12">
      <div className="pointer-events-none fixed -left-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-ember/40 blur-[140px]" />

      <div className="fx-panel fx-corners grid w-full max-w-5xl overflow-hidden rounded-sm lg:grid-cols-[1fr_0.95fr]">
        <div className="relative hidden overflow-hidden border-r border-white/5 bg-[radial-gradient(circle_at_20%_10%,rgba(95,46,27,0.7),transparent_60%)] p-10 lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(142,154,152,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(142,154,152,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="relative max-w-sm space-y-6">
            <p className="fx-label">Admin Panel</p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-haze">
              Edit the entire portfolio <span className="fx-gradient-text">without touching code.</span>
            </h1>
            <p className="text-lg leading-8 text-fog">
              Update the public website, project cards, profile image, rich text about section, and social links from a single secure dashboard.
            </p>
          </div>
        </div>
        <div className="p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-fog hover:text-haze">
              <ArrowLeft size={14} /> Back to site
            </Link>
            <div className="space-y-3">
              <p className="fx-label flex items-center gap-2">
                <span className="fx-pulse h-1.5 w-1.5 rounded-full bg-ember-400" /> Secure Login
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-haze">Welcome back</h2>
            </div>
            <label className="block space-y-2">
              <span className="fx-label !text-[0.65rem]">Email</span>
              <div className={fieldClass}>
                <Mail size={17} className="text-fog" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full border-0 bg-transparent px-0 py-4 text-haze placeholder:text-fog/50 focus:ring-0"
                />
              </div>
            </label>
            <label className="block space-y-2">
              <span className="fx-label !text-[0.65rem]">Password</span>
              <div className={fieldClass}>
                <LockKeyhole size={17} className="text-fog" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full border-0 bg-transparent px-0 py-4 text-haze focus:ring-0"
                />
              </div>
            </label>
            {error ? (
              <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
            ) : null}
            <button type="submit" disabled={isSubmitting} className="fx-btn fx-btn-primary w-full disabled:opacity-60">
              {isSubmitting ? "Authenticating..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
