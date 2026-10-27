"use client";

import Link from "next/link";
import { useState } from "react";
import { adminRequest } from "@/lib/admin-client";
import { useAdminResource } from "@/lib/use-admin-resource";
import type { Project } from "@/lib/types";
import { AdminLoading, AdminNotice, AdminPageHeader } from "./page-header";

type AdminProject = Omit<Project, "media"> & {
  _count: { media: number };
};

export function AdminProjectsList() {
  const { data, loading, error, setError, reload } = useAdminResource<{
    projects: AdminProject[];
  }>("/api/admin/projects");
  const projects = data?.projects ?? [];
  const [notice, setNotice] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function remove(project: AdminProject) {
    if (
      !window.confirm(
        `Supprimer le projet « ${project.title} » et tous ses médias ?`,
      )
    ) {
      return;
    }

    setDeletingId(project.id);
    setError("");
    setNotice("");

    try {
      await adminRequest(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });
      setNotice("Projet supprimé.");
      reload();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Impossible de supprimer le projet.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <AdminPageHeader
        label="Projets"
        title="Planches et documents"
        description="Chaque projet est une planche avec une couverture, des dessins générés et, si besoin, des images ou des PDF. L’ordre d’affichage suit le champ Ordre."
        action={
          <Link className="admin-button" href="/admin/projets/nouveau">
            Nouveau projet
          </Link>
        }
      />

      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {notice && <AdminNotice type="success">{notice}</AdminNotice>}

      {loading ? (
        <AdminLoading label="Chargement des projets…" />
      ) : projects.length === 0 ? (
        <div className="admin-card">
          <div className="admin-card__body">
            <p className="admin-empty">
              Aucun projet. Créez une première planche pour commencer.
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-projects">
          {projects.map((project) => (
            <article className="admin-project-row" key={project.id}>
              <span className="admin-project-row__plate">
                {project.plate}
              </span>

              <div>
                <h2 className="admin-project-row__title">
                  {project.title}
                </h2>
                <p className="admin-project-row__meta">
                  {project.category} · {project.period} ·{" "}
                  {project._count.media} média
                  {project._count.media > 1 ? "s" : ""} · Ordre{" "}
                  {project.sortOrder}
                </p>
                <p className="admin-project-row__meta">
                  /projets/{project.slug}{" "}
                  <span
                    className={`admin-badge${
                      project.published ? " admin-badge--live" : ""
                    }`}
                  >
                    {project.published ? "Publié" : "Brouillon"}
                  </span>
                </p>
              </div>

              <div className="admin-project-row__actions">
                <Link
                  className="admin-button admin-button--ghost admin-button--small"
                  href={`/admin/projets/${project.id}`}
                >
                  Modifier
                </Link>
                <Link
                  className="admin-button admin-button--ghost admin-button--small"
                  href={`/projets/${project.slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Voir
                </Link>
                <button
                  className="admin-button admin-button--danger admin-button--small"
                  type="button"
                  onClick={() => remove(project)}
                  disabled={deletingId === project.id}
                >
                  {deletingId === project.id ? "…" : "Supprimer"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
