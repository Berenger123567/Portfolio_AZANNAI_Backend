import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/overview";

export const metadata: Metadata = {
  title: "Vue d’ensemble",
};

export default function AdminHomePage() {
  return <AdminOverview />;
}
