import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { getSiteData } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrire à AZANNAÏ Luc Emmaüs Sèdjro pour une demande de stage, d’alternance, de collaboration ou de CV.",
};

export default async function ContactPage() {
  const { profile } = await getSiteData();
  const cvHref =
    profile.cvUrl ??
    `mailto:${profile.email}?subject=Demande%20de%20CV`;

  return (
    <article>
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <div className="shell">
          <ol className="breadcrumb__list">
            <li>
              <Link href="/">Accueil</Link>
            </li>
            <li aria-current="page">Contact</li>
          </ol>
        </div>
      </nav>

      <header className="shell contact-page__head">
        <p className="section__label">Contact</p>
        <h1 className="project-title">Écrire un message.</h1>
        <p className="project-summary">
          Une question, une opportunité de stage ou d’alternance, une demande
          de collaboration ? Le formulaire permet d’envoyer un message
          directement, avec une réponse à l’adresse indiquée.
        </p>
      </header>

      <section className="shell contact-page" aria-label="Coordonnées et formulaire">
        <div>
          <ContactForm />
        </div>

        <aside className="contact-page__aside">
          <div className="contact-page__block">
            <p className="contact__label">Écrire directement</p>
            <div className="contact__links">
              <a
                className="contact__link"
                href={`mailto:${profile.email}`}
                aria-label={`E-mail : ${profile.email}`}
              >
                <span className="contact__label">E-mail</span>
                <span className="contact__value">{profile.email}</span>
              </a>
              <a
                className="contact__link"
                href="tel:+2290146064024"
                aria-label={`Téléphone : ${profile.phone}`}
              >
                <span className="contact__label">Téléphone</span>
                <span className="contact__value">{profile.phone}</span>
              </a>
              <a
                className="contact__link"
                href={cvHref}
                target={profile.cvUrl ? "_blank" : undefined}
                rel={profile.cvUrl ? "noreferrer" : undefined}
                aria-label={
                  profile.cvUrl
                    ? "Ouvrir le CV au format PDF"
                    : "Demander le CV par e-mail"
                }
              >
                <span className="contact__label">CV</span>
                <span className="contact__value">
                  {profile.cvUrl
                    ? "Télécharger le CV"
                    : "Demander le CV par e-mail"}
                </span>
              </a>
            </div>
          </div>

          <div className="contact-page__block">
            <p className="contact__label">Localisation</p>
            <p className="contact__value">{profile.location}</p>
            <p className="contact__label contact__label--spaced">
              Recherche
            </p>
            <p className="contact__value">{profile.objective}</p>
          </div>

          <p className="contact-page__note">
            Les informations envoyées servent uniquement à répondre à votre
            demande. Aucun message n’est publié sur le site.
          </p>
        </aside>
      </section>
    </article>
  );
}
