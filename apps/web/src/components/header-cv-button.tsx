"use client";

import { useState, type ReactNode } from "react";
import type { Profile, Education, Experience, Skill } from "@/lib/types";
import { CvModal } from "./cv-modal";

type CvTriggerProps = {
  profile: Profile;
  education?: Education[];
  experiences?: Experience[];
  skills?: Skill[];
  className?: string;
  children?: ReactNode;
};

function CvTrigger({
  profile,
  education = [],
  experiences = [],
  skills = [],
  className = "header-cv",
  children = "CV",
}: CvTriggerProps) {
  const [showCv, setShowCv] = useState(false);

  if (profile.cvUrl) {
    return (
      <a
        className={className}
        href={profile.cvUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Ouvrir le CV au format PDF"
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setShowCv(true)}
        aria-label="Consulter le CV interactif"
      >
        {children}
      </button>
      {showCv && (
        <CvModal
          isOpen={showCv}
          onClose={() => setShowCv(false)}
          profile={profile}
          education={education}
          experiences={experiences}
          skills={skills}
        />
      )}
    </>
  );
}

export function HeaderCvButton({ className, children, ...props }: CvTriggerProps) {
  return (
    <CvTrigger {...props} className={className ?? "header-cv"}>
      {children ?? "CV"}
    </CvTrigger>
  );
}

export function FullCvButton({ className, children, ...props }: CvTriggerProps) {
  return (
    <CvTrigger {...props} className={className ?? "btn btn--outline"}>
      {children ?? "Consulter le CV"}
    </CvTrigger>
  );
}
