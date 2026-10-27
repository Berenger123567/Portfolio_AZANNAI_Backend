import type { Metadata } from "next";
import { AdminMessagesPanel } from "@/components/admin/messages-panel";

export const metadata: Metadata = {
  title: "Messages",
};

export default function MessagesAdminPage() {
  return <AdminMessagesPanel />;
}
