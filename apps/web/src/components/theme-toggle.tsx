"use client";

import { useLayoutEffect, useState } from "react";

export type Theme = "vellum" | "blueprint";

export function ThemeToggle({ className = "" }: { className?: string }) {
  useLayoutEffect(() => {
    const stored = localStorage.getItem("azanai_theme");
    if (stored === "blueprint" || stored === "vellum") {
      document.documentElement.dataset.theme = stored;
    }
  }, []);

  const toggleTheme = () => {
    const current =
      document.documentElement.dataset.theme === "blueprint"
        ? "blueprint"
        : "vellum";
    const next: Theme = current === "vellum" ? "blueprint" : "vellum";

    document.documentElement.dataset.theme = next;
    localStorage.setItem("azanai_theme", next);
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label="Changer le papier d’affichage"
      title="Basculer entre Vellum et Cyanotype"
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__paper theme-toggle__paper--vellum" />
        <span className="theme-toggle__paper theme-toggle__paper--blueprint" />
        <span className="theme-toggle__thumb" />
      </span>
      <span className="theme-toggle__text" aria-hidden="true">
        <span className="theme-toggle__label theme-toggle__label--vellum">
          Vellum
        </span>
        <span className="theme-toggle__label theme-toggle__label--blueprint">
          Cyanotype
        </span>
      </span>
    </button>
  );
}

export function CompassNeedle() {
  const [angle, setAngle] = useState(0);

  const rotateNeedle = () => {
    setAngle((prev) => prev + 360);
  };

  return (
    <button
      type="button"
      className="compass-btn"
      onClick={rotateNeedle}
      title="Orientation Nord — Cliquer pour réaligner le compas"
      aria-label="Compas d’orientation Nord"
    >
      <span
        className="compass-btn__icon"
        style={{
          transform: `rotate(${angle}deg)`,
          transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <span className="compass-btn__n">N</span>
        <span className="compass-btn__arrow" />
      </span>
      <span className="compass-btn__sub">000°N</span>
    </button>
  );
}
