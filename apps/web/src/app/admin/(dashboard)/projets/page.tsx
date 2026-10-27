import type { Metadata } from "next";
import { AdminProjectsList } from "@/components/admin/projects-list";

export const metadata: Metadata = {
  title: "Projets",
};

export default function ProjectsAdminPage() {
  return <AdminProjectsList />;
}
