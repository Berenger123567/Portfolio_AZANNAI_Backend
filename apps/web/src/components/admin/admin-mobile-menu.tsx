"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { AdminUser, Profile } from "@/lib/types";

type AdminMobileMenuProps = {
  admin: AdminUser;
};

const links = [
  { index: "01", href: "/admin", label: "Vue d'ensemble" },
  { index: "02", href: "/admin/profil", label: "Profil & CV" },
  { index: "03", href: "/admin/parcours", label: "Parcours" },
  { index: "04", href: "/admin/competences", label: "Compétences" },
  { index: "05", href: "/admin/projets", label: "Projets" },
  { index: "06", href: "/admin/messages", label: "Messages" },
];

export function AdminMobileMenu({ admin }: AdminMobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        const res = await fetch("/api/public/site", { cache: "no-store" });
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

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      document.body.style.overflow = "";
    };

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="menu-trigger"
        onClick={openMenu}
        aria-label="Ouvrir le sommaire"
        aria-haspopup="dialog"
        aria-controls="admin-menu"
      >
        <span className="menu-trigger__lines" aria-hidden="true">
          <span />
          <span />
        </span>
        <span className="menu-trigger__label">Sommaire</span>
      </button>

      <dialog
        id="admin-menu"
        ref={dialogRef}
        className="menu-sheet"
        aria-label="Sommaire de l'administration"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="menu-sheet__inner">
          <header className="menu-sheet__head">
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              {avatarUrl ? (
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
                    src={avatarUrl}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </span>
              ) : (
                <span className="admin-brand__mark">A</span>
              )}
              <div>
                <p className="menu-sheet__kicker">Sommaire — Dossier PL-2026</p>
                <p className="menu-sheet__name">{admin.name}</p>
              </div>
            </div>
            <button
              type="button"
              className="menu-sheet__close"
              onClick={closeMenu}
              aria-label="Fermer le sommaire"
            >
              <span aria-hidden="true">×</span>
              Fermer
            </button>
          </header>

          <nav className="menu-sheet__nav" aria-label="Navigation administration">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="menu-sheet__link"
                onClick={closeMenu}
              >
                <span className="menu-sheet__index">{link.index}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <footer className="menu-sheet__foot">
            <div className="menu-sheet__contact">
              <p className="menu-sheet__label">Administration</p>
              <a href={`mailto:${admin.email}`} onClick={closeMenu}>
                {admin.email}
              </a>
              <Link href="/" target="_blank" rel="noreferrer" onClick={closeMenu}>
                Voir le site →
              </Link>
            </div>

            <div className="menu-sheet__aside">
              <p className="menu-sheet__label">AZANNAÏ</p>
            </div>
          </footer>
        </div>
      </dialog>
    </>
  );
}
