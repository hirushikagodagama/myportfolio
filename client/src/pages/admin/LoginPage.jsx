import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-white shadow-soft lg:grid-cols-[1fr_0.95fr]">
        <div className="hidden bg-gradient-to-br from-accent via-canvas to-sand p-10 lg:block">
          <div className="max-w-sm space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Admin Panel</p>
            <h1 className="text-5xl font-extrabold tracking-tight text-ink">
              Edit the entire portfolio without touching code.
            </h1>
            <p className="text-lg leading-8 text-muted">
              Update the public website, project cards, profile image, rich text about section, and social links from a single secure dashboard.
            </p>
          </div>
        </div>
        <div className="p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Secure Login</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink">Welcome back</h2>
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-ink">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4">
                <Mail size={18} className="text-muted" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full border-0 bg-transparent px-0 py-4 focus:ring-0"
                />
              </div>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-ink">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4">
                <LockKeyhole size={18} className="text-muted" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full border-0 bg-transparent px-0 py-4 focus:ring-0"
                />
              </div>
            </label>
            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
