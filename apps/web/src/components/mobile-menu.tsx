"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Profile } from "@/lib/types";
import { SocialLinks } from "./social-links";

type MobileMenuProps = {
  profile: Profile;
};

const links = [
  { index: "01", href: "/#projets", label: "Projets" },
  { index: "02", href: "/#parcours", label: "Parcours" },
  { index: "03", href: "/#competences", label: "Compétences" },
  { index: "04", href: "/contact", label: "Contact" },
];

export function MobileMenu({ profile }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cvHref =
    profile.cvUrl ??
    `mailto:${profile.email}?subject=Demande%20de%20CV`;

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
        aria-controls="site-menu"
      >
        <span className="menu-trigger__lines" aria-hidden="true">
          <span />
          <span />
        </span>
        <span className="menu-trigger__label">Sommaire</span>
      </button>

      <dialog
        id="site-menu"
        ref={dialogRef}
        className="menu-sheet"
        aria-label="Sommaire du portfolio"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="menu-sheet__inner">
          <header className="menu-sheet__head">
            <div>
              <p className="menu-sheet__kicker">Sommaire · Dossier PL-2026</p>
              <p className="menu-sheet__name">{profile.fullName}</p>
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

          <nav className="menu-sheet__nav" aria-label="Sommaire">
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
              <p className="menu-sheet__label">Contact direct</p>
              <a href={`mailto:${profile.email}`} onClick={closeMenu}>
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                onClick={closeMenu}
              >
                {profile.phone}
              </a>
              <a
                href={cvHref}
                target={profile.cvUrl ? "_blank" : undefined}
                rel={profile.cvUrl ? "noreferrer" : undefined}
                onClick={closeMenu}
              >
                {profile.cvUrl ? "Télécharger le CV" : "Demander le CV"}
              </a>
            </div>

            <div className="menu-sheet__aside">
              <p className="menu-sheet__label">{profile.location}</p>
              <SocialLinks
                profile={profile}
                className="menu-sheet__socials"
                itemClassName="menu-sheet__social"
              />
            </div>
          </footer>
        </div>
      </dialog>
    </>
  );
}
