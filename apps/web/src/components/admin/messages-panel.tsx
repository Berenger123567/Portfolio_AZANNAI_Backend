"use client";

import { useState } from "react";
import { adminRequest, formatAdminDate } from "@/lib/admin-client";
import { useAdminResource } from "@/lib/use-admin-resource";
import { AdminLoading, AdminNotice, AdminPageHeader } from "./page-header";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export function AdminMessagesPanel() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const path = `/api/admin/messages${unreadOnly ? "?unread=1" : ""}`;
  const { data, loading, error, setError, reload } = useAdminResource<{
    messages: Message[];
  }>(path);
  const messages = data?.messages ?? [];
  const selected =
    messages.find((message) => message.id === selectedId) ?? messages[0] ?? null;

  async function toggleRead(message: Message) {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      await adminRequest(`/api/admin/messages/${message.id}/read`, {
        method: "PATCH",
        body: { read: !message.read },
      });
      setNotice(
        message.read ? "Message marqué comme non lu." : "Message marqué comme lu.",
      );
      reload();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Impossible de modifier le message.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(message: Message) {
    if (!window.confirm(`Supprimer le message « ${message.subject} » ?`)) {
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      await adminRequest(`/api/admin/messages/${message.id}`, {
        method: "DELETE",
      });
      setNotice("Message supprimé.");
      reload();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Impossible de supprimer le message.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        label="Messages"
        title="Messages reçus"
        description="Les messages envoyés depuis le formulaire de contact. Ils restent privés et ne sont jamais publiés sur le site."
        action={
          <button
            className="admin-button admin-button--ghost"
            type="button"
            onClick={() => setUnreadOnly((current) => !current)}
          >
            {unreadOnly ? "Afficher tous les messages" : "Afficher les non lus"}
          </button>
        }
      />

      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {notice && <AdminNotice type="success">{notice}</AdminNotice>}

      {loading ? (
        <AdminLoading label="Chargement des messages…" />
      ) : messages.length === 0 ? (
        <div className="admin-card">
          <div className="admin-card__body">
            <p className="admin-empty">
              {unreadOnly
                ? "Aucun message non lu."
                : "Aucun message pour le moment."}
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-messages">
          <div className="admin-message-list">
            {messages.map((message) => (
              <button
                className={`admin-message${
                  message.id === selectedId ? " admin-message--active" : ""
                }`}
                key={message.id}
                type="button"
                onClick={() => setSelectedId(message.id)}
              >
                <span className="admin-message__top">
                  <span className="admin-message__name">{message.name}</span>
                  <span className="admin-message__date">
                    {formatAdminDate(message.createdAt)}
                  </span>
                </span>
                <span className="admin-message__subject">
                  {message.subject}
                </span>
                {!message.read && (
                  <span className="admin-badge admin-badge--unread">
                    Non lu
                  </span>
                )}
              </button>
            ))}
          </div>

          {selected && (
            <article className="admin-message-view">
              <div className="admin-message-view__head">
                <h2 className="admin-message-view__title">
                  {selected.subject}
                </h2>
                <p className="admin-message-view__meta">
                  <span>{selected.name}</span>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  {selected.phone && <span>{selected.phone}</span>}
                  <span>{formatAdminDate(selected.createdAt)}</span>
                  <span className="admin-badge">
                    {selected.read ? "Lu" : "Non lu"}
                  </span>
                </p>
              </div>

              <div className="admin-message-view__body">{selected.body}</div>

              <div className="admin-message-view__actions">
                <a
                  className="admin-button admin-button--ghost admin-button--small"
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    `Re: ${selected.subject}`,
                  )}`}
                >
                  Répondre par e-mail
                </a>
                <button
                  className="admin-button admin-button--ghost admin-button--small"
                  type="button"
                  onClick={() => toggleRead(selected)}
                  disabled={busy}
                >
                  {selected.read
                    ? "Marquer comme non lu"
                    : "Marquer comme lu"}
                </button>
                <button
                  className="admin-button admin-button--danger admin-button--small"
                  type="button"
                  onClick={() => remove(selected)}
                  disabled={busy}
                >
                  Supprimer
                </button>
              </div>
            </article>
          )}
        </div>
      )}
    </>
  );
}
