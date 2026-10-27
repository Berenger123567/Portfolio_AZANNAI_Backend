import Link from "next/link";
import type { Education, Experience, Profile, Skill } from "@/lib/types";
import { AvatarLightbox } from "./avatar-lightbox";
import { HeaderCvButton } from "./header-cv-button";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

type SiteHeaderProps = {
  profile: Profile;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
};

const navigation = [
  { index: "01", href: "/#projets", label: "Projets" },
  { index: "02", href: "/#parcours", label: "Parcours" },
  { index: "03", href: "/#competences", label: "Compétences" },
  { index: "04", href: "/contact", label: "Contact" },
];

export function SiteHeader({
  profile,
  education,
  experiences,
  skills,
}: SiteHeaderProps) {
  return (
    <>
      <div className="site-ledger">
        <div className="shell site-ledger__inner">
          <span>Portfolio · Génie civil & construction</span>
          <span>{profile.location}</span>
          <span>Dossier PL-2026</span>
        </div>
      </div>

      <header className="site-header">
        <div className="shell site-header__inner">
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            {(profile as any).avatarUrl ? (
              <AvatarLightbox
                src={(profile as any).avatarUrl}
                alt={profile.fullName}
              />
            ) : (
              <span className="brand__mark" aria-hidden="true">
                AZ
              </span>
            )}
            <Link
              href="/"
              className="brand"
              aria-label={`${profile.fullName} — accueil`}
            >
              <span className="brand__copy">
                <span className="brand__name">{profile.lastName}</span>
                <span className="brand__role">{profile.role}</span>
              </span>
            </Link>
          </div>

          <nav className="site-nav" aria-label="Navigation principale">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="site-nav__link">
                <span className="site-nav__index">{item.index}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <HeaderCvButton
              profile={profile}
              education={education}
              experiences={experiences}
              skills={skills}
            />
            <MobileMenu profile={profile} />
          </div>
        </div>
      </header>
    </>
  );
}
