"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export type InspectableTarget = {
  title: string;
  code: string;
  caption?: string;
  scale?: string;
  category?: string;
  kind: "drawing" | "image";
  drawingKind?: "plan" | "elevation" | "section" | "hero";
  imageUrl?: string;
  notes?: {
    label: string;
    value: string;
  }[];
};

type PlanInspectorProps = {
  target: InspectableTarget | null;
  onClose: () => void;
  renderDrawing?: (kind: string) => React.ReactNode;
};

export function PlanInspectorModal({
  target,
  onClose,
  renderDrawing,
}: PlanInspectorProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(z + 0.25, 3.5));
      } else if (e.key === "-") {
        setZoom((z) => Math.max(z - 0.25, 0.5));
      } else if (e.key === "0") {
        resetView();
      }
    };

    if (target) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [target, onClose, resetView]);

  if (!target) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((z) => Math.min(Math.max(z + delta, 0.5), 3.5));
  };

  return (
    <div
      className="inspector-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-title"
    >
      {/* Top drafting toolbar */}
      <header className="inspector-toolbar">
        <div className="inspector-toolbar__left">
          <span className="inspector-badge">{target.code}</span>
          <h2 id="inspector-title" className="inspector-title">
            {target.title}
          </h2>
          <span className="inspector-scale">
            {target.scale ?? "Échelle 1:50"}
          </span>
        </div>

        <div className="inspector-toolbar__center">
          <div className="inspector-controls" role="group" aria-label="Contrôles de zoom">
            <button
              type="button"
              className="inspector-btn"
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
              title="Zoom arrière (-)"
              aria-label="Zoom arrière"
            >
              −
            </button>
            <button
              type="button"
              className="inspector-btn inspector-btn--value"
              onClick={resetView}
              title="Réinitialiser (0)"
              aria-label="Réinitialiser le zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="inspector-btn"
              onClick={() => setZoom((z) => Math.min(z + 0.25, 3.5))}
              title="Zoom avant (+)"
              aria-label="Zoom avant"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className={`inspector-btn inspector-btn--toggle ${showGrid ? "is-active" : ""}`}
            onClick={() => setShowGrid(!showGrid)}
            title="Activer/Désactiver la trame millimétrée"
            aria-pressed={showGrid}
          >
            Trame #
          </button>

          <button
            type="button"
            className={`inspector-btn inspector-btn--toggle ${showDetails ? "is-active" : ""}`}
            onClick={() => setShowDetails(!showDetails)}
            title="Afficher/Masquer le cartouche technique"
            aria-pressed={showDetails}
          >
            Cartouche ▤
          </button>
        </div>

        <div className="inspector-toolbar__right">
          <button
            type="button"
            className="inspector-btn inspector-btn--close"
            onClick={onClose}
            title="Fermer la vue (Échap)"
            aria-label="Fermer la vue"
          >
            ✕ Fermer
          </button>
        </div>
      </header>

      {/* Main drafting canvas */}
      <div
        ref={containerRef}
        className={`inspector-canvas ${isDragging ? "is-dragging" : ""} ${showGrid ? "has-grid" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="inspector-viewport"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          <div className="inspector-paper">
            {/* Top plate title bar */}
            <div className="inspector-paper__header">
              <span>RÉPUBLIQUE DU BÉNIN · INSTI LOKOSSA · DÉPARTEMENT GÉNIE CIVIL</span>
              <span>PLANCHE D’EXÉCUTION N° {target.code}</span>
            </div>

            {/* Content area */}
            <div className="inspector-paper__content">
              {target.kind === "image" && target.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={target.imageUrl}
                  alt={target.caption ?? target.title}
                  className="inspector-image"
                  draggable={false}
                />
              ) : renderDrawing && target.drawingKind ? (
                <div className="inspector-vector">
                  {renderDrawing(target.drawingKind)}
                </div>
              ) : null}
            </div>

            {/* Planche footer info */}
            <div className="inspector-paper__footer">
              <div>
                <strong>LÉGENDE :</strong> {target.caption ?? "Dessin conforme aux règles BAEL 91 révisé 99."}
              </div>
              <div>
                <strong>AUTEUR :</strong> AZANNAÏ Luc Emmaüs Sèdjro · <strong>VÉRIFIÉ POUR EXÉCUTION</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side engineering notes drawer */}
      {showDetails && (
        <aside className="inspector-drawer" aria-label="Cartouche technique">
          <div className="inspector-drawer__header">
            <h3>Bordereau Technique</h3>
            <span className="inspector-drawer__tag">ISO 7200</span>
          </div>

          <dl className="inspector-drawer__meta">
            <div>
              <dt>Projet</dt>
              <dd>{target.title}</dd>
            </div>
            <div>
              <dt>Repère planche</dt>
              <dd className="inspector-mono">{target.code}</dd>
            </div>
            <div>
              <dt>Échelle nominale</dt>
              <dd className="inspector-mono">{target.scale ?? "1:50 & 1:100"}</dd>
            </div>
            <div>
              <dt>Discipline</dt>
              <dd>{target.category ?? "Génie Civil & Architecture"}</dd>
            </div>
            <div>
              <dt>Norme de référence</dt>
              <dd>BAEL 91 révisé 99 / DTU Bâtiment</dd>
            </div>
            <div>
              <dt>Matériaux spécifiés</dt>
              <dd>Béton armé C25/30 · Aciers FeE500 HA</dd>
            </div>
            <div>
              <dt>Établissement</dt>
              <dd>INSTI Lokossa — Génie Civil</dd>
            </div>
          </dl>

          {target.caption && (
            <div className="inspector-drawer__note">
              <h4>Note d’intention</h4>
              <p>{target.caption}</p>
            </div>
          )}

          <div className="inspector-drawer__footer">
            <span className="inspector-stamp">CONFORME AUX PLANS D’EXÉCUTION</span>
          </div>
        </aside>
      )}

      {/* Bottom coordinate tracker bar */}
      <footer className="inspector-statusbar">
        <span>X: {Math.round(pan.x)} mm · Y: {Math.round(pan.y)} mm</span>
        <span className="inspector-statusbar__hint">Glisser pour déplacer · Molette pour zoomer · [Échap] pour quitter</span>
        <span>FORMAT : A3 PAYSAGE (420×297)</span>
      </footer>
    </div>
  );
}
