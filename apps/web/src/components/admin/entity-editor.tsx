"use client";

import { useState } from "react";
import { adminRequest } from "@/lib/admin-client";
import { useAdminResource } from "@/lib/use-admin-resource";
import { AdminNotice } from "./page-header";

type FieldType = "text" | "textarea" | "list" | "number" | "select";

export type EntityField = {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: string[];
  min?: number;
  max?: number;
  full?: boolean;
  help?: string;
};

type EntityItem = Record<string, unknown> & { id?: string };

type EntityEditorProps = {
  title: string;
  description?: string;
  endpoint: string;
  responseKey: string;
  fields: EntityField[];
  emptyItem: Record<string, unknown>;
  titleField: string;
  metaField?: string;
  metaFields?: string[];
  detailField?: string;
  addLabel?: string;
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

function toFormValues(
  item: EntityItem,
  fields: EntityField[],
): Record<string, string> {
  const values: Record<string, string> = {};

  for (const field of fields) {
    const raw = item[field.name];
    if (field.type === "list" && Array.isArray(raw)) {
      values[field.name] = raw.join("\n");
    } else if (raw === null || raw === undefined) {
      values[field.name] = "";
    } else {
      values[field.name] = String(raw);
    }
  }

  return values;
}

export function EntityEditor({
  title,
  description,
  endpoint,
  responseKey,
  fields,
  emptyItem,
  titleField,
  metaField,
  metaFields,
  detailField,
  addLabel = "Ajouter",
}: EntityEditorProps) {
  const { data, loading, error, setError, reload } =
    useAdminResource<Record<string, unknown>>(endpoint);
  const items: EntityItem[] = Array.isArray(data?.[responseKey])
    ? (data[responseKey] as EntityItem[])
    : [];
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<{
    item: EntityItem;
    isNew: boolean;
  } | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function startCreate() {
    const item = { ...emptyItem };
    setEditing({ item, isNew: true });
    setValues(toFormValues(item, fields));
    setNotice("");
    setError("");
  }

  function startEdit(item: EntityItem) {
    setEditing({ item, isNew: false });
    setValues(toFormValues(item, fields));
    setNotice("");
    setError("");
  }

  function cancelEdit() {
    setEditing(null);
    setValues({});
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload: Record<string, unknown> = {};

      for (const field of fields) {
        const raw = values[field.name] ?? "";

        if (field.type === "number") {
          payload[field.name] = raw === "" ? 0 : Number(raw);
        } else if (field.type === "list") {
          payload[field.name] = raw
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        } else {
          payload[field.name] = raw.trim();
        }
      }

      const path = editing.isNew
        ? endpoint
        : `${endpoint}/${editing.item.id}`;

      await adminRequest(path, {
        method: editing.isNew ? "POST" : "PUT",
        body: payload,
      });

      setEditing(null);
      setValues({});
      setNotice(editing.isNew ? "Élément ajouté." : "Élément mis à jour.");
      reload();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: EntityItem) {
    if (!item.id) {
      return;
    }

    const name = String(item[titleField] ?? "cet élément");

    if (!window.confirm(`Supprimer « ${name} » ?`)) {
      return;
    }

    setDeletingId(item.id);
    setError("");
    setNotice("");

    try {
      await adminRequest(`${endpoint}/${item.id}`, { method: "DELETE" });
      setNotice("Élément supprimé.");
      reload();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-entity">
      <div className="admin-entity__head">
        <div>
          <h2 className="admin-entity__title">{title}</h2>
          {description && <p className="admin-hint">{description}</p>}
        </div>
        <button
          className="admin-button admin-button--ghost admin-button--small"
          type="button"
          onClick={startCreate}
        >
          {addLabel}
        </button>
      </div>

      {(error || notice) && (
        <div className="admin-entity__form">
          {error && <AdminNotice type="error">{error}</AdminNotice>}
          {notice && <AdminNotice type="success">{notice}</AdminNotice>}
        </div>
      )}

      {editing && (
        <form className="admin-entity__form admin-form" onSubmit={save}>
          <p className="admin-hint">
            {editing.isNew ? "Nouvel élément" : "Modifier l’élément"}
          </p>

          <div className="admin-form__grid">
            {fields.map((field) => {
              const type = field.type ?? "text";
              const value = values[field.name] ?? "";

              return (
                <label
                  className={`admin-field${
                    field.full ? " admin-field--full" : ""
                  }`}
                  key={field.name}
                >
                  <span className="admin-field__label">{field.label}</span>

                  {type === "textarea" || type === "list" ? (
                    <textarea
                      className={`admin-textarea${
                        type === "list" ? " admin-textarea--tall" : ""
                      }`}
                      value={value}
                      placeholder={field.placeholder}
                      rows={field.rows ?? (type === "list" ? 5 : 4)}
                      required={field.required}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                    />
                  ) : type === "select" ? (
                    <select
                      className="admin-select"
                      value={value}
                      required={field.required}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="admin-input"
                      type={type === "number" ? "number" : "text"}
                      value={value}
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      required={field.required}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                    />
                  )}

                  {field.help && (
                    <span className="admin-hint">{field.help}</span>
                  )}
                </label>
              );
            })}
          </div>

          <div className="admin-form__actions">
            <button className="admin-button" type="submit" disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              className="admin-button admin-button--ghost"
              type="button"
              onClick={cancelEdit}
              disabled={saving}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="admin-entity__empty admin-loading">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="admin-entity__empty admin-empty">
          Aucun élément pour le moment.
        </p>
      ) : (
        <div className="admin-entity__items">
          {items.map((item, index) => {
            const meta = metaFields
              ? metaFields
                  .map((field) => String(item[field] ?? ""))
                  .filter(Boolean)
                  .join(" · ")
              : metaField
                ? String(item[metaField] ?? "")
                : "";
            const detail = detailField
              ? String(item[detailField] ?? "")
              : "";

            return (
              <div
                className="admin-entity__item"
                key={String(item.id ?? index)}
              >
                <div className="admin-entity__row">
                  <div>
                    <p className="admin-entity__name">
                      {String(item[titleField] ?? "Sans titre")}
                    </p>
                    <p className="admin-entity__meta">
                      {meta}
                      {meta ? " · " : ""}Ordre {String(item.sortOrder ?? 0)}
                    </p>
                  </div>
                </div>

                {detail && <p className="admin-entity__detail">{detail}</p>}

                <div className="admin-entity__actions">
                  <button
                    className="admin-button admin-button--ghost admin-button--small"
                    type="button"
                    onClick={() => startEdit(item)}
                  >
                    Modifier
                  </button>
                  <button
                    className="admin-button admin-button--danger admin-button--small"
                    type="button"
                    onClick={() => remove(item)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? "Suppression…" : "Supprimer"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
