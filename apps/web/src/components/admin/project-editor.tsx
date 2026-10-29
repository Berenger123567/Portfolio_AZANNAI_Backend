"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectDrawing } from "@/components/drawings";
import { adminRequest } from "@/lib/admin-client";
import type { DrawingKind, Project, ProjectMedia } from "@/lib/types";
import {
  AdminLoading,
  AdminNotice,
  AdminPageHeader,
} from "./page-header";

type ProjectForm = {
  slug: string;
  plate: string;
  title: string;
  category: string;
  period: string;
  summary: string;
  description: string;
  scope: string;
  role: string;
  tools: string;
  published: boolean;
  sortOrder: string;
};

type MediaForm = {
  drawingKind: DrawingKind;
  code: string;
  caption: string;
  sortOrder: string;
};

const emptyProject: ProjectForm = {
  slug: "",
  plate: "",
  title: "",
  category: "Architecture",
  period: "Projet académique",
  summary: "",
  description: "",
  scope: "",
  role: "",
  tools: "",
  published: true,
  sortOrder: "0",
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

function toForm(project: Project): ProjectForm {
  return {
    slug: project.slug,
    plate: project.plate,
    title: project.title,
    category: project.category,
    period: project.period,
    summary: project.summary,
    description: project.description.join("\n"),
    scope: project.scope.join("\n"),
    role: project.role,
    tools: project.tools.join("\n"),
    published: project.published,
    sortOrder: String(project.sortOrder),
  };
}

export function ProjectEditor({ projectId }: { projectId: string }) {
  const isNew = projectId === "nouveau";
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyProject);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [mediaError, setMediaError] = useState("");
  const [mediaNotice, setMediaNotice] = useState("");
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [mediaForm, setMediaForm] = useState<MediaForm>({
    drawingKind: "plan",
    code: "",
    caption: "",
    sortOrder: "0",
  });
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
  const [savingMedia, setSavingMedia] = useState(false);
  const [replacingMediaId, setReplacingMediaId] = useState<string | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [drawingForm, setDrawingForm] = useState<MediaForm>({
    drawingKind: "plan",
    code: "",
    caption: "",
    sortOrder: "0",
  });
  const [uploadCode, setUploadCode] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadSort, setUploadSort] = useState("0");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (isNew) {
      return;
    }

    try {
      const data = await adminRequest<{ project: Project }>(
        `/api/admin/projects/${projectId}`,
      );
      setProject(data.project);
      setForm(toForm(data.project));
      setError("");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [isNew, projectId]);

  useEffect(() => {
    if (isNew) {
      return;
    }

    let active = true;

    adminRequest<{ project: Project }>(`/api/admin/projects/${projectId}`)
      .then((data) => {
        if (active) {
          setProject(data.project);
          setForm(toForm(data.project));
          setError("");
        }
      })
      .catch((caught: unknown) => {
        if (active) {
          setError(errorMessage(caught));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isNew, projectId]);

  function update(name: keyof ProjectForm, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        slug: form.slug.trim(),
        plate: form.plate.trim(),
        title: form.title.trim(),
        category: form.category.trim(),
        period: form.period.trim(),
        summary: form.summary.trim(),
        description: form.description
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        scope: form.scope
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        role: form.role.trim(),
        tools: form.tools
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        published: form.published,
        sortOrder: Number(form.sortOrder || 0),
      };

      if (isNew) {
        const data = await adminRequest<{ project: Project }>(
          "/api/admin/projects",
          { method: "POST", body: payload },
        );
        setProject(data.project);
        setForm(toForm(data.project));
        setNotice("Projet créé. Vous pouvez maintenant ajouter des médias.");
        router.replace(`/admin/projets/${data.project.id}`);
        return;
      }

      await adminRequest(`/api/admin/projects/${projectId}`, {
        method: "PUT",
        body: payload,
      });
      setNotice("Projet enregistré.");
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  async function removeProject() {
    if (
      !project ||
      !window.confirm(
        `Supprimer le projet « ${project.title} » et tous ses médias ?`,
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await adminRequest(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });
      router.replace("/admin/projets");
    } catch (caught) {
      setError(errorMessage(caught));
      setDeleting(false);
    }
  }

  async function reloadMedia() {
    const data = await adminRequest<{ project: Project }>(
      `/api/admin/projects/${projectId}`,
    );
    setProject(data.project);
  }

  function startMediaEdit(media: ProjectMedia) {
    setEditingMediaId(media.id);
    setMediaForm({
      drawingKind: media.drawingKind ?? "plan",
      code: media.code,
      caption: media.caption,
      sortOrder: String(media.sortOrder),
    });
    setMediaError("");
    setMediaNotice("");
  }

  async function saveMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingMediaId) {
      return;
    }

    const media = project?.media.find((item) => item.id === editingMediaId);

    if (!media) {
      return;
    }

    setSavingMedia(true);
    setMediaError("");
    setMediaNotice("");

    try {
      const payload: Record<string, unknown> = {
        code: mediaForm.code.trim(),
        caption: mediaForm.caption.trim(),
        sortOrder: Number(mediaForm.sortOrder || 0),
      };

      if (media.kind === "drawing") {
        payload.drawingKind = mediaForm.drawingKind;
      }

      await adminRequest(
        `/api/admin/projects/${projectId}/media/${media.id}`,
        { method: "PUT", body: payload },
      );
      setEditingMediaId(null);
      setMediaNotice("Média mis à jour.");
      await reloadMedia();
    } catch (caught) {
      setMediaError(errorMessage(caught));
    } finally {
      setSavingMedia(false);
    }
  }

  async function deleteMedia(media: ProjectMedia) {
    if (!window.confirm(`Supprimer « ${media.caption} » ?`)) {
      return;
    }

    setDeletingMediaId(media.id);
    setMediaError("");
    setMediaNotice("");

    try {
      await adminRequest(
        `/api/admin/projects/${projectId}/media/${media.id}`,
        { method: "DELETE" },
      );
      setMediaNotice("Média supprimé.");
      await reloadMedia();
    } catch (caught) {
      setMediaError(errorMessage(caught));
    } finally {
      setDeletingMediaId(null);
    }
  }

  function startReplace(media: ProjectMedia) {
    setReplacingMediaId(media.id);
    setReplaceFile(null);
    setMediaError("");
    setMediaNotice("");
    if (replaceInputRef.current) {
      replaceInputRef.current.value = "";
    }
  }

  async function replaceMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!replacingMediaId || !replaceFile) {
      setMediaError("Sélectionnez un fichier à remplacer.");
      return;
    }

    setSavingMedia(true);
    setMediaError("");
    setMediaNotice("");

    try {
      const formData = new FormData();
      formData.append("file", replaceFile);
      const media = project?.media.find((item) => item.id === replacingMediaId);
      if (media) {
        formData.append("code", media.code);
        formData.append("caption", media.caption);
        formData.append("sortOrder", String(media.sortOrder));
      }

      await adminRequest(
        `/api/admin/projects/${projectId}/media/${replacingMediaId}/replace`,
        { form: formData },
      );
      setReplacingMediaId(null);
      setReplaceFile(null);
      if (replaceInputRef.current) {
        replaceInputRef.current.value = "";
      }
      setMediaNotice("Fichier remplacé.");
      await reloadMedia();
    } catch (caught) {
      setMediaError(errorMessage(caught));
    } finally {
      setSavingMedia(false);
    }
  }

  async function addDrawing(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingMedia(true);
    setMediaError("");
    setMediaNotice("");

    try {
      await adminRequest(`/api/admin/projects/${projectId}/media/drawing`, {
        method: "POST",
        body: {
          kind: "drawing",
          drawingKind: drawingForm.drawingKind,
          code: drawingForm.code.trim(),
          caption: drawingForm.caption.trim(),
          sortOrder: Number(drawingForm.sortOrder || 0),
        },
      });
      setDrawingForm({
        drawingKind: "plan",
        code: "",
        caption: "",
        sortOrder: String((project?.media.length ?? 0) + 1),
      });
      setMediaNotice("Dessin ajouté.");
      await reloadMedia();
    } catch (caught) {
      setMediaError(errorMessage(caught));
    } finally {
      setSavingMedia(false);
    }
  }

  async function uploadFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setMediaError("Sélectionnez un fichier.");
      return;
    }

    setUploading(true);
    setMediaError("");
    setMediaNotice("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("code", uploadCode.trim());
      formData.append("caption", uploadCaption.trim());
      formData.append("sortOrder", String(Number(uploadSort || 0)));

      await adminRequest(`/api/admin/projects/${projectId}/media/upload`, {
        form: formData,
      });

      setUploadCode("");
      setUploadCaption("");
      setUploadSort(String((project?.media.length ?? 0) + 1));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setMediaNotice("Fichier ajouté.");
      await reloadMedia();
    } catch (caught) {
      setMediaError(errorMessage(caught));
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <AdminLoading label="Chargement du projet…" />;
  }

  if (!isNew && !project) {
    return (
      <>
        <AdminPageHeader label="Projet" title="Projet introuvable" />
        <AdminNotice type="error">
          {error || "Ce projet n’existe pas ou a été supprimé."}
        </AdminNotice>
        <Link className="admin-button" href="/admin/projets">
          Retour aux projets
        </Link>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        label="Projet"
        title={isNew ? "Nouveau projet" : (project?.title ?? "Projet")}
        description={
          isNew
            ? "Créez la fiche, puis ajoutez les dessins et les fichiers depuis la page d’édition."
            : "Modifiez la fiche et gérez les médias affichés sur la planche publique."
        }
        action={
          <>
            <Link className="admin-button admin-button--ghost" href="/admin/projets">
              Retour
            </Link>
            {project && (
              <Link
                className="admin-button admin-button--ghost"
                href={`/projets/${project.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                Voir la planche
              </Link>
            )}
            {project && (
              <button
                className="admin-button admin-button--danger"
                type="button"
                onClick={removeProject}
                disabled={deleting}
              >
                {deleting ? "Suppression…" : "Supprimer"}
              </button>
            )}
          </>
        }
      />

      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {notice && <AdminNotice type="success">{notice}</AdminNotice>}

      <form className="admin-card admin-form" onSubmit={save}>
        <div className="admin-card__head">
          <h2 className="admin-card__title">Fiche du projet</h2>
          <span className="admin-hint">
            {form.published ? "Visible sur le site" : "Brouillon"}
          </span>
        </div>

        <div className="admin-card__body admin-form">
          <div className="admin-form__grid admin-form__grid--3">
            <label className="admin-field">
              <span className="admin-field__label">Planche</span>
              <input
                className="admin-input"
                value={form.plate}
                onChange={(event) => update("plate", event.target.value)}
                placeholder="PL-04"
                required
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Catégorie</span>
              <input
                className="admin-input"
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
                required
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Période</span>
              <input
                className="admin-input"
                value={form.period}
                onChange={(event) => update("period", event.target.value)}
                required
              />
            </label>

            <label className="admin-field admin-field--full">
              <span className="admin-field__label">Titre</span>
              <input
                className="admin-input"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                required
              />
            </label>

            <label className="admin-field admin-field--full">
              <span className="admin-field__label">Slug (URL)</span>
              <div className="admin-form__actions" style={{ paddingTop: 0 }}>
                <input
                  className="admin-input"
                  value={form.slug}
                  onChange={(event) => update("slug", event.target.value)}
                  placeholder="nom-du-projet"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  required
                />
                <button
                  className="admin-button admin-button--ghost admin-button--small"
                  type="button"
                  onClick={() => update("slug", slugify(form.title))}
                >
                  Depuis le titre
                </button>
              </div>
            </label>

            <label className="admin-field">
              <span className="admin-field__label">Ordre</span>
              <input
                className="admin-input"
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={(event) => update("sortOrder", event.target.value)}
              />
            </label>

            <label className="admin-check">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) =>
                  update("published", event.target.checked)
                }
              />
              Publier sur le site
            </label>

            <label className="admin-field admin-field--full">
              <span className="admin-field__label">Résumé</span>
              <textarea
                className="admin-textarea"
                value={form.summary}
                onChange={(event) => update("summary", event.target.value)}
                rows={3}
                required
              />
            </label>

            <label className="admin-field admin-field--full">
              <span className="admin-field__label">
                Description — un paragraphe par ligne
              </span>
              <textarea
                className="admin-textarea admin-textarea--tall"
                value={form.description}
                onChange={(event) =>
                  update("description", event.target.value)
                }
                rows={6}
              />
            </label>

            <label className="admin-field">
              <span className="admin-field__label">
                Périmètre — une ligne par élément
              </span>
              <textarea
                className="admin-textarea"
                value={form.scope}
                onChange={(event) => update("scope", event.target.value)}
                rows={5}
              />
            </label>

            <label className="admin-field">
              <span className="admin-field__label">
                Outils — une ligne par élément
              </span>
              <textarea
                className="admin-textarea"
                value={form.tools}
                onChange={(event) => update("tools", event.target.value)}
                rows={5}
              />
            </label>

            <label className="admin-field admin-field--full">
              <span className="admin-field__label">Rôle</span>
              <textarea
                className="admin-textarea"
                value={form.role}
                onChange={(event) => update("role", event.target.value)}
                rows={2}
                required
              />
            </label>
          </div>

          <div className="admin-form__actions">
            <button className="admin-button" type="submit" disabled={saving}>
              {saving
                ? "Enregistrement…"
                : isNew
                  ? "Créer le projet"
                  : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>

      {project && (
        <section className="admin-card admin-form" style={{ marginTop: "1.5rem" }}>
          <div className="admin-card__head">
            <h2 className="admin-card__title">
              Médias ({project.media.length})
            </h2>
            <span className="admin-hint">
              Le premier média sert de couverture.
            </span>
          </div>

          <div className="admin-card__body admin-form">
            {mediaError && (
              <AdminNotice type="error">{mediaError}</AdminNotice>
            )}
            {mediaNotice && (
              <AdminNotice type="success">{mediaNotice}</AdminNotice>
            )}

            {project.media.length === 0 ? (
              <p className="admin-empty">
                Aucun média. Ajoutez un dessin ou un fichier.
              </p>
            ) : (
              <div className="admin-media">
                {project.media.map((media) => (
                  <article className="admin-media__item" key={media.id}>
                    <div className="admin-media__preview">
                      {media.kind === "drawing" && media.drawingKind ? (
                        <ProjectDrawing kind={media.drawingKind} decorative />
                      ) : media.kind === "image" && media.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={media.url} alt="" />
                      ) : (
                        <span className="admin-media__document">
                          <span>PDF</span>
                          <span>{media.code}</span>
                        </span>
                      )}
                      {media.kind !== "drawing" && (
                        <button
                          className="admin-media__replace"
                          type="button"
                          onClick={() => startReplace(media)}
                          aria-label="Remplacer le fichier"
                        >
                          Remplacer
                        </button>
                      )}
                    </div>

                    <div className="admin-media__body">
                      <div className="admin-media__meta">
                        <span>{media.code}</span>
                        <span>{media.kind}</span>
                        {media.drawingKind && (
                          <span>{media.drawingKind}</span>
                        )}
                        <span>Ordre {media.sortOrder}</span>
                      </div>
                      <p className="admin-entity__detail">
                        {media.caption}
                      </p>

                      <div className="admin-media__actions">
                        <button
                          className="admin-button admin-button--ghost admin-button--small"
                          type="button"
                          onClick={() => startMediaEdit(media)}
                        >
                          Modifier
                        </button>
                        {media.url && (
                          <a
                            className="admin-button admin-button--ghost admin-button--small"
                            href={media.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ouvrir
                          </a>
                        )}
                        <button
                          className="admin-button admin-button--danger admin-button--small"
                          type="button"
                          onClick={() => deleteMedia(media)}
                          disabled={deletingMediaId === media.id}
                        >
                          {deletingMediaId === media.id ? "…" : "Supprimer"}
                        </button>
                      </div>

                      {editingMediaId === media.id && (
                        <form className="admin-media__form" onSubmit={saveMedia}>
                          <div className="admin-form__grid">
                            {media.kind === "drawing" && (
                              <label className="admin-field">
                                <span className="admin-field__label">
                                  Type de dessin
                                </span>
                                <select
                                  className="admin-select"
                                  value={mediaForm.drawingKind}
                                  onChange={(event) =>
                                    setMediaForm((current) => ({
                                      ...current,
                                      drawingKind: event.target
                                        .value as DrawingKind,
                                    }))
                                  }
                                >
                                  <option value="plan">Plan</option>
                                  <option value="elevation">Élévation</option>
                                  <option value="section">Coupe</option>
                                </select>
                              </label>
                            )}
                            <label className="admin-field">
                              <span className="admin-field__label">Code</span>
                              <input
                                className="admin-input"
                                value={mediaForm.code}
                                onChange={(event) =>
                                  setMediaForm((current) => ({
                                    ...current,
                                    code: event.target.value,
                                  }))
                                }
                                required
                              />
                            </label>
                            <label className="admin-field">
                              <span className="admin-field__label">Ordre</span>
                              <input
                                className="admin-input"
                                type="number"
                                min="0"
                                value={mediaForm.sortOrder}
                                onChange={(event) =>
                                  setMediaForm((current) => ({
                                    ...current,
                                    sortOrder: event.target.value,
                                  }))
                                }
                              />
                            </label>
                            <label className="admin-field admin-field--full">
                              <span className="admin-field__label">
                                Légende
                              </span>
                              <textarea
                                className="admin-textarea"
                                value={mediaForm.caption}
                                onChange={(event) =>
                                  setMediaForm((current) => ({
                                    ...current,
                                    caption: event.target.value,
                                  }))
                                }
                                rows={2}
                                required
                              />
                            </label>
                          </div>
                          <div className="admin-form__actions">
                            <button
                              className="admin-button"
                              type="submit"
                              disabled={savingMedia}
                            >
                              {savingMedia ? "…" : "Enregistrer le média"}
                            </button>
                            <button
                              className="admin-button admin-button--ghost"
                              type="button"
                              onClick={() => setEditingMediaId(null)}
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      )}

                      {replacingMediaId === media.id && (
                        <form className="admin-media__form" onSubmit={replaceMedia}>
                          <h4 className="admin-card__title">Remplacer le fichier</h4>
                          <p className="admin-hint">
                            L’ancien fichier sera supprimé. Les métadonnées actuelles seront conservées.
                          </p>
                          <div className="admin-form__grid">
                            <label className="admin-field admin-field--full">
                              <span className="admin-field__label">Nouveau fichier</span>
                              <input
                                className="admin-input"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                ref={replaceInputRef}
                                onChange={(event) =>
                                  setReplaceFile(event.target.files?.[0] ?? null)
                                }
                                required
                              />
                            </label>
                          </div>
                          <div className="admin-form__actions">
                            <button
                              className="admin-button"
                              type="submit"
                              disabled={savingMedia || !replaceFile}
                            >
                              {savingMedia ? "Envoi…" : "Remplacer"}
                            </button>
                            <button
                              className="admin-button admin-button--ghost"
                              type="button"
                              onClick={() => {
                                setReplacingMediaId(null);
                                setReplaceFile(null);
                                if (replaceInputRef.current) {
                                  replaceInputRef.current.value = "";
                                }
                              }}
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="admin-grid admin-grid--2">
              <form className="admin-media__form" onSubmit={addDrawing}>
                <h3 className="admin-card__title">Ajouter un dessin</h3>
                <p className="admin-hint">
                  Les dessins sont générés par le site (plan, élévation ou
                  coupe) et ne nécessitent aucun fichier.
                </p>
                <div className="admin-form__grid">
                  <label className="admin-field">
                    <span className="admin-field__label">Type</span>
                    <select
                      className="admin-select"
                      value={drawingForm.drawingKind}
                      onChange={(event) =>
                        setDrawingForm((current) => ({
                          ...current,
                          drawingKind: event.target.value as DrawingKind,
                        }))
                      }
                    >
                      <option value="plan">Plan</option>
                      <option value="elevation">Élévation</option>
                      <option value="section">Coupe</option>
                    </select>
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">Code</span>
                    <input
                      className="admin-input"
                      value={drawingForm.code}
                      onChange={(event) =>
                        setDrawingForm((current) => ({
                          ...current,
                          code: event.target.value,
                        }))
                      }
                      placeholder="PL-04.1"
                      required
                    />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">Ordre</span>
                    <input
                      className="admin-input"
                      type="number"
                      min="0"
                      value={drawingForm.sortOrder}
                      onChange={(event) =>
                        setDrawingForm((current) => ({
                          ...current,
                          sortOrder: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span className="admin-field__label">Légende</span>
                    <textarea
                      className="admin-textarea"
                      value={drawingForm.caption}
                      onChange={(event) =>
                        setDrawingForm((current) => ({
                          ...current,
                          caption: event.target.value,
                        }))
                      }
                      rows={2}
                      required
                    />
                  </label>
                </div>
                <div className="admin-form__actions">
                  <button
                    className="admin-button"
                    type="submit"
                    disabled={savingMedia}
                  >
                    Ajouter le dessin
                  </button>
                </div>
              </form>

              <form className="admin-media__form" onSubmit={uploadFile}>
                <h3 className="admin-card__title">Téléverser un fichier</h3>
                  <p className="admin-hint">
                    JPEG, PNG, WebP, PDF, GLB, glTF, OBJ �?" 15 Mo maximum.
                  </p>
                  <div className="admin-form__grid">
                    <label className="admin-field admin-field--full">
                      <span className="admin-field__label">Fichier</span>
                      <input
                        className="admin-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf,.glb,.gltf,.obj,model/gltf-binary,model/gltf+json"
                        ref={fileInputRef}
                        required
                      />
                    </label>
                  <label className="admin-field">
                    <span className="admin-field__label">Code</span>
                    <input
                      className="admin-input"
                      value={uploadCode}
                      onChange={(event) => setUploadCode(event.target.value)}
                      placeholder="PL-04.4"
                      required
                    />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">Ordre</span>
                    <input
                      className="admin-input"
                      type="number"
                      min="0"
                      value={uploadSort}
                      onChange={(event) => setUploadSort(event.target.value)}
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span className="admin-field__label">Légende</span>
                    <textarea
                      className="admin-textarea"
                      value={uploadCaption}
                      onChange={(event) =>
                        setUploadCaption(event.target.value)
                      }
                      rows={2}
                      required
                    />
                  </label>
                </div>
                <div className="admin-form__actions">
                  <button
                    className="admin-button"
                    type="submit"
                    disabled={uploading}
                  >
                    {uploading ? "Envoi…" : "Téléverser"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
