import type { Metadata } from "next";
import { EntityEditor } from "@/components/admin/entity-editor";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = {
  title: "Parcours",
};

export default function ParcoursAdminPage() {
  return (
    <>
      <AdminPageHeader
        label="Parcours"
        title="Formation, expériences et formations complémentaires"
        description="Les éléments sont affichés sur la page d’accueil dans l’ordre défini. Utilisez le champ Ordre pour les déplacer."
      />

      <div className="admin-grid">
        <div className="admin-grid admin-grid--2">
          <EntityEditor
            title="Formation"
            endpoint="/api/admin/education"
            responseKey="education"
            fields={[
              { name: "year", label: "Année", required: true },
              {
                name: "degree",
                label: "Diplôme ou formation",
                type: "textarea",
                rows: 2,
                required: true,
                full: true,
              },
              {
                name: "school",
                label: "Établissement",
                type: "textarea",
                rows: 2,
                required: true,
                full: true,
              },
              {
                name: "detail",
                label: "Détail",
                type: "textarea",
                rows: 3,
                required: true,
                full: true,
              },
              {
                name: "sortOrder",
                label: "Ordre",
                type: "number",
                min: 0,
              },
            ]}
            emptyItem={{
              year: "",
              degree: "",
              school: "",
              detail: "",
              sortOrder: 0,
            }}
            titleField="degree"
            metaField="year"
            detailField="school"
            addLabel="Ajouter une formation"
          />

          <EntityEditor
            title="Formations complémentaires"
            endpoint="/api/admin/training"
            responseKey="training"
            fields={[
              { name: "title", label: "Intitulé", required: true },
              { name: "provider", label: "Organisme", required: true },
              {
                name: "detail",
                label: "Détail",
                type: "textarea",
                rows: 3,
                required: true,
                full: true,
              },
              {
                name: "sortOrder",
                label: "Ordre",
                type: "number",
                min: 0,
              },
            ]}
            emptyItem={{
              title: "",
              provider: "",
              detail: "",
              sortOrder: 0,
            }}
            titleField="title"
            metaField="provider"
            detailField="detail"
            addLabel="Ajouter une formation"
          />
        </div>

        <EntityEditor
          title="Expériences"
          endpoint="/api/admin/experiences"
          responseKey="experiences"
          fields={[
            { name: "company", label: "Entreprise", required: true },
            { name: "period", label: "Période", required: true },
            {
              name: "focus",
              label: "Mission principale",
              required: true,
              full: true,
            },
            {
              name: "missions",
              label: "Missions",
              type: "list",
              rows: 6,
              full: true,
              help: "Une mission par ligne.",
            },
            {
              name: "sortOrder",
              label: "Ordre",
              type: "number",
              min: 0,
            },
          ]}
          emptyItem={{
            company: "",
            period: "",
            focus: "",
            missions: [],
            sortOrder: 0,
          }}
          titleField="company"
          metaField="period"
          detailField="focus"
          addLabel="Ajouter une expérience"
        />
      </div>
    </>
  );
}
