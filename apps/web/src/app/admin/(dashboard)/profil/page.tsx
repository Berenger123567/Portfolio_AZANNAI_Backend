import type { Metadata } from "next";
import { ProfileEditor } from "@/components/admin/profile-editor";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = {
  title: "Profil & CV",
};

export default function ProfilAdminPage() {
  return (
    <>
      <AdminPageHeader
        label="Profil"
        title="Identité, présentation et CV"
        description="Ces informations alimentent l’en-tête, la page d’accueil et la page de contact. Le CV peut être un PDF téléchargeable ou une demande par e-mail."
      />
      <ProfileEditor />
    </>
  );
}
