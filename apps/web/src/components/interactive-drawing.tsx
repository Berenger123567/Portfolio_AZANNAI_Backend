"use client";

import { useState } from "react";
import type { ProjectMedia } from "@/lib/types";
import {
  HeroStructure,
  PlanDrawing,
  ElevationDrawing,
  SectionDrawing,
  ProjectDrawing,
} from "./drawings";
import { PlanInspectorModal, type InspectableTarget } from "./plan-inspector";

export function InteractiveHeroDrawing({ className = "" }: { className?: string }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [inspectTarget, setInspectTarget] = useState<InspectableTarget | null>(null);

  const replayDraw = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 30);
  };

  const openInspector = () => {
    setInspectTarget({
      title: "Ossature en béton armé — Poteaux, poutres et plancher",
      code: "PL-00.AXO",
      scale: "Éch. 1:50",
      category: "Étude Structurelle Béton Armé",
      caption: "Modélisation filaire d'une maille structurelle avec cotation altimétrique (+3,20 m) et repères d'axes A-B selon le BAEL 91.",
      kind: "drawing",
      drawingKind: "hero",
    });
  };

  return (
    <>
      <figure
        className={`drawing drawing--hero ${isAnimating ? "dwg-animating" : ""} ${className}`}
        onClick={openInspector}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openInspector();
        }}
        aria-label="Cliquer pour inspecter l'ossature en grand format"
        title="Cliquer pour inspecter en plein écran avec zoom et cartouche"
      >
        <div className="drawing__bar">
          <div className="drawing__bar-title">
            <span className="drawing__dot" />
            <span>Ossature BA — poteaux, poutres, plancher</span>
          </div>
          <div className="drawing__bar-actions">
            <button
              type="button"
              className="drawing__plot-btn"
              onClick={replayDraw}
              title="Rejouer le tracé vectoriel"
              aria-label="Rejouer le tracé"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              <span>Tracé</span>
            </button>
            <span className="drawing__inspect-badge">Inspecter ⤢</span>
          </div>
        </div>

        <div className="drawing__canvas drawing__canvas--hero">
          <HeroStructure />
        </div>

        <figcaption className="drawing__caption">
          <span>Éch. 1:50</span>
          <span>INSTI Lokossa · Département Génie Civil</span>
        </figcaption>
      </figure>

      <PlanInspectorModal
        key={inspectTarget?.code ?? "closed"}
        target={inspectTarget}
        onClose={() => setInspectTarget(null)}
        renderDrawing={(kind) => {
          if (kind === "hero") return <HeroStructure decorative={false} />;
          return <PlanDrawing decorative={false} />;
        }}
      />
    </>
  );
}

export function InteractiveMediaFrame({
  media,
  drawingTitle,
  meta,
  className = "",
}: {
  media: ProjectMedia;
  drawingTitle?: string;
  meta?: string;
  className?: string;
}) {
  const [inspectTarget, setInspectTarget] = useState<InspectableTarget | null>(null);

  const openInspector = () => {
    if (media.kind === "drawing" && media.drawingKind) {
      setInspectTarget({
        title: drawingTitle ?? media.code,
        code: media.code,
        caption: media.caption,
        scale: meta ?? "Éch. 1:100",
        kind: "drawing",
        drawingKind: media.drawingKind,
      });
    } else if (media.kind === "image" && media.url) {
      setInspectTarget({
        title: drawingTitle ?? media.code,
        code: media.code,
        caption: media.caption,
        scale: "Vue d'ensemble",
        kind: "image",
        imageUrl: media.url,
      });
    }
  };

  if (media.kind === "drawing" && media.drawingKind) {
    return (
      <>
        <figure
          className={`drawing drawing--interactive ${className}`}
          onClick={openInspector}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openInspector();
          }}
          aria-label={`Inspecter la planche ${media.code}`}
          title="Cliquer pour inspecter en plein écran avec zoom et cartouche"
        >
          <div className="drawing__bar">
            <span>{drawingTitle ?? media.code}</span>
            <div className="drawing__bar-right">
              <span>{meta ?? "Éch. 1:100"}</span>
              <span className="drawing__inspect-tag">⤢ Inspecter</span>
            </div>
          </div>
          <div className="drawing__canvas">
            <ProjectDrawing kind={media.drawingKind} decorative />
          </div>
          <figcaption className="drawing__caption">
            <span>{media.code}</span>
            <span>{media.caption}</span>
          </figcaption>
        </figure>

        <PlanInspectorModal
          key={inspectTarget?.code ?? "closed"}
          target={inspectTarget}
          onClose={() => setInspectTarget(null)}
          renderDrawing={(kind) => {
            if (kind === "plan") return <PlanDrawing decorative={false} />;
            if (kind === "elevation") return <ElevationDrawing decorative={false} />;
            return <SectionDrawing decorative={false} />;
          }}
        />
      </>
    );
  }

  if (media.kind === "image" && media.url) {
    return (
      <>
        <figure
          className={`drawing drawing--interactive ${className}`}
          onClick={openInspector}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openInspector();
          }}
          aria-label={`Inspecter le document ${media.code}`}
          title="Cliquer pour agrandir le visuel"
        >
          <div className="drawing__bar">
            <span>{drawingTitle ?? media.code}</span>
            <div className="drawing__bar-right">
              <span>{meta ?? "Rendu & Réalisation"}</span>
              <span className="drawing__inspect-tag">⤢ Agrandir</span>
            </div>
          </div>
          <div className="drawing__canvas drawing__canvas--media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.url}
              alt={media.caption}
              className="drawing__image"
              loading="lazy"
            />
          </div>
          <figcaption className="drawing__caption">
            <span>{media.code}</span>
            <span>{media.caption}</span>
          </figcaption>
        </figure>

        <PlanInspectorModal
          key={inspectTarget?.code ?? "closed"}
          target={inspectTarget}
          onClose={() => setInspectTarget(null)}
        />
      </>
    );
  }

  if (media.kind === "model" && media.url) {
    return (
      <figure className={`drawing drawing--interactive ${className}`}>
        <div className="drawing__bar">
          <span>{drawingTitle ?? media.code}</span>
          <div className="drawing__bar-right">
            <span>{meta ?? "Modèle 3D"}</span>
            <a
              className="drawing__inspect-tag"
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir / Télécharger
            </a>
          </div>
        </div>
        <div className="drawing__canvas drawing__canvas--media">
          <model-viewer
            src={media.url}
            alt={media.caption}
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        </div>
        <figcaption className="drawing__caption">
          <span>{media.code}</span>
          <span>{media.caption}</span>
        </figcaption>
      </figure>
    );
  }

  if (media.kind === "pdf" && media.url) {
    return (
      <figure className={`drawing drawing--interactive ${className}`}>
        <div className="drawing__bar">
          <span>{drawingTitle ?? media.code}</span>
          <div className="drawing__bar-right">
            <span>{meta ?? "Document"}</span>
            <a
              className="drawing__inspect-tag"
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              Télécharger le PDF
            </a>
          </div>
        </div>
        <div className="drawing__canvas drawing__canvas--media">
          <object
            data={media.url}
            type="application/pdf"
            style={{ width: "100%", height: "100%" }}
          >
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p>Impossible d'afficher le PDF dans ce navigateur.</p>
              <a href={media.url} target="_blank" rel="noopener noreferrer">
                Télécharger {media.code}
              </a>
            </div>
          </object>
        </div>
        <figcaption className="drawing__caption">
          <span>{media.code}</span>
          <span>{media.caption}</span>
        </figcaption>
      </figure>
    );
  }

  return null;
}
