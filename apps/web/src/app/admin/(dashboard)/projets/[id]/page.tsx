import type { Metadata } from "next";
import { ProjectEditor } from "@/components/admin/project-editor";

export const metadata: Metadata = {
  title: "Édition d’un projet",
};

type ProjectAdminPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectAdminPage({
  params,
}: ProjectAdminPageProps) {
  const { id } = await params;

  return <ProjectEditor projectId={id} />;
}
