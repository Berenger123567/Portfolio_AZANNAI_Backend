"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminUser, Profile } from "@/lib/types";
import { AdminMobileMenu } from "./admin-mobile-menu";

const navigation = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/profil", label: "Profil & CV" },
  { href: "/admin/parcours", label: "Parcours" },
  { href: "/admin/competences", label: "Compétences" },
  { href: "/admin/projets", label: "Projets" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        const res = await fetch("/api/public/site", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { profile?: Profile };
        if (!ignore) {
          setAvatarUrl(data.profile?.avatarUrl ?? null);
        }
      } catch {
        // ignore
      }
    }

    loadProfile();
    return () => {
      ignore = true;
    };
  }, []);

  async function logout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          {avatarUrl ? (
            <span
              style={{
                width: "2.2rem",
                height: "2.2rem",
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
                src={avatarUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </span>
          ) : (
            <span className="admin-brand__mark">A</span>
          )}
          <span>
            <strong>AZANNAI</strong>
            <small>Administration</small>
          </span>
        </div>

        <nav className="admin-nav" aria-label="Navigation de l'administration">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav__link${
                  active ? " admin-nav__link--active" : ""
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <Link href="/" target="_blank" rel="noreferrer">
            Voir le site ↗
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="admin-sidebar__logout"
          >
            {loggingOut ? "Déconnexion…" : "Déconnexion"}
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <AdminMobileMenu admin={admin} />
            <div>
              <span className="admin-topbar__label">Connecté</span>{" "}
              <span>{admin.name}</span>
            </div>
          </div>
          <span className="admin-topbar__email">{admin.email}</span>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

