"use client";

import { useState } from "react";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/public/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          body: formData.get("body"),
          website: formData.get("website"),
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        issues?: { path: string; message: string }[];
      };

      if (!response.ok) {
        const issue = payload.issues?.[0]?.message;
        throw new Error(issue ?? payload.error ?? "Échec de l’envoi.");
      }

      form.reset();
      setStatus({
        type: "success",
        message:
          "Message envoyé. Je vous réponds dès que possible à l’adresse indiquée.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue. Réessayez dans un instant.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__grid">
        <label className="field">
          <span className="field__label">Nom</span>
          <input
            className="field__input"
            type="text"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
          />
        </label>

        <label className="field">
          <span className="field__label">E-mail</span>
          <input
            className="field__input"
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={200}
          />
        </label>

        <label className="field">
          <span className="field__label">Téléphone (optionnel)</span>
          <input
            className="field__input"
            type="tel"
            name="phone"
            autoComplete="tel"
            maxLength={40}
          />
        </label>

        <label className="field">
          <span className="field__label">Objet</span>
          <input
            className="field__input"
            type="text"
            name="subject"
            required
            minLength={2}
            maxLength={200}
          />
        </label>
      </div>

      <label className="field">
        <span className="field__label">Message</span>
        <textarea
          className="field__input field__input--area"
          name="body"
          required
          minLength={10}
          maxLength={5000}
          rows={8}
        />
      </label>

      <div className="contact-form__honeypot" aria-hidden="true">
        <label>
          <span>Site web</span>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="contact-form__actions">
        <button className="button" type="submit" disabled={sending}>
          {sending ? "Envoi en cours…" : "Envoyer le message"}
        </button>
        <p className="contact-form__note">
          Vos coordonnées servent uniquement à répondre à votre message.
        </p>
      </div>

      <p
        className={`contact-form__status${
          status.type !== "idle"
            ? ` contact-form__status--${status.type}`
            : ""
        }`}
        role="status"
        aria-live="polite"
      >
        {status.message}
      </p>
    </form>
  );
}
