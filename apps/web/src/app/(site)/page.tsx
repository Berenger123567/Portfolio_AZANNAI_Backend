import Link from "next/link";
import { MediaPreview } from "@/components/drawings";
import { InteractiveHeroDrawing } from "@/components/interactive-drawing";
import { FullCvButton } from "@/components/header-cv-button";
import { getSiteData } from "@/lib/api";

export const dynamic = "force-dynamic";

const shortVision =
  "Concevoir des projets innovants, durables et fonctionnels, au service du cadre de vie.";

const defaultFieldNotes = [
  {
    src: "/media/chantier-hotel-cube.jpg",
    alt: "Suivi de chantier d’un complexe hôtelier cinq étoiles — C.U.B.E.",
    index: "FIG. 01",
    meta: "C.U.B.E. · 2025",
    caption:
      "Hôtel 5★ — suivi d’exécution des dalles en béton armé et des balcons cintrés.",
    className: "wide",
  },
  {
    src: "/media/bloc-pedagogique-chantier.jpg",
    alt: "Contrôle du ferraillage et du coffrage — bloc pédagogique INSTI Lokossa.",
    index: "FIG. 02",
    meta: "INSTI · 2026",
    caption:
      "Bloc pédagogique — lecture du ferraillage HA, étaiement et contrôle des coffrages.",
    className: "medium",
  },
  {
    src: "/media/maison-rdc-render-3d.jpg",
    alt: "Rendu 3D d’une villa tropicale de plain-pied avec brise-soleil en bois.",
    index: "FIG. 03",
    meta: "Projet académique",
    caption:
      "Maison habitable en RDC — rendu 3D ArchiCAD, matières et rapport au jardin.",
    className: "small",
  },
];

export default async function HomePage() {
  const { profile, education, experiences, training, skills, projects } =
    await getSiteData();

  const phoneHref = profile.phone.replace(/[^\d+]/g, "");
  const projectCount = projects.length.toString().padStart(2, "0");
  const experienceCount = experiences.length.toString().padStart(2, "0");

  const fieldNotes = [
    {
      src: (profile as any).fieldNote1Src || defaultFieldNotes[0].src,
      alt: (profile as any).fieldNote1Alt || defaultFieldNotes[0].alt,
      index: (profile as any).fieldNote1Index || defaultFieldNotes[0].index,
      meta: (profile as any).fieldNote1Meta || defaultFieldNotes[0].meta,
      caption: (profile as any).fieldNote1Caption || defaultFieldNotes[0].caption,
      className: (profile as any).fieldNote1Class || defaultFieldNotes[0].className,
    },
    {
      src: (profile as any).fieldNote2Src || defaultFieldNotes[1].src,
      alt: (profile as any).fieldNote2Alt || defaultFieldNotes[1].alt,
      index: (profile as any).fieldNote2Index || defaultFieldNotes[1].index,
      meta: (profile as any).fieldNote2Meta || defaultFieldNotes[1].meta,
      caption: (profile as any).fieldNote2Caption || defaultFieldNotes[1].caption,
      className: (profile as any).fieldNote2Class || defaultFieldNotes[1].className,
    },
    {
      src: (profile as any).fieldNote3Src || defaultFieldNotes[2].src,
      alt: (profile as any).fieldNote3Alt || defaultFieldNotes[2].alt,
      index: (profile as any).fieldNote3Index || defaultFieldNotes[2].index,
      meta: (profile as any).fieldNote3Meta || defaultFieldNotes[2].meta,
      caption: (profile as any).fieldNote3Caption || defaultFieldNotes[2].caption,
      className: (profile as any).fieldNote3Class || defaultFieldNotes[2].className,
    },
  ];

  return (
    <>
      <section className="hero hero--dossier">
        <div className="shell hero__stage">
          <aside className="rail hero__rail" aria-label="Repères du profil">
            <p className="rail__label">Fiche profil / 00</p>
            <dl className="rail__meta">
              <div>
                <dt>Localisation</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Formation</dt>
                <dd>{profile.school}</dd>
              </div>
              <div>
                <dt>Diplôme</dt>
                <dd>{profile.degree}</dd>
              </div>
              <div>
                <dt>Recherche</dt>
                <dd>{profile.objective}</dd>
              </div>
            </dl>
          </aside>

          <div className="hero__statement">
            <div className="hero__heading">
              <p className="hero__context">{profile.role}</p>
            <h1 className="hero__name">
              <span className="hero__name-last">{profile.lastName}</span>
              <span className="hero__name-first">{profile.firstName}</span>
            </h1>
            </div>

            <div className="hero__lead-row">
              <p className="hero__lead">{profile.statement}</p>
              <div className="hero__actions">
                <a className="button" href="#projets">
                  Ouvrir les planches <span aria-hidden="true">↘</span>
                </a>
                <a className="button button--ghost" href="#contact">
                  Prendre contact
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="shell hero__fold">
          <aside className="hero__fold-aside">
            <p className="hero__fold-index">{(profile as any).heroIndex || "PL-00 / Axonométrie"}</p>
            <p className="hero__fold-copy">
              {(profile as any).heroCopy || "La structure comme point de départ : une trame, des portées, des appuis. Le reste vient s’y accrocher."}
            </p>
            <a className="hero__fold-link" href="#profil">
              {(profile as any).heroLinkText || "Lire la note d’intention"} <span aria-hidden="true">↓</span>
            </a>
          </aside>
          <div className="hero__drawing">
            <InteractiveHeroDrawing />
          </div>
        </div>
      </section>

      <section
        className="section section--note"
        id="profil"
        aria-labelledby="profil-titre"
      >
        <div className="shell section__grid">
          <div className="section__head">
            <span className="section__number" aria-hidden="true">
              00
            </span>
            <p className="section__label">Note d’intention</p>
            <h2 className="section__title" id="profil-titre">
              Une pratique entre ingénierie et architecture.
            </h2>
          </div>

          <div className="section__body">
            <div className="note">
              <p className="note__lead">Concevoir, dimensionner, exécuter.</p>
              <div className="note__layout">
                <div className="note__copy">
                  <p>{profile.intro}</p>
                  <p>{profile.method}</p>
                </div>
                <dl className="note__facts">
                  <div>
                    <dt>Formation</dt>
                    <dd>{profile.degree}</dd>
                  </div>
                  <div>
                    <dt>École</dt>
                    <dd>{profile.school}</dd>
                  </div>
                  <div>
                    <dt>Terrain</dt>
                    <dd>
                      {experienceCount} expériences de chantier et de bureau
                      d’études.
                    </dd>
                  </div>
                  <div>
                    <dt>Objectif</dt>
                    <dd>{profile.objective}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="gallery-strip gallery-strip--register"
        aria-labelledby="terrain-titre"
      >
        <div className="shell gallery-strip__head">
          <div>
            <p className="section__label">{(profile as any).registerLabel || "Registre terrain"}</p>
            <h2 className="gallery-strip__title" id="terrain-titre">
              {(profile as any).registerTitle || (profile as any).introLine2 || "Le chantier comme seconde école."}
            </h2>
          </div>
          <p className="gallery-strip__note">
            {(profile as any).registerNote || (profile as any).introLine1 || "Trois arrêts, trois échelles : l'ouvrage en cours, la structure qui se prépare, le projet qui prend forme."}
          </p>
        </div>

        <div className="shell gallery-strip__track">
          {fieldNotes.map((note) => (
            <figure
              className={`gallery-strip__item gallery-strip__item--${note.className}`}
              key={note.src}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={note.src}
                alt={note.alt}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span className="gallery-strip__index">{note.index}</span>
                <span className="gallery-strip__meta">{note.meta}</span>
                <span className="gallery-strip__caption">{note.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        className="section section--projects"
        id="projets"
        aria-labelledby="projets-titre"
      >
        <div className="shell section__grid">
          <div className="section__head">
            <span className="section__number" aria-hidden="true">
              01
            </span>
            <p className="section__label">{(profile as any).projectsLabel || "Projets / planches"}</p>
            <h2 className="section__title" id="projets-titre">
              {(profile as any).projectsTitle || "Dossier de projets"}
            </h2>
            <p className="section__intro">
              {(profile as any).projectsIntro || "Chaque projet est présenté comme une planche : intention, plans, coupes et documents d'exécution."}
            </p>
            <p className="section__count">{projectCount} planches</p>
          </div>

          <div className="section__body">
            <div className="project-register" data-projects>
              {projects.slice(0, 3).map((project, index) => {
                const coverMedia = project.coverMediaId
                  ? project.media.find((item) => item.id === project.coverMediaId)
                  : project.media.find((item) => item.kind === "image") ?? project.media[0] ?? null;
                const cover = coverMedia;
                const isReversed = index % 2 === 1;

                return (
                  <Link
                    key={project.slug}
                    href={`/projets/${project.slug}`}
                    className={`project-row${
                      isReversed ? " project-row--reverse" : ""
                    }`}
                    aria-label={`Ouvrir la planche ${project.plate} : ${project.title}`}
                  >
                    <div className="project-row__visual" aria-hidden="true">
                      <span className="project-row__plate">
                        {project.plate}
                      </span>
                      {cover?.kind === "pdf" ? (
                        <div className="project-row__pdf">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 3h8l4 4v14H6z" />
                            <path d="M14 3v5h5M9 13h6M9 17h4" />
                          </svg>
                          <span>{cover.code}</span>
                        </div>
                      ) : (
                        <MediaPreview media={cover} />
                      )}
                    </div>

                    <div className="project-row__content">
                      <p className="project-row__meta">
                        <span>{project.category}</span>
                        <span>{project.period}</span>
                        <span>{project.media.length} documents</span>
                      </p>
                      <h3 className="project-row__title">{project.title}</h3>
                      <p className="project-row__summary">
                        {project.summary}
                      </p>

                      <dl className="project-row__facts">
                        <div>
                          <dt>Rôle</dt>
                          <dd>{project.role}</dd>
                        </div>
                        <div>
                          <dt>Outils</dt>
                          <dd>{project.tools.join(" · ")}</dd>
                        </div>
                      </dl>

                      <span className="project-row__link">
                        Ouvrir la planche
                        <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            {projects.length > 3 && (
              <div className="project-more">
                <button
                  className="button"
                  type="button"
                  data-projects-toggle
                  data-expanded="false"
                >
                  Voir plus
                </button>
              </div>
            )}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                (function(){
                  var btn = document.querySelector('[data-projects-toggle]');
                  var list = document.querySelector('[data-projects]');
                  if(!btn || !list) return;
                  var items = Array.from(list.querySelectorAll('.project-row'));
                  if(items.length <= 3) { btn.style.display='none'; return; }
                  for(var i=3;i<items.length;i++){ items[i].style.display='none'; }
                  btn.addEventListener('click', function(){
                    var expanded = btn.getAttribute('data-expanded') === 'true';
                    if(expanded){
                      for(var i=3;i<items.length;i++){ items[i].style.display='none'; }
                      btn.setAttribute('data-expanded','false');
                      btn.textContent='Voir plus';
                    }else{
                      for(var i=3;i<items.length;i++){ items[i].style.display='flex'; }
                      btn.setAttribute('data-expanded','true');
                      btn.textContent='Voir moins';
                    }
                  });
                })();
              `,
              }}
            />
          </div>
        </div>
      </section>

      <section
        className="section section--parcours"
        id="parcours"
        aria-labelledby="parcours-titre"
      >
        <div className="shell section__grid">
          <div className="section__head">
            <span className="section__number" aria-hidden="true">
              02
            </span>
            <p className="section__label">Parcours</p>
            <h2 className="section__title" id="parcours-titre">
              Diplômes, chantiers, terrain.
            </h2>
            <p className="section__intro">
              Un parcours technique construit par étapes : formation
              professionnelle, licence en génie civil, puis expériences de
              chantier et de bureau d’études.
            </p>
            <p className="section__count">2022 — 2026</p>
          </div>

          <div className="section__body">
            <div className="parcours">
              <div className="parcours__column">
                <div className="parcours__head">
                  <h3>Formation</h3>
                  <span>2022 — 2026</span>
                </div>
                <div className="timeline">
                  {education.map((item) => (
                    <div className="timeline__item" key={item.id}>
                      <span className="timeline__year">{item.year}</span>
                      <div className="timeline__body">
                        <p className="timeline__title">{item.degree}</p>
                        <p className="timeline__school">{item.school}</p>
                        <p className="timeline__detail">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="parcours__column">
                <div className="parcours__head">
                  <h3>Expériences</h3>
                  <span>2024 — 2026</span>
                </div>
                <div className="log">
                  {experiences.map((item) => (
                    <article className="log__item" key={item.id}>
                      <div className="log__head">
                        <h4 className="log__company">{item.company}</h4>
                        <span className="log__period">{item.period}</span>
                      </div>
                      <p className="log__focus">{item.focus}</p>
                      <ul className="log__missions">
                        {item.missions.map((mission) => (
                          <li key={mission}>{mission}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>

                {training.map((item) => (
                  <div className="training" key={item.id}>
                    <p className="training__title">{item.title}</p>
                    <p className="training__meta">
                      Formation complémentaire · {item.provider}
                    </p>
                    <p className="training__detail">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section section--skills"
        id="competences"
        aria-labelledby="competences-titre"
      >
        <div className="shell section__grid">
          <div className="section__head">
            <span className="section__number" aria-hidden="true">
              03
            </span>
            <p className="section__label">Compétences</p>
            <h2 className="section__title" id="competences-titre">
              Ce que je sais mettre en œuvre.
            </h2>
            <p className="section__intro">
              Des compétences liées à la conception, au dimensionnement et à
              l’exécution. Les niveaux sont déclarés simplement, sans
              pourcentage artificiel.
            </p>
          </div>

          <div className="section__body">
            <table className="skills">
              <caption className="sr-only">
                Compétences techniques et niveaux déclarés
              </caption>
              <thead>
                <tr>
                  <th scope="col">Compétence</th>
                  <th scope="col" className="skills__domain">
                    Domaine
                  </th>
                  <th scope="col">Niveau déclaré</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill, index) => (
                  <tr key={skill.id}>
                    <td>
                      <span className="skills__name">
                        <span className="skills__no" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {skill.name}
                      </span>
                    </td>
                    <td className="skills__domain">{skill.category}</td>
                    <td>
                      <span className="level">
                        <span className="level__text">{skill.level}</span>
                        <span className="level__ticks" aria-hidden="true">
                          {Array.from({ length: 5 }, (_, tick) => (
                            <span
                              key={tick}
                              className={`level__tick${
                                tick < skill.ticks ? " level__tick--on" : ""
                              }`}
                            />
                          ))}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="skills__note">
              Niveaux déclarés : notions de base, intermédiaire, très bien.
            </p>
          </div>
        </div>
      </section>

      <section
        className="section section--closing"
        id="contact"
        aria-labelledby="contact-titre"
      >
        <div className="shell section__grid">
          <div className="section__head">
            <span className="section__number" aria-hidden="true">
              04
            </span>
            <p className="section__label">Vision & contact</p>
            <h2 className="section__title" id="contact-titre">
              Une ambition pour le cadre de vie.
            </h2>
          </div>

          <div className="section__body">
            <div className="closing">
              <p className="closing__intro">{shortVision}</p>
              <p className="closing__copy">{profile.vision}</p>

              <div className="closing__bottom">
                <div className="closing__contact">
                  <p className="closing__label">Écrire / appeler</p>
                  <a
                    className="closing__mail"
                    href={`mailto:${profile.email}`}
                  >
                    {profile.email}
                  </a>
                  <a className="closing__phone" href={`tel:${phoneHref}`}>
                    {profile.phone}
                  </a>

                  <div className="closing__actions">
                    <Link className="button" href="/contact">
                      Écrire un message
                    </Link>
                    <FullCvButton
                      profile={profile}
                      education={education}
                      experiences={experiences}
                      skills={skills}
                      className="btn--outline"
                    >
                      Consulter le CV
                    </FullCvButton>
                  </div>
                </div>

                <dl className="closing__meta">
                  <div>
                    <dt>Recherche</dt>
                    <dd>{profile.objective}</dd>
                  </div>
                  <div>
                    <dt>Basé à</dt>
                    <dd>{profile.location}</dd>
                  </div>
                  <div>
                    <dt>École</dt>
                    <dd>{profile.school}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
