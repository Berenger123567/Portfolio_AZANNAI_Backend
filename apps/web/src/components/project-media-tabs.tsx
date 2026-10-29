"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { ProjectMedia } from "@/lib/types";
import { InteractiveMediaFrame } from "./interactive-drawing";

type ProjectMediaTabsProps = {
  media: ProjectMedia[];
  projectTitle: string;
  projectCategory: string;
};

type GlyphKind =
  | "plan"
  | "elevation"
  | "section"
  | "render"
  | "site"
  | "pdf"
  | "document"
  | "model";

function MediaGlyph({ kind }: { kind: GlyphKind }) {
  if (kind === "plan") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" />
        <path d="M3 9h18M9 3v18M15 9v12" />
      </svg>
    );
  }

  if (kind === "elevation") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 21h18M5 21V9l7-5 7 5v12" />
        <path d="M9 21v-6h6v6M9 10h2M13 10h2" />
      </svg>
    );
  }

  if (kind === "section") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4v16h16" />
        <path d="M8 4v8h8V4M8 16h8M4 12h4" />
      </svg>
    );
  }

  if (kind === "render") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
      </svg>
    );
  }

  if (kind === "site") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    );
  }

  if (kind === "pdf") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    );
  }

  if (kind === "model") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function describeMedia(item: ProjectMedia): {
  label: string;
  glyph: GlyphKind;
} {
  if (item.kind === "model") {
    return { label: "Modèle 3D", glyph: "model" };
  }

  if (item.kind === "image") {
    const isRender = /r3d|rendu|3d/i.test(`${item.code} ${item.caption}`);
    return isRender
      ? { label: "Rendu 3D", glyph: "render" }
      : { label: "Chantier", glyph: "site" };
  }

  if (item.kind === "pdf") {
    return { label: "Document PDF", glyph: "pdf" };
  }

  if (item.drawingKind === "elevation") {
    return { label: "Façade", glyph: "elevation" };
  }

  if (item.drawingKind === "section") {
    return { label: "Coupe", glyph: "section" };
  }

  if (item.drawingKind === "plan") {
    return { label: "Plan", glyph: "plan" };
  }

  return { label: "Document", glyph: "document" };
}

export function ProjectMediaTabs({
  media,
  projectTitle,
  projectCategory,
}: ProjectMediaTabsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (!media || media.length === 0) {
    return null;
  }

  const activeItem = media[selectedIndex] ?? media[0];
  const activeId = activeItem.id || activeItem.code;

  const selectTab = (index: number) => {
    const nextIndex = (index + media.length) % media.length;
    setSelectedIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectTab(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectTab(media.length - 1);
    }
  };

  return (
    <div className="project-tabs-container">
      <div
        className="project-tabs"
        role="tablist"
        aria-label="Pièces du projet"
      >
        {media.map((item, index) => {
          const { label, glyph } = describeMedia(item);
          const itemId = item.id || item.code;

          return (
            <button
              key={itemId}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              aria-selected={selectedIndex === index}
              aria-controls={`panel-${itemId}`}
              id={`tab-${itemId}`}
              tabIndex={selectedIndex === index ? 0 : -1}
              className={`project-tab-btn${
                selectedIndex === index ? " is-active" : ""
              }`}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span className="project-tab-btn__icon">
                <MediaGlyph kind={glyph} />
              </span>
              <span className="project-tab-btn__code">{item.code}</span>
              <span className="project-tab-btn__type">{label}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${activeId}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeId}`}
        tabIndex={0}
        className="project-tab-content"
      >
        <InteractiveMediaFrame
          media={activeItem}
          drawingTitle={projectTitle}
          meta={projectCategory}
        />
      </div>
    </div>
  );
}
