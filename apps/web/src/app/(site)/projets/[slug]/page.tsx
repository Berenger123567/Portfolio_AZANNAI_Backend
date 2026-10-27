import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DrawingFrame, MediaFrame } from "@/components/drawings";
import { ProjectMediaTabs } from "@/components/project-media-tabs";
import { getProjectData } from "@/lib/api";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectData(slug);

  if (!data) {
    return {};
  }

  return {
    title: data.project.title,
    description: data.project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const data = await getProjectData(slug);

  if (!data) {
    notFound();
  }

  const { project, nextProject } = data;
  const [cover] = project.media;
  const plateNumber = project.plate.replace(/^PL-/, "");

  return (
    <article className="project-page">
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <div className="shell">
          <ol className="breadcrumb__list">
            <li>
              <Link href="/">Accueil</Link>
            </li>
            <li>
              <Link href="/#projets">Planches</Link>
            </li>
            <li aria-current="page">{project.plate}</li>
          </ol>
        </div>
      </nav>

      <header className="project-hero project-hero--sheet">
        <div className="shell project-hero__mast">
          <div className="project-hero__plate" aria-hidden="true">
            <span>Planche</span>
            <strong>{plateNumber}</strong>
            <span>Dossier 2026</span>
          </div>

          <div className="project-hero__heading">
            <p className="project-kicker">
              <span>{project.category}</span>
              <span>{project.period}</span>
            </p>
            <h1 className="project-title">{project.title}</h1>
            <p className="project-summary">{project.summary}</p>
          </div>
        </div>

        <div className="shell project-cartouche">
          <dl>
            <div>
              <dt>Catégorie</dt>
              <dd>{project.category}</dd>
            </div>
            <div>
              <dt>Période</dt>
              <dd>{project.period}</dd>
            </div>
            <div>
              <dt>Rôle</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Outils</dt>
              <dd>{project.tools.join(" · ")}</dd>
            </div>
          </dl>
        </div>

        <div className="shell project-cover">
          <span className="project-cover__tab">
            {project.plate} / Document principal
          </span>
          {cover ? (
            <MediaFrame
              media={cover}
              drawingTitle={project.title}
              meta={project.category}
            />
          ) : (
            <DrawingFrame
              kind="plan"
              code={project.plate}
              drawingTitle={project.title}
              meta={project.category}
              caption={project.summary}
            />
          )}
        </div>
      </header>

      <section
        className="shell project-section"
        aria-labelledby="intention-titre"
      >
        <div className="section__head project-section__head">
          <span className="section__number" aria-hidden="true">
            01
          </span>
          <p className="project-section__label">Intention</p>
          <h2 className="project-section__title" id="intention-titre">
            Ce que le projet met en place.
          </h2>
        </div>

        <div className="project-section__body">
          <div className="project-prose">
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="project-scope">
            <p className="project-scope__label">Périmètre d’intervention</p>
            <ul className="project-list">
              {project.scope.map((item, index) => (
                <li key={item}>
                  <span className="project-list__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {project.media.length > 1 && (
        <section
          className="shell project-section"
          aria-labelledby="explorer-titre"
        >
          <div className="section__head project-section__head">
            <span className="section__number" aria-hidden="true">
              02
            </span>
            <p className="project-section__label">Explorer</p>
            <h2 className="project-section__title" id="explorer-titre">
              Parcourir les pièces du dossier.
            </h2>
          </div>

          <div className="project-section__body">
            <ProjectMediaTabs
              media={project.media}
              projectTitle={project.title}
              projectCategory={project.category}
            />
          </div>
        </section>
      )}

      {nextProject && (
        <div className="shell">
          <Link
            className="next-project next-project--gate"
            href={`/projets/${nextProject.slug}`}
            aria-label={`Planche suivante : ${nextProject.title}`}
          >
            <span className="next-project__plate" aria-hidden="true">
              {nextProject.plate}
            </span>
            <div className="next-project__copy">
              <p className="next-project__label">
                Planche suivante / {nextProject.plate}
              </p>
              <p className="next-project__title">{nextProject.title}</p>
            </div>
            <span className="next-project__action">
              Continuer <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      )}
    </article>
  );
}
