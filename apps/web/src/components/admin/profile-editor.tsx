"use client";

import { useCallback, useEffect, useState } from "react";
import { adminRequest } from "@/lib/admin-client";
import type { Profile } from "@/lib/types";
import { AdminLoading, AdminNotice } from "./page-header";

type ProfileForm = Pick<
  Profile,
  | "fullName"
  | "firstName"
  | "lastName"
  | "role"
  | "location"
  | "school"
  | "degree"
  | "objective"
  | "email"
  | "phone"
  | "linkedin"
  | "github"
  | "facebook"
  | "statement"
  | "intro"
  | "method"
  | "vision"
  | "cvUrl"
  | "cvPublicId"
  | "avatarUrl"
  | "avatarPublicId"
>;

const editableFields: (keyof ProfileForm)[] = [
  "fullName",
  "firstName",
  "lastName",
  "role",
  "location",
  "school",
  "degree",
  "objective",
  "email",
  "phone",
  "linkedin",
  "github",
  "facebook",
  "statement",
  "intro",
  "method",
  "vision",
];

function toForm(profile: Profile): ProfileForm {
  const form = {} as ProfileForm;

  for (const key of editableFields) {
    form[key] = profile[key] as never;
  }

  form.cvUrl = profile.cvUrl;
  form.cvPublicId = profile.cvPublicId;
  form.avatarUrl = profile.avatarUrl ?? null;
  form.avatarPublicId = profile.avatarPublicId ?? null;
  return form;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export function ProfileEditor() {
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await adminRequest<{ profile: Profile }>(
        "/api/admin/profile",
      );
      setForm(toForm(data.profile));
      setError("");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    adminRequest<{ profile: Profile }>("/api/admin/profile")
      .then((data) => {
        if (active) {
          setForm(toForm(data.profile));
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
  }, []);

  function update(name: keyof ProfileForm, value: string) {
    setForm((current) =>
      current ? { ...current, [name]: value } : current,
    );
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await adminRequest("/api/admin/profile", {
        method: "PUT",
        body: form,
      });
      setNotice("Profil enregistré.");
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  async function uploadCv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await adminRequest<{
        file: { url: string; publicId: string };
      }>("/api/admin/uploads/cv", { form: formData });

      setForm((current) =>
        current
          ? {
              ...current,
              cvUrl: data.file.url,
              cvPublicId: data.file.publicId,
            }
          : current,
      );
      setNotice(
        "CV envoyé. Enregistrez le profil pour appliquer le changement.",
      );
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setUploading(false);
    }
  }

  function removeCv() {
    setForm((current) =>
      current
        ? { ...current, cvUrl: null, cvPublicId: null }
        : current,
    );
    setNotice(
      "Le CV sera retiré du site après l’enregistrement du profil.",
    );
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadingAvatar(true);
    setError("");
    setNotice("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
      const uploadUrl = apiBase ? `${apiBase}/api/admin/uploads/avatar` : "/api/admin/uploads/avatar";
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Échec de l'envoi de la photo.");
      }
      const data = (await res.json()) as { file: { url: string; publicId: string } };

      setForm((current) =>
        current
          ? {
              ...current,
              avatarUrl: data.file.url,
              avatarPublicId: data.file.publicId,
            }
          : current,
      );
      setNotice(
        "Photo de profil envoyée. Enregistrez le profil pour appliquer le changement.",
      );
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setUploadingAvatar(false);
    }
  }

  function removeAvatar() {
    setForm((current) =>
      current
        ? { ...current, avatarUrl: null, avatarPublicId: null }
        : current,
    );
    setNotice(
      "La photo de profil sera retirée du site après l’enregistrement du profil.",
    );
  }

  if (loading) {
    return <AdminLoading label="Chargement du profil…" />;
  }

  if (!form) {
    return (
      <AdminNotice type="error">
        {error || "Impossible de charger le profil."}
      </AdminNotice>
    );
  }

  return (
    <form className="admin-card admin-form" onSubmit={save}>
      <div className="admin-card__head">
        <h2 className="admin-card__title">Identité et présentation</h2>
        <span className="admin-hint">Les champs sont visibles sur le site.</span>
      </div>

      <div className="admin-card__body admin-form">
        {error && <AdminNotice type="error">{error}</AdminNotice>}
        {notice && <AdminNotice type="success">{notice}</AdminNotice>}

        <div className="admin-card">
          <div className="admin-card__head">
            <h3 className="admin-card__title">Photo de profil</h3>
          </div>
          <div className="admin-card__body admin-form">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ width: "96px", height: "96px", borderRadius: "50%", overflow: "hidden", border: "1px solid var(--rule)", background: "var(--sheet)" }}>
                {form.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "grid", placeItems: "center", height: "100%", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--ink-faint)" }}>
                    A
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <label className="admin-button admin-button--ghost">
                  {uploadingAvatar ? "Envoi…" : "Téléverser une photo"}
                  <input type="file" accept="image/*" hidden onChange={uploadAvatar} disabled={uploadingAvatar} />
                </label>
                {form.avatarUrl && (
                  <button className="admin-button admin-button--danger" type="button" onClick={removeAvatar}>
                    Supprimer
                  </button>
                )}
              </div>
            </div>
            <p className="admin-hint">JPG, PNG, WebP recommandé. Carré de préférence.</p>
          </div>
        </div>

        <div className="admin-form__grid">
          <label className="admin-field">
            <span className="admin-field__label">Nom complet</span>
            <input
              className="admin-input"
              value={form.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">Prénom</span>
            <input
              className="admin-input"
              value={form.firstName}
              onChange={(event) => update("firstName", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">Nom</span>
            <input
              className="admin-input"
              value={form.lastName}
              onChange={(event) => update("lastName", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">Rôle affiché</span>
            <input
              className="admin-input"
              value={form.role}
              onChange={(event) => update("role", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">Localisation</span>
            <input
              className="admin-input"
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">Établissement</span>
            <input
              className="admin-input"
              value={form.school}
              onChange={(event) => update("school", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">Diplôme</span>
            <input
              className="admin-input"
              value={form.degree}
              onChange={(event) => update("degree", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">Objectif / recherche</span>
            <input
              className="admin-input"
              value={form.objective}
              onChange={(event) => update("objective", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">E-mail</span>
            <input
              className="admin-input"
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">Téléphone</span>
            <input
              className="admin-input"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">
              LinkedIn (optionnel)
            </span>
            <input
              className="admin-input"
              type="url"
              value={form.linkedin}
              onChange={(event) => update("linkedin", event.target.value)}
              placeholder="https://www.linkedin.com/in/…"
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">
              GitHub (optionnel)
            </span>
            <input
              className="admin-input"
              type="url"
              value={form.github}
              onChange={(event) => update("github", event.target.value)}
              placeholder="https://github.com/…"
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">
              Facebook (optionnel)
            </span>
            <input
              className="admin-input"
              type="url"
              value={form.facebook}
              onChange={(event) => update("facebook", event.target.value)}
              placeholder="https://www.facebook.com/…"
            />
          </label>

          <label className="admin-field admin-field--full">
            <span className="admin-field__label">Phrase d’accroche</span>
            <textarea
              className="admin-textarea"
              value={form.statement}
              onChange={(event) => update("statement", event.target.value)}
              rows={3}
              required
            />
          </label>

          <label className="admin-field admin-field--full">
            <span className="admin-field__label">Présentation</span>
            <textarea
              className="admin-textarea admin-textarea--tall"
              value={form.intro}
              onChange={(event) => update("intro", event.target.value)}
              rows={6}
              required
            />
          </label>

          <label className="admin-field admin-field--full">
            <span className="admin-field__label">Méthode / approche</span>
            <textarea
              className="admin-textarea admin-textarea--tall"
              value={form.method}
              onChange={(event) => update("method", event.target.value)}
              rows={6}
              required
            />
          </label>

          <label className="admin-field admin-field--full">
            <span className="admin-field__label">Vision</span>
            <textarea
              className="admin-textarea admin-textarea--tall"
              value={form.vision}
              onChange={(event) => update("vision", event.target.value)}
              rows={6}
              required
            />
          </label>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3 className="admin-card__title">CV au format PDF</h3>
          </div>
          <div className="admin-card__body admin-form">
            {form.cvUrl ? (
              <p className="admin-hint">
                Fichier actuel :{" "}
                <a href={form.cvUrl} target="_blank" rel="noreferrer">
                  ouvrir le CV
                </a>
              </p>
            ) : (
              <p className="admin-hint">
                Aucun CV en ligne. Le site propose alors une demande par
                e-mail.
              </p>
            )}

            <div className="admin-form__actions">
              <label className="admin-field">
                <span className="admin-field__label">
                  {uploading ? "Envoi en cours…" : "Remplacer le CV"}
                </span>
                <input
                  className="admin-input"
                  type="file"
                  accept="application/pdf"
                  onChange={uploadCv}
                  disabled={uploading}
                />
              </label>

              {form.cvUrl && (
                <button
                  className="admin-button admin-button--danger"
                  type="button"
                  onClick={removeCv}
                >
                  Retirer le CV
                </button>
              )}
            </div>

            <p className="admin-hint">
              Le fichier doit être un PDF. Il est stocké sur le serveur ou sur
              Cloudinary si le service est configuré.
            </p>
          </div>
        </div>

        <div className="admin-form__actions">
          <button className="admin-button" type="submit" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer le profil"}
          </button>
        </div>
      </div>
    </form>
  );
}
