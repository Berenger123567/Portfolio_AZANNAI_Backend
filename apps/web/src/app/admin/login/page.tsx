import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { getSiteData } from "@/lib/api";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion",
};

export default async function AdminLoginPage() {
  const admin = await getAdmin();

  if (admin) {
    redirect("/admin");
  }

  const { profile } = await getSiteData();

  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <Link className="admin-login__brand" href="/">
          {(profile as any).avatarUrl ? (
            <span
              style={{
                width: "2.4rem",
                height: "2.4rem",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid var(--rule)",
                background: "var(--sheet)",
                flexShrink: 0,
                display: "inline-block",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(profile as any).avatarUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </span>
          ) : (
            <span className="admin-brand__mark">A</span>
          )}
          <span>
            <strong>AZANNAI</strong>
            <small>Génie civil & construction</small>
          </span>
        </Link>

        <h1 className="admin-login__title">Administration</h1>
        <p className="admin-login__intro">
          Cet espace permet de gérer le contenu du portfolio, les projets et
          les messages reçus.
        </p>

        <LoginForm />

        <p className="admin-login__back">
          <Link href="/">← Retour au site</Link>
        </p>
      </div>
    </main>
  );
}
