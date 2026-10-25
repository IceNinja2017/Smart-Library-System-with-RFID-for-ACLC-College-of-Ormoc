
import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

const inputClass =
  "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15";

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[var(--color-text)]"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          minLength={8}
          required
          className={`${inputClass} pr-16`}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-3 my-auto rounded px-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const email = form.email.trim();

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to create your account.");
      }

      setRegisteredEmail(email);
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] lg:grid-cols-2">
          {/* School branding panel */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-[var(--color-primary)] p-10 text-[var(--color-text-inverse)] lg:flex xl:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/15" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-white/15" />

            <div className="relative">
              <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl">
                <span aria-hidden="true">▤</span>
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
                BookSmart
              </p>

              <h1 className="max-w-sm text-4xl font-bold leading-tight xl:text-5xl">
                Your next chapter starts here.
              </h1>

              <p className="mt-5 max-w-sm leading-7 text-white/80">
                Create your account to get started with ACLC Ormoc's Smart
                library system.
              </p>
            </div>

            <div className="relative border-t border-white/20 pt-5 text-sm text-white/75">
              BookSmart · RFID-enabled library access
            </div>
          </aside>

          {/* Registration form */}
          <div className="p-6 sm:p-10 xl:p-12">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)] text-xl text-white">
                <span aria-hidden="true">▤</span>
              </div>
              <p className="text-sm font-semibold text-[var(--color-primary)]">
                BOOKSMART
              </p>
            </div>

            {registeredEmail ? (
              <div className="flex min-h-[420px] flex-col justify-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10 text-3xl text-[var(--color-success)]">
                  <span aria-hidden="true">✓</span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
                  Check your email
                </h2>

                <p className="mt-3 leading-7 text-[var(--color-text-muted)]">
                  If registration was accepted, Supabase will send a verification
                  link to:
                </p>

                <p className="mt-2 break-all font-semibold text-[var(--color-primary)]">
                  {registeredEmail}
                </p>

                <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
                  Open the email and click its verification link. Once your
                  email is verified, you can sign in to your account.
                </p>

                <Link
                  to="/login"
                  className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                >
                  Go to login
                </Link>

                <button
                  type="button"
                  onClick={() => setRegisteredEmail("")}
                  className="mt-3 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                >
                  Register another account
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="mb-2 text-sm font-semibold text-[var(--color-primary)]">
                    CREATE AN ACCOUNT
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
                    Join BookSmart now!
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    Register with your email and create a secure password.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-[var(--radius-md)] border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 px-4 py-3 text-sm leading-6 text-[var(--color-danger)]"
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-[var(--color-text)]"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength={254}
                      required
                      className={inputClass}
                    />
                  </div>

                  <PasswordField
                    id="password"
                    label="Password"
                    value={form.password}
                    onChange={handleChange}
                    show={showPassword}
                    onToggle={() => setShowPassword((value) => !value)}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                  />

                  <PasswordField
                    id="confirmPassword"
                    label="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    show={showConfirmPassword}
                    onToggle={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                  />

                  <p className="text-xs leading-5 text-[var(--color-text-muted)]">
                    Use at least 8 characters. Your confirmation password must
                    match your password.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && (
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                    )}
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                </form>

                <p className="mt-7 text-center text-sm text-[var(--color-text-muted)]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
