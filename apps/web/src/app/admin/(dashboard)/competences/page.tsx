import type { Metadata } from "next";
import { EntityEditor } from "@/components/admin/entity-editor";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = {
  title: "Compétences",
};

export default function CompetencesAdminPage() {
  return (
    <>
      <AdminPageHeader
        label="Compétences"
        title="Compétences techniques"
        description="Le niveau est affiché avec un libellé et un nombre de repères de 1 à 5. Le domaine sert au regroupement visuel dans le tableau."
      />

      <EntityEditor
        title="Liste des compétences"
        endpoint="/api/admin/skills"
        responseKey="skills"
        fields={[
          { name: "name", label: "Compétence", required: true },
          {
            name: "category",
            label: "Domaine",
            type: "select",
            options: ["Conception", "Structure", "Exécution"],
            required: true,
          },
          {
            name: "level",
            label: "Niveau déclaré",
            type: "select",
            options: ["Notions de base", "Intermédiaire", "Très bien"],
            required: true,
          },
          {
            name: "ticks",
            label: "Repères (1 à 5)",
            type: "number",
            min: 1,
            max: 5,
            required: true,
          },
          {
            name: "sortOrder",
            label: "Ordre",
            type: "number",
            min: 0,
          },
        ]}
        emptyItem={{
          name: "",
          category: "Conception",
          level: "Intermédiaire",
          ticks: 3,
          sortOrder: 0,
        }}
        titleField="name"
        metaFields={["category", "level"]}
        addLabel="Ajouter une compétence"
      />
    </>
  );
}
