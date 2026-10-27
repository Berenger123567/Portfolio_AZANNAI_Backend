"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Profile, Education, Experience, Skill } from "@/lib/types";

type CvModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
};

export function CvModal({
  isOpen,
  onClose,
  profile,
  education,
  experiences,
  skills,
}: CvModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.classList.add("cv-open");
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("cv-open");
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="cv-overlay"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-sheet-title"
    >
      <div className="cv-modal-bar">
        <div className="cv-modal-bar__left">
          <span className="cv-tag">BORDEREAU OFFICIEL · PL-CV</span>
          <span className="cv-format">FORMAT A4 NORMALISÉ</span>
        </div>
        <div className="cv-modal-bar__actions">
          <button
            type="button"
            className="cv-action-btn cv-action-btn--print"
            onClick={() => window.print()}
            title="Imprimer ou enregistrer en PDF"
          >
            Imprimer / PDF
          </button>
          <a
            href={`mailto:${profile.email}?subject=Entretien%20ou%20candidature%20—%20${encodeURIComponent(profile.fullName)}`}
            className="cv-action-btn"
          >
            Écrire à {profile.firstName}
          </a>
          <button
            ref={closeButtonRef}
            type="button"
            className="cv-action-btn cv-action-btn--close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕ Fermer
          </button>
        </div>
      </div>

      <div className="cv-scroll-area">
        <article className="cv-sheet" id="printable-cv">
          <header className="cv-sheet__header">
            <div className="cv-sheet__identity">
              <span className="cv-sheet__sub">
                RÉPUBLIQUE DU BÉNIN · {profile.school}
              </span>
              <h1 id="cv-sheet-title" className="cv-sheet__name">
                {profile.lastName} {profile.firstName}
              </h1>
              <p className="cv-sheet__role">{profile.role}</p>
              <p className="cv-sheet__goal">
                <strong>Objectif :</strong> {profile.objective}
              </p>
            </div>

            <dl className="cv-sheet__cartouche">
              <div>
                <dt>Localisation</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Téléphone</dt>
                <dd>{profile.phone}</dd>
              </div>
              <div>
                <dt>Statut</dt>
                <dd>{profile.degree}</dd>
              </div>
            </dl>
          </header>

          <div className="cv-sheet__rule" />

          <section className="cv-sheet__section">
            <h2 className="cv-sheet__heading">Démarche Professionnelle</h2>
            <p className="cv-sheet__lead">« {profile.statement} »</p>
            <p className="cv-sheet__text">
              {profile.intro} {profile.method}
            </p>
          </section>

          <section className="cv-sheet__section">
            <h2 className="cv-sheet__heading">Formation & Diplômes Techniques</h2>
            <div className="cv-sheet__grid-list">
              {education.map((edu) => (
                <div key={edu.id} className="cv-sheet__item">
                  <div className="cv-sheet__item-head">
                    <span className="cv-sheet__year">{edu.year}</span>
                    <strong className="cv-sheet__degree">{edu.degree}</strong>
                  </div>
                  <div className="cv-sheet__school">{edu.school}</div>
                  <div className="cv-sheet__detail">{edu.detail}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="cv-sheet__section">
            <h2 className="cv-sheet__heading">
              Expériences de Terrain & Bureau d’Études
            </h2>
            <div className="cv-sheet__grid-list">
              {experiences.map((exp) => (
                <div key={exp.id} className="cv-sheet__item">
                  <div className="cv-sheet__item-head">
                    <span className="cv-sheet__year">{exp.period}</span>
                    <strong className="cv-sheet__company">{exp.company}</strong>
                    <span className="cv-sheet__focus">{exp.focus}</span>
                  </div>
                  <ul className="cv-sheet__missions">
                    {exp.missions.map((mission, index) => (
                      <li key={index}>{mission}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="cv-sheet__section">
            <h2 className="cv-sheet__heading">Matrice des Compétences Déclarées</h2>
            <div className="cv-sheet__skills">
              {skills.map((skill) => (
                <div key={skill.id} className="cv-sheet__skill-row">
                  <span className="cv-sheet__skill-name">{skill.name}</span>
                  <span className="cv-sheet__skill-cat">{skill.category}</span>
                  <span className="cv-sheet__skill-level">{skill.level}</span>
                  <span className="cv-sheet__skill-ticks" aria-hidden="true">
                    {"■".repeat(skill.ticks)}
                    {"□".repeat(5 - skill.ticks)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <footer className="cv-sheet__footer">
            <div>
              <span>DOCUMENT ÉTABLI POUR DOSSIER DE CANDIDATURE BI-CURSUS</span>
            </div>
            <div className="cv-sheet__stamp">
              VISA & CERTIFICATION TECHNIQUE · {profile.school}
            </div>
          </footer>
        </article>
      </div>
    </div>,
    document.body,
  );
}
