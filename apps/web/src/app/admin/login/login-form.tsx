"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
        credentials: "same-origin",
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Connexion impossible.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Connexion impossible. Réessayez.",
      );
      setSending(false);
    }
  }

  return (
    <form className="admin-login__form" onSubmit={handleSubmit}>
      <label className="admin-field">
        <span className="admin-field__label">Adresse e-mail</span>
        <input
          className="admin-input"
          type="email"
          name="email"
          autoComplete="username"
          required
        />
      </label>

      <label className="admin-field">
        <span className="admin-field__label">Mot de passe</span>
        <div style={{ position: "relative" }}>
          <input
            className="admin-input"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
            style={{ paddingRight: "2.2rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            style={{
              position: "absolute",
              right: "0.4rem",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              color: "var(--ink-faint)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.8rem",
              height: "1.8rem",
            }}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </label>

      {error && (
        <p className="admin-notice admin-notice--error" role="alert">
          {error}
        </p>
      )}

      <button className="admin-button admin-button--wide" type="submit" disabled={sending}>
        {sending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
