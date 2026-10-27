"use client";

import Link from "next/link";
import { formatAdminDate } from "@/lib/admin-client";
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
};

type OverviewData = {
  counts: {
    projects: number;
    publishedProjects: number;
    messages: number;
    unreadMessages: number;
    education: number;
    skills: number;
  };
  recentMessages: Message[];
};

export function AdminOverview() {
  const { data, loading, error } =
    useAdminResource<OverviewData>("/api/admin/overview");

  return (
    <>
      <AdminPageHeader
        label="Vue d’ensemble"
        title="Administration du portfolio"
        description="Modifier le profil, les projets, le parcours et les compétences. Les changements sont visibles immédiatement sur le site."
        action={
          <Link className="admin-button" href="/admin/projets/nouveau">
            Nouveau projet
          </Link>
        }
      />

      {error && <AdminNotice type="error">{error}</AdminNotice>}

      {loading ? (
        <AdminLoading label="Chargement des données…" />
      ) : !data ? null : (
        <div className="admin-grid">
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="admin-stat__value">
                {data.counts.projects}
              </span>
              <span className="admin-stat__label">Projets</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__value">
                {data.counts.publishedProjects}
              </span>
              <span className="admin-stat__label">Projets publiés</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__value">
                {data.counts.messages}
              </span>
              <span className="admin-stat__label">Messages reçus</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__value">
                {data.counts.unreadMessages}
              </span>
              <span className="admin-stat__label">Messages non lus</span>
            </div>
          </div>

          <div className="admin-grid admin-grid--2">
            <section className="admin-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">Accès rapides</h2>
              </div>
              <div className="admin-card__body">
                <div className="admin-form__actions">
                  <Link className="admin-button admin-button--ghost" href="/admin/profil">
                    Profil & CV
                  </Link>
                  <Link className="admin-button admin-button--ghost" href="/admin/parcours">
                    Parcours
                  </Link>
                  <Link className="admin-button admin-button--ghost" href="/admin/competences">
                    Compétences
                  </Link>
                  <Link className="admin-button admin-button--ghost" href="/admin/projets">
                    Projets
                  </Link>
                </div>
                <p className="admin-hint" style={{ marginTop: "1rem" }}>
                  {data.counts.education} formations et {data.counts.skills}{" "}
                  compétences sont actuellement enregistrées.
                </p>
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">Messages récents</h2>
                <Link className="admin-button admin-button--ghost admin-button--small" href="/admin/messages">
                  Tout voir
                </Link>
              </div>
              <div className="admin-card__body">
                {data.recentMessages.length === 0 ? (
                  <p className="admin-empty">Aucun message pour le moment.</p>
                ) : (
                  <div className="admin-entity__items">
                    {data.recentMessages.map((message) => (
                      <div className="admin-entity__item" key={message.id}>
                        <div className="admin-entity__row">
                          <p className="admin-entity__name">
                            {message.subject}
                          </p>
                          <span className="admin-entity__meta">
                            {formatAdminDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="admin-entity__detail">
                          {message.name} · {message.email}
                        </p>
                        {!message.read && (
                          <span className="admin-badge admin-badge--unread">
                            Non lu
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
