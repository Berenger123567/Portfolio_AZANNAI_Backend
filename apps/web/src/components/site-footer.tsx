import Link from "next/link";
import type { Education, Experience, Profile, Skill } from "@/lib/types";
import { FullCvButton } from "./header-cv-button";
import { SocialLinks } from "./social-links";

type SiteFooterProps = {
  profile: Profile;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
};

export function SiteFooter({
  profile,
  education,
  experiences,
  skills,
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const phoneHref = profile.phone.replace(/[^\d+]/g, "");
  const hasSocials = Boolean(
    profile.linkedin || profile.github || profile.facebook,
  );

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__identity">
            <p className="site-footer__kicker">Colophon · Dossier PL-2026</p>
            <p className="site-footer__wordmark" aria-hidden="true">
              {profile.lastName}
            </p>
            <p className="site-footer__name">{profile.fullName}</p>
            <p className="site-footer__role">
              {profile.role} · {profile.location}
            </p>
          </div>

          <div className="site-footer__grid">
            <nav className="site-footer__col" aria-label="Sommaire du portfolio">
              <p className="site-footer__heading">Sommaire</p>
              <ul className="site-footer__list">
                <li>
                  <Link href="/#projets">Projets</Link>
                </li>
                <li>
                  <Link href="/#parcours">Parcours</Link>
                </li>
                <li>
                  <Link href="/#competences">Compétences</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </nav>

            <div className="site-footer__col">
              <p className="site-footer__heading">Contact</p>
              <ul className="site-footer__list">
                <li>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </li>
                <li>
                  <a href={`tel:${phoneHref}`}>{profile.phone}</a>
                </li>
                <li>
                  <FullCvButton
                    profile={profile}
                    education={education}
                    experiences={experiences}
                    skills={skills}
                    className="site-footer__cv"
                  >
                    Consulter le CV
                  </FullCvButton>
                </li>
              </ul>
            </div>

            {hasSocials && (
              <div className="site-footer__col">
                <p className="site-footer__heading">Suivre</p>
                <SocialLinks
                  profile={profile}
                  className="site-footer__socials"
                  itemClassName="site-footer__social"
                />
              </div>
            )}
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} · {profile.fullName}
          </p>
          <p>{profile.location} · Génie civil & construction</p>
          <a className="site-footer__top-link" href="#top">
            Retour en haut <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
