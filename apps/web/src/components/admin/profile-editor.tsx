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
  | "heroIndex"
  | "heroCopy"
  | "heroLinkText"
  | "projectsLabel"
  | "projectsTitle"
  | "projectsIntro"
  | "registerLabel"
  | "registerTitle"
  | "registerNote"
  | "fieldNote1Src"
  | "fieldNote1Alt"
  | "fieldNote1Index"
  | "fieldNote1Meta"
  | "fieldNote1Caption"
  | "fieldNote1Class"
  | "fieldNote2Src"
  | "fieldNote2Alt"
  | "fieldNote2Index"
  | "fieldNote2Meta"
  | "fieldNote2Caption"
  | "fieldNote2Class"
  | "fieldNote3Src"
  | "fieldNote3Alt"
  | "fieldNote3Index"
  | "fieldNote3Meta"
  | "fieldNote3Caption"
  | "fieldNote3Class"
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
  "heroIndex",
  "heroCopy",
  "heroLinkText",
  "projectsLabel",
  "projectsTitle",
  "projectsIntro",
  "registerLabel",
  "registerTitle",
  "registerNote",
  "fieldNote1Src",
  "fieldNote1Alt",
  "fieldNote1Index",
  "fieldNote1Meta",
  "fieldNote1Caption",
  "fieldNote1Class",
  "fieldNote2Src",
  "fieldNote2Alt",
  "fieldNote2Index",
  "fieldNote2Meta",
  "fieldNote2Caption",
  "fieldNote2Class",
  "fieldNote3Src",
  "fieldNote3Alt",
  "fieldNote3Index",
  "fieldNote3Meta",
  "fieldNote3Caption",
  "fieldNote3Class",
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
  form.heroIndex = profile.heroIndex ?? "";
  form.heroCopy = profile.heroCopy ?? "";
  form.heroLinkText = profile.heroLinkText ?? "";
  form.projectsLabel = profile.projectsLabel ?? "";
  form.projectsTitle = profile.projectsTitle ?? "";
  form.projectsIntro = profile.projectsIntro ?? "";
  form.registerLabel = profile.registerLabel ?? "";
  form.registerTitle = profile.registerTitle ?? "";
  form.registerNote = profile.registerNote ?? "";
  form.fieldNote1Src = profile.fieldNote1Src ?? "";
  form.fieldNote1Alt = profile.fieldNote1Alt ?? "";
  form.fieldNote1Index = profile.fieldNote1Index ?? "";
  form.fieldNote1Meta = profile.fieldNote1Meta ?? "";
  form.fieldNote1Caption = profile.fieldNote1Caption ?? "";
  form.fieldNote1Class = profile.fieldNote1Class ?? "";
  form.fieldNote2Src = profile.fieldNote2Src ?? "";
  form.fieldNote2Alt = profile.fieldNote2Alt ?? "";
  form.fieldNote2Index = profile.fieldNote2Index ?? "";
  form.fieldNote2Meta = profile.fieldNote2Meta ?? "";
  form.fieldNote2Caption = profile.fieldNote2Caption ?? "";
  form.fieldNote2Class = profile.fieldNote2Class ?? "";
  form.fieldNote3Src = profile.fieldNote3Src ?? "";
  form.fieldNote3Alt = profile.fieldNote3Alt ?? "";
  form.fieldNote3Index = profile.fieldNote3Index ?? "";
  form.fieldNote3Meta = profile.fieldNote3Meta ?? "";
  form.fieldNote3Caption = profile.fieldNote3Caption ?? "";
  form.fieldNote3Class = profile.fieldNote3Class ?? "";
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
  const [uploadingFieldNote, setUploadingFieldNote] = useState<Record<1 | 2 | 3, boolean>>({
    1: false,
    2: false,
    3: false,
  });
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

  async function uploadFieldNote(event: React.ChangeEvent<HTMLInputElement>, index: 1 | 2 | 3) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadingFieldNote((prev) => ({ ...prev, [index]: true }));
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
        throw new Error(err.error ?? "Échec de l'envoi de l'image.");
      }
      const data = (await res.json()) as { file: { url: string; publicId: string } };

      setForm((current) => {
        if (!current) return current;
        if (index === 1) {
          return { ...current, fieldNote1Src: data.file.url };
        }
        if (index === 2) {
          return { ...current, fieldNote2Src: data.file.url };
        }
        return { ...current, fieldNote3Src: data.file.url };
      });
      setNotice("Image envoyée. Enregistrez le profil pour appliquer le changement.");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setUploadingFieldNote((prev) => ({ ...prev, [index]: false }));
    }
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
            <h3 className="admin-card__title">Accueil - Hero</h3>
          </div>
          <div className="admin-card__body admin-form">
            <div className="admin-form__grid">
              <label className="admin-field">
                <span className="admin-field__label">PL-00 / Axonométrie</span>
                <input className="admin-input" value={form.heroIndex ?? ""} onChange={(e) => update("heroIndex", e.target.value)} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Texte du lien</span>
                <input className="admin-input" value={form.heroLinkText ?? ""} onChange={(e) => update("heroLinkText", e.target.value)} />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Texte sous l'axonométrie</span>
                <textarea className="admin-textarea" rows={3} value={form.heroCopy ?? ""} onChange={(e) => update("heroCopy", e.target.value)} />
              </label>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3 className="admin-card__title">Accueil - Projets / Planches</h3>
          </div>
          <div className="admin-card__body admin-form">
            <div className="admin-form__grid">
              <label className="admin-field">
                <span className="admin-field__label">Label</span>
                <input className="admin-input" value={form.projectsLabel ?? ""} onChange={(e) => update("projectsLabel", e.target.value)} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Titre</span>
                <input className="admin-input" value={form.projectsTitle ?? ""} onChange={(e) => update("projectsTitle", e.target.value)} placeholder="Dossier de projets" />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Intro</span>
                <textarea className="admin-textarea" rows={3} value={form.projectsIntro ?? ""} onChange={(e) => update("projectsIntro", e.target.value)} />
              </label>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3 className="admin-card__title">Accueil - Registre terrain</h3>
          </div>
          <div className="admin-card__body admin-form">
            <div className="admin-form__grid">
              <label className="admin-field">
                <span className="admin-field__label">Label</span>
                <input className="admin-input" value={form.registerLabel ?? ""} onChange={(e) => update("registerLabel", e.target.value)} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Titre</span>
                <input className="admin-input" value={form.registerTitle ?? ""} onChange={(e) => update("registerTitle", e.target.value)} />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Note</span>
                <textarea className="admin-textarea" rows={3} value={form.registerNote ?? ""} onChange={(e) => update("registerNote", e.target.value)} />
              </label>
            </div>
            <h4 style={{ marginTop: "1rem" }}>Photo 1</h4>
            {form.fieldNote1Src ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.fieldNote1Src} alt={form.fieldNote1Alt || ""} style={{ width: "120px", height: "80px", objectFit: "cover", border: "1px solid var(--rule)" }} />
                <button type="button" className="admin-button admin-button--danger" onClick={() => setForm((c) => c ? { ...c, fieldNote1Src: "" } : c)}>Retirer</button>
              </div>
            ) : null}
            <div className="admin-form__actions" style={{ marginBottom: "0.75rem" }}>
              <label className="admin-button admin-button--ghost">
                {uploadingFieldNote[1] ? "Envoi…" : "Téléverser une image"}
                <input type="file" accept="image/*" hidden onChange={(e) => uploadFieldNote(e, 1)} disabled={uploadingFieldNote[1]} />
              </label>
            </div>
            <div className="admin-form__grid">
              <label className="admin-field admin-field--full"><span className="admin-field__label">Image (URL)</span><input className="admin-input" value={form.fieldNote1Src ?? ""} onChange={(e) => update("fieldNote1Src", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Alt</span><input className="admin-input" value={form.fieldNote1Alt ?? ""} onChange={(e) => update("fieldNote1Alt", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Index</span><input className="admin-input" value={form.fieldNote1Index ?? ""} onChange={(e) => update("fieldNote1Index", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Meta</span><input className="admin-input" value={form.fieldNote1Meta ?? ""} onChange={(e) => update("fieldNote1Meta", e.target.value)} /></label>
              <label className="admin-field admin-field--full"><span className="admin-field__label">Légende</span><input className="admin-input" value={form.fieldNote1Caption ?? ""} onChange={(e) => update("fieldNote1Caption", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Classe</span><input className="admin-input" value={form.fieldNote1Class ?? ""} onChange={(e) => update("fieldNote1Class", e.target.value)} placeholder="wide/medium/small" /></label>
            </div>
            <h4 style={{ marginTop: "1rem" }}>Photo 2</h4>
            {form.fieldNote2Src ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.fieldNote2Src} alt={form.fieldNote2Alt || ""} style={{ width: "120px", height: "80px", objectFit: "cover", border: "1px solid var(--rule)" }} />
                <button type="button" className="admin-button admin-button--danger" onClick={() => setForm((c) => c ? { ...c, fieldNote2Src: "" } : c)}>Retirer</button>
              </div>
            ) : null}
            <div className="admin-form__actions" style={{ marginBottom: "0.75rem" }}>
              <label className="admin-button admin-button--ghost">
                {uploadingFieldNote[2] ? "Envoi…" : "Téléverser une image"}
                <input type="file" accept="image/*" hidden onChange={(e) => uploadFieldNote(e, 2)} disabled={uploadingFieldNote[2]} />
              </label>
            </div>
            <div className="admin-form__grid">
              <label className="admin-field admin-field--full"><span className="admin-field__label">Image (URL)</span><input className="admin-input" value={form.fieldNote2Src ?? ""} onChange={(e) => update("fieldNote2Src", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Alt</span><input className="admin-input" value={form.fieldNote2Alt ?? ""} onChange={(e) => update("fieldNote2Alt", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Index</span><input className="admin-input" value={form.fieldNote2Index ?? ""} onChange={(e) => update("fieldNote2Index", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Meta</span><input className="admin-input" value={form.fieldNote2Meta ?? ""} onChange={(e) => update("fieldNote2Meta", e.target.value)} /></label>
              <label className="admin-field admin-field--full"><span className="admin-field__label">Légende</span><input className="admin-input" value={form.fieldNote2Caption ?? ""} onChange={(e) => update("fieldNote2Caption", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Classe</span><input className="admin-input" value={form.fieldNote2Class ?? ""} onChange={(e) => update("fieldNote2Class", e.target.value)} placeholder="wide/medium/small" /></label>
            </div>
            <h4 style={{ marginTop: "1rem" }}>Photo 3</h4>
            {form.fieldNote3Src ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.fieldNote3Src} alt={form.fieldNote3Alt || ""} style={{ width: "120px", height: "80px", objectFit: "cover", border: "1px solid var(--rule)" }} />
                <button type="button" className="admin-button admin-button--danger" onClick={() => setForm((c) => c ? { ...c, fieldNote3Src: "" } : c)}>Retirer</button>
              </div>
            ) : null}
            <div className="admin-form__actions" style={{ marginBottom: "0.75rem" }}>
              <label className="admin-button admin-button--ghost">
                {uploadingFieldNote[3] ? "Envoi…" : "Téléverser une image"}
                <input type="file" accept="image/*" hidden onChange={(e) => uploadFieldNote(e, 3)} disabled={uploadingFieldNote[3]} />
              </label>
            </div>
            <div className="admin-form__grid">
              <label className="admin-field admin-field--full"><span className="admin-field__label">Image (URL)</span><input className="admin-input" value={form.fieldNote3Src ?? ""} onChange={(e) => update("fieldNote3Src", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Alt</span><input className="admin-input" value={form.fieldNote3Alt ?? ""} onChange={(e) => update("fieldNote3Alt", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Index</span><input className="admin-input" value={form.fieldNote3Index ?? ""} onChange={(e) => update("fieldNote3Index", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Meta</span><input className="admin-input" value={form.fieldNote3Meta ?? ""} onChange={(e) => update("fieldNote3Meta", e.target.value)} /></label>
              <label className="admin-field admin-field--full"><span className="admin-field__label">Légende</span><input className="admin-input" value={form.fieldNote3Caption ?? ""} onChange={(e) => update("fieldNote3Caption", e.target.value)} /></label>
              <label className="admin-field"><span className="admin-field__label">Classe</span><input className="admin-input" value={form.fieldNote3Class ?? ""} onChange={(e) => update("fieldNote3Class", e.target.value)} placeholder="wide/medium/small" /></label>
            </div>
          </div>
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
