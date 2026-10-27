"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type AvatarLightboxProps = {
  src: string;
  alt: string;
};

export function AvatarLightbox({ src, alt }: AvatarLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Agrandir la photo de profil"
        style={{
          width: "2.4rem",
          height: "2.4rem",
          borderRadius: "50%",
          overflow: "hidden",
          border: "1px solid var(--rule)",
          background: "var(--sheet)",
          padding: 0,
          flexShrink: 0,
          cursor: "zoom-in",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(10, 12, 14, 0.72)",
                display: "grid",
                placeItems: "center",
                zIndex: 2000,
                padding: "1rem",
                cursor: "zoom-out",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "min(90vw, 560px)",
                  maxHeight: "90vh",
                  borderRadius: "50%",
                  overflow: "hidden",
                  boxShadow: "0 40px 80px rgba(8, 10, 12, 0.4)",
                  cursor: "auto",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  style={{
                    display: "block",
                    width: "min(90vw, 560px)",
                    height: "min(90vw, 560px)",
                    objectFit: "cover",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.4)",
                  background: "rgba(10,12,14,0.6)",
                  color: "#f7f5ef",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
