
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "Please wait while we confirm your email address."
  );

  useEffect(() => {
    let cancelled = false;

    const verifyEmail = async () => {
      try {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        const code = params.get("code");
        const tokenHash = params.get("token_hash");
        const type = params.get("type");

        const authError =
          params.get("error_description") || params.get("error");

        if (authError) {
          throw new Error(authError.replace(/\+/g, " "));
        }

        // PKCE links require the verifier created by the client
        // that initiated the signup.
        if (code) {
          const { error } =
            await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;
        } else if (
          tokenHash &&
          (type === "signup" || type === "email")
        ) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });

          if (error) throw error;
        }

        // Supabase JS also handles supported auth tokens in the URL
        // fragment when detectSessionInUrl is enabled.
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const user = data.session?.user;

        if (!user) {
          throw new Error(
            "We could not confirm your email. Please open the original verification link again."
          );
        }

        if (!user.email_confirmed_at) {
          throw new Error(
            "Your email has not been verified yet. Please use the confirmation link sent by Supabase."
          );
        }

        if (cancelled) return;

        // Remove confirmation parameters and tokens from the address bar.
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        setStatus("success");
        setMessage(
          "Your email has been verified. You can now sign in to Smart Library."
        );

        // Keep this app's flow explicit: verification, then login.
        // Sign out the session established by the confirmation link.
        const { error: signOutError } =
          await supabase.auth.signOut();

        if (signOutError) throw signOutError;

        if (cancelled) return;

        navigate("/login?verified=true", { replace: true });
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setMessage(
          error.message ||
            "Verification failed. The link may have expired or already been used."
        );
      }
    };

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-10">
      <section className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center shadow-[var(--shadow-card)] sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
          {isLoading && (
            <span
              aria-label="Verifying"
              className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)]"
            />
          )}

          {isSuccess && (
            <span className="text-3xl font-bold text-[var(--color-success)]">
              ✓
            </span>
          )}

          {isError && (
            <span className="text-3xl font-bold text-[var(--color-danger)]">
              !
            </span>
          )}
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Smart Library
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
          {isLoading && "Verifying your email"}
          {isSuccess && "Email verified!"}
          {isError && "Verification unsuccessful"}
        </h1>

        <p
          role={isError ? "alert" : "status"}
          aria-live="polite"
          className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[var(--color-text-muted)]"
        >
          {message}
        </p>

        {isLoading && (
          <p className="mt-5 text-xs text-[var(--color-text-muted)]">
            Please do not close this page.
          </p>
        )}

        {isError && (
          <div className="mt-8 space-y-3">
            <Link
              to="/login"
              className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Go to login
            </Link>

            <Link
              to="/register"
              className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-5 py-3 font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-background)]"
            >
              Back to registration
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
