import type { DrawingKind, ProjectMedia } from "@/lib/types";

type DrawingProps = {
  className?: string;
  decorative?: boolean;
};

function svgA11y(decorative: boolean | undefined, id: string) {
  if (decorative) {
    return {
      "aria-hidden": true as const,
      focusable: "false" as const,
    };
  }

  return {
    role: "img" as const,
    "aria-labelledby": `${id}-title`,
  };
}

export function HeroStructure({
  className,
  decorative = false,
}: DrawingProps) {
  return (
    <svg
      viewBox="0 0 760 520"
      className={className}
      {...svgA11y(decorative, "hero-structure")}
    >
      {!decorative && (
        <title id="hero-structure-title">
          Ossature en béton armé : poteaux, poutres et plancher
        </title>
      )}
      <defs>
        <pattern
          id="hero-grid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.09"
            strokeWidth="1"
          />
        </pattern>
        <marker
          id="hero-arrow"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--blueprint)" />
        </marker>
      </defs>

      <rect width="760" height="520" fill="url(#hero-grid)" />

      <g className="dwg">
        <line x1="120" y1="380" x2="380" y2="260" className="dwg-thin" />
        <line x1="380" y1="260" x2="640" y2="380" className="dwg-thin" />
        <line x1="640" y1="380" x2="380" y2="500" className="dwg-thin" />
        <line x1="380" y1="500" x2="120" y2="380" className="dwg-thin" />

        <g className="dwg-draw">
          <line x1="120" y1="380" x2="120" y2="210" className="dwg-line" />
          <line x1="380" y1="260" x2="380" y2="90" className="dwg-line" />
          <line x1="640" y1="380" x2="640" y2="210" className="dwg-line" />
          <line x1="380" y1="500" x2="380" y2="330" className="dwg-line" />
          <line x1="250" y1="320" x2="250" y2="150" className="dwg-line" />
          <line x1="510" y1="320" x2="510" y2="150" className="dwg-line" />
          <line x1="510" y1="440" x2="510" y2="270" className="dwg-line" />
          <line x1="250" y1="440" x2="250" y2="270" className="dwg-line" />
        </g>

        <g className="dwg-draw dwg-draw--2">
          <polygon
            points="120,210 380,90 640,210 380,330"
            className="dwg-slab"
          />
          <polygon
            points="120,224 380,104 640,224 380,344"
            className="dwg-thin"
          />
          <line x1="120" y1="210" x2="120" y2="224" className="dwg-line" />
          <line x1="380" y1="90" x2="380" y2="104" className="dwg-line" />
          <line x1="640" y1="210" x2="640" y2="224" className="dwg-line" />
          <line x1="380" y1="330" x2="380" y2="344" className="dwg-line" />
          <polygon
            points="120,224 380,344 640,224 640,210 380,330 120,210"
            className="dwg-hatch"
          />

          <line x1="250" y1="150" x2="250" y2="270" className="dwg-thin" />
          <line x1="510" y1="150" x2="510" y2="270" className="dwg-thin" />
          <line x1="250" y1="270" x2="510" y2="150" className="dwg-thin" />
          <line x1="250" y1="150" x2="510" y2="270" className="dwg-thin" />
        </g>

        <g className="dwg-draw dwg-draw--3">
          <line x1="120" y1="210" x2="380" y2="90" className="dwg-line" />
          <line x1="380" y1="90" x2="640" y2="210" className="dwg-line" />
          <line x1="640" y1="210" x2="380" y2="330" className="dwg-line" />
          <line x1="380" y1="330" x2="120" y2="210" className="dwg-line" />
          <line x1="250" y1="150" x2="510" y2="150" className="dwg-line" />
          <line x1="510" y1="150" x2="510" y2="270" className="dwg-line" />
          <line x1="510" y1="270" x2="250" y2="270" className="dwg-line" />
          <line x1="250" y1="270" x2="250" y2="150" className="dwg-line" />
        </g>

        <g className="dwg-draw dwg-draw--4">
          <line x1="80" y1="380" x2="80" y2="210" className="dwg-dim" markerStart="url(#hero-arrow)" markerEnd="url(#hero-arrow)" />
          <line x1="72" y1="380" x2="96" y2="380" className="dwg-dim" />
          <line x1="72" y1="210" x2="96" y2="210" className="dwg-dim" />
          <line x1="120" y1="380" x2="88" y2="380" className="dwg-dim" />
          <line x1="120" y1="210" x2="88" y2="210" className="dwg-dim" />
          <text x="60" y="300" className="dwg-label dwg-label--blue" transform="rotate(-90 60 300)" textAnchor="middle">
            H = 3,20 m
          </text>
        </g>

        <g className="dwg-draw dwg-draw--5">
          <line x1="380" y1="90" x2="710" y2="90" className="dwg-dim" strokeDasharray="4 4" />
          <text x="704" y="82" className="dwg-label dwg-label--accent" textAnchor="end">
            NIVEAU +3,20
          </text>
          <line x1="380" y1="90" x2="380" y2="62" className="dwg-accent" />
          <circle cx="380" cy="58" r="4" className="dwg-accent" fill="var(--sheet)" />
          <circle cx="120" cy="380" r="3" className="dwg-line" fill="var(--sheet)" />
          <circle cx="640" cy="380" r="3" className="dwg-line" fill="var(--sheet)" />
          <text x="128" y="398" className="dwg-label">A</text>
          <text x="648" y="398" className="dwg-label">B</text>
        </g>

        <g className="dwg-draw dwg-draw--6">
          <polyline points="286,264 332,240" className="dwg-dim" />
          <text x="340" y="236" className="dwg-label">POUTRE 20×40</text>
          <polyline points="536,430 580,454" className="dwg-dim" />
          <text x="588" y="458" className="dwg-label">POTEAU 20×20</text>
          <polyline points="556,126 604,118" className="dwg-dim" />
          <text x="612" y="114" className="dwg-label">PLANCHER BA</text>
        </g>

        <g className="dwg-draw dwg-draw--7">
          <path d="M 120 380 L 120 388 L 128 388 L 128 380" className="dwg-accent" />
          <path d="M 380 500 L 380 508 L 388 508 L 388 500" className="dwg-accent" />
          <path d="M 640 380 L 640 388 L 648 388 L 648 380" className="dwg-accent" />
          <path d="M 380 260 L 380 268 L 388 268 L 388 260" className="dwg-accent" />
        </g>
      </g>

      <g className="dwg">
        <text x="18" y="500" className="dwg-label">OSSATURE BA — ÉTUDE</text>
        <text x="742" y="500" className="dwg-label" textAnchor="end">ÉCH. 1:50</text>
      </g>
    </svg>
  );
}

export function PlanDrawing({ className, decorative = false }: DrawingProps) {
  return (
    <svg
      viewBox="0 0 760 520"
      className={className}
      {...svgA11y(decorative, "plan-drawing")}
    >
      {!decorative && (
        <title id="plan-drawing-title">
          Plan du rez-de-chaussée d’une maison
        </title>
      )}
      <defs>
        <pattern
          id="plan-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        </pattern>
        <marker
          id="plan-arrow"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--blueprint)" />
        </marker>
      </defs>

      <rect width="760" height="520" fill="url(#plan-grid)" />

      <g className="dwg">
        <g className="dwg-draw">
          <line x1="80" y1="70" x2="150" y2="70" className="dwg-wall" />
          <line x1="230" y1="70" x2="450" y2="70" className="dwg-wall" />
          <line x1="530" y1="70" x2="680" y2="70" className="dwg-wall" />
          <line x1="80" y1="450" x2="160" y2="450" className="dwg-wall" />
          <line x1="240" y1="450" x2="680" y2="450" className="dwg-wall" />
          <line x1="80" y1="70" x2="80" y2="140" className="dwg-wall" />
          <line x1="80" y1="200" x2="80" y2="450" className="dwg-wall" />
          <line x1="680" y1="70" x2="680" y2="140" className="dwg-wall" />
          <line x1="680" y1="200" x2="680" y2="450" className="dwg-wall" />

          <line x1="88" y1="78" x2="150" y2="78" className="dwg-thin" />
          <line x1="230" y1="78" x2="450" y2="78" className="dwg-thin" />
          <line x1="530" y1="78" x2="672" y2="78" className="dwg-thin" />
          <line x1="88" y1="442" x2="160" y2="442" className="dwg-thin" />
          <line x1="240" y1="442" x2="672" y2="442" className="dwg-thin" />
          <line x1="88" y1="78" x2="88" y2="140" className="dwg-thin" />
          <line x1="88" y1="200" x2="88" y2="442" className="dwg-thin" />
          <line x1="672" y1="78" x2="672" y2="140" className="dwg-thin" />
          <line x1="672" y1="200" x2="672" y2="442" className="dwg-thin" />

          <line x1="372" y1="78" x2="372" y2="130" className="dwg-wall" />
          <line x1="372" y1="190" x2="372" y2="330" className="dwg-wall" />
          <line x1="372" y1="390" x2="372" y2="442" className="dwg-wall" />

          <line x1="88" y1="286" x2="190" y2="286" className="dwg-wall" />
          <line x1="250" y1="286" x2="369" y2="286" className="dwg-wall" />
          <line x1="375" y1="286" x2="672" y2="286" className="dwg-wall" />

          <line x1="536" y1="286" x2="536" y2="330" className="dwg-wall" />
          <line x1="536" y1="390" x2="536" y2="442" className="dwg-wall" />
          <line x1="539" y1="380" x2="580" y2="380" className="dwg-wall" />
          <line x1="620" y1="380" x2="672" y2="380" className="dwg-wall" />
        </g>

        <g className="dwg-draw dwg-draw--2">
          <path d="M 190 286 A 60 60 0 0 0 250 346" className="dwg-thin" />
          <line x1="250" y1="346" x2="250" y2="286" className="dwg-thin" />

          <path d="M 372 190 A 60 60 0 0 1 432 130" className="dwg-thin" />
          <line x1="432" y1="130" x2="372" y2="130" className="dwg-thin" />

          <path d="M 372 330 A 60 60 0 0 0 432 390" className="dwg-thin" />
          <line x1="432" y1="390" x2="372" y2="390" className="dwg-thin" />

          <path d="M 536 330 A 60 60 0 0 1 596 390" className="dwg-thin" />
          <line x1="596" y1="390" x2="536" y2="390" className="dwg-thin" />

          <path d="M 580 380 A 40 40 0 0 0 620 420" className="dwg-thin" />
          <line x1="620" y1="420" x2="620" y2="380" className="dwg-thin" />

          <path d="M 160 450 A 80 80 0 0 1 240 370" className="dwg-thin" />
          <line x1="240" y1="370" x2="240" y2="450" className="dwg-thin" />
        </g>

        <g className="dwg-draw dwg-draw--3">
          <line x1="150" y1="70" x2="230" y2="70" className="dwg-window" />
          <line x1="450" y1="70" x2="530" y2="70" className="dwg-window" />
          <line x1="80" y1="140" x2="80" y2="200" className="dwg-window" />
          <line x1="680" y1="140" x2="680" y2="200" className="dwg-window" />
          <line x1="150" y1="62" x2="230" y2="62" className="dwg-thin" />
          <line x1="450" y1="62" x2="530" y2="62" className="dwg-thin" />
          <line x1="72" y1="140" x2="72" y2="200" className="dwg-thin" />
          <line x1="688" y1="140" x2="688" y2="200" className="dwg-thin" />
        </g>

        <g className="dwg-draw dwg-draw--4">
          <line x1="80" y1="40" x2="680" y2="40" className="dwg-dim" markerStart="url(#plan-arrow)" markerEnd="url(#plan-arrow)" />
          <line x1="80" y1="32" x2="80" y2="48" className="dwg-dim" />
          <line x1="680" y1="32" x2="680" y2="48" className="dwg-dim" />
          <text x="380" y="30" className="dwg-label dwg-label--blue" textAnchor="middle">
            18,00 m
          </text>

          <line x1="44" y1="70" x2="44" y2="450" className="dwg-dim" markerStart="url(#plan-arrow)" markerEnd="url(#plan-arrow)" />
          <line x1="36" y1="70" x2="52" y2="70" className="dwg-dim" />
          <line x1="36" y1="450" x2="52" y2="450" className="dwg-dim" />
          <text x="34" y="260" className="dwg-label dwg-label--blue" transform="rotate(-90 34 260)" textAnchor="middle">
            12,00 m
          </text>
        </g>

        <g className="dwg-draw dwg-draw--5">
          <text x="218" y="180" className="dwg-label dwg-label--strong" textAnchor="middle">Séjour</text>
          <text x="218" y="366" className="dwg-label dwg-label--strong" textAnchor="middle">Chambre 1</text>
          <text x="520" y="180" className="dwg-label dwg-label--strong" textAnchor="middle">Chambre 2</text>
          <text x="454" y="366" className="dwg-label dwg-label--strong" textAnchor="middle">Cuisine</text>
          <text x="606" y="326" className="dwg-label dwg-label--strong" textAnchor="middle">SDB</text>
          <text x="600" y="406" className="dwg-label" textAnchor="middle">WC</text>
          <text x="120" y="476" className="dwg-label">Entrée</text>
          <polyline points="148,462 160,450" className="dwg-dim" />
        </g>

        <g className="dwg-draw dwg-draw--6">
          <circle cx="720" cy="100" r="18" className="dwg-thin" />
          <path d="M 720 82 L 726 106 L 720 100 L 714 106 Z" className="dwg-accent" fill="var(--laterite)" />
          <text x="720" y="78" className="dwg-label" textAnchor="middle">N</text>

          <line x1="372" y1="70" x2="372" y2="30" className="dwg-dim" strokeDasharray="3 3" />
          <circle cx="372" cy="24" r="9" className="dwg-thin" fill="var(--sheet)" />
          <text x="372" y="28" className="dwg-label" textAnchor="middle">A</text>

          <line x1="80" y1="286" x2="40" y2="286" className="dwg-dim" strokeDasharray="3 3" />
          <circle cx="32" cy="286" r="9" className="dwg-thin" fill="var(--sheet)" />
          <text x="32" y="290" className="dwg-label" textAnchor="middle">1</text>
        </g>

        <g className="dwg">
          <text x="80" y="498" className="dwg-label">PLAN RDC — ÉCH. 1:100</text>
          <text x="680" y="498" className="dwg-label" textAnchor="end">INSTI LOKOSSA</text>
        </g>
      </g>
    </svg>
  );
}

export function ElevationDrawing({
  className,
  decorative = false,
}: DrawingProps) {
  return (
    <svg
      viewBox="0 0 760 520"
      className={className}
      {...svgA11y(decorative, "elevation-drawing")}
    >
      {!decorative && (
        <title id="elevation-drawing-title">
          Façade principale d’une maison avec chambres à louer
        </title>
      )}
      <defs>
        <pattern
          id="elev-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id="elev-ground"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="var(--ink-soft)"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
        </pattern>
        <marker
          id="elev-arrow"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--blueprint)" />
        </marker>
      </defs>

      <rect width="760" height="520" fill="url(#elev-grid)" />

      <g className="dwg">
        <g className="dwg-draw">
          <rect x="120" y="170" width="520" height="260" className="dwg-wall" />
          <line x1="110" y1="170" x2="650" y2="170" className="dwg-wall" />
          <line x1="110" y1="160" x2="650" y2="160" className="dwg-line" />
          <line x1="110" y1="160" x2="110" y2="170" className="dwg-line" />
          <line x1="650" y1="160" x2="650" y2="170" className="dwg-line" />

          <line x1="120" y1="300" x2="640" y2="300" className="dwg-thin" strokeDasharray="4 4" />

          <line x1="70" y1="430" x2="690" y2="430" className="dwg-wall" />
          <rect x="70" y="430" width="620" height="30" fill="url(#elev-ground)" />
        </g>

        <g className="dwg-draw dwg-draw--2">
          <rect x="180" y="220" width="100" height="90" className="dwg-window" />
          <line x1="230" y1="220" x2="230" y2="310" className="dwg-thin" />
          <line x1="180" y1="265" x2="280" y2="265" className="dwg-thin" />

          <rect x="330" y="220" width="100" height="90" className="dwg-window" />
          <line x1="380" y1="220" x2="380" y2="310" className="dwg-thin" />
          <line x1="330" y1="265" x2="430" y2="265" className="dwg-thin" />

          <rect x="480" y="290" width="60" height="140" className="dwg-window" />
          <line x1="510" y1="290" x2="510" y2="430" className="dwg-thin" />
          <circle cx="496" cy="362" r="2.5" className="dwg-accent" fill="var(--laterite)" />

          <rect x="560" y="220" width="48" height="60" className="dwg-window" />
          <line x1="560" y1="250" x2="608" y2="250" className="dwg-thin" />
        </g>

        <g className="dwg-draw dwg-draw--3">
          <rect x="120" y="408" width="520" height="22" fill="url(#elev-ground)" stroke="var(--ink)" strokeWidth="1" />
          <line x1="120" y1="408" x2="640" y2="408" className="dwg-line" />
          <line x1="120" y1="430" x2="120" y2="470" className="dwg-thin" />
          <line x1="240" y1="430" x2="240" y2="470" className="dwg-thin" />
          <line x1="360" y1="430" x2="360" y2="470" className="dwg-thin" />
          <line x1="480" y1="430" x2="480" y2="470" className="dwg-thin" />
          <line x1="600" y1="430" x2="600" y2="470" className="dwg-thin" />
          <line x1="120" y1="470" x2="640" y2="470" className="dwg-thin" />
        </g>

        <g className="dwg-draw dwg-draw--4">
          <line x1="700" y1="160" x2="700" y2="430" className="dwg-dim" markerStart="url(#elev-arrow)" markerEnd="url(#elev-arrow)" />
          <line x1="692" y1="160" x2="708" y2="160" className="dwg-dim" />
          <line x1="692" y1="430" x2="708" y2="430" className="dwg-dim" />
          <text x="716" y="300" className="dwg-label dwg-label--blue" transform="rotate(-90 716 300)" textAnchor="middle">
            H = 3,20 m
          </text>

          <line x1="120" y1="490" x2="640" y2="490" className="dwg-dim" markerStart="url(#elev-arrow)" markerEnd="url(#elev-arrow)" />
          <line x1="120" y1="482" x2="120" y2="498" className="dwg-dim" />
          <line x1="640" y1="482" x2="640" y2="498" className="dwg-dim" />
          <text x="380" y="512" className="dwg-label dwg-label--blue" textAnchor="middle">
            18,00 m
          </text>
        </g>

        <g className="dwg-draw dwg-draw--5">
          <line x1="230" y1="160" x2="230" y2="135" className="dwg-dim" />
          <text x="230" y="128" className="dwg-label" textAnchor="middle">Chambre 2</text>
          <line x1="380" y1="160" x2="380" y2="135" className="dwg-dim" />
          <text x="380" y="128" className="dwg-label" textAnchor="middle">Séjour</text>
          <line x1="510" y1="160" x2="510" y2="135" className="dwg-dim" />
          <text x="510" y="128" className="dwg-label" textAnchor="middle">Entrée</text>
        </g>

        <g className="dwg">
          <text x="80" y="498" className="dwg-label">FAÇADE PRINCIPALE — ÉCH. 1:100</text>
          <text x="680" y="498" className="dwg-label" textAnchor="end">PL-02.2</text>
        </g>
      </g>
    </svg>
  );
}

export function SectionDrawing({
  className,
  decorative = false,
}: DrawingProps) {
  return (
    <svg
      viewBox="0 0 760 520"
      className={className}
      {...svgA11y(decorative, "section-drawing")}
    >
      {!decorative && (
        <title id="section-drawing-title">
          Coupe structurelle d’un bloc pédagogique : semelles, poteaux,
          poutres et planchers
        </title>
      )}
      <defs>
        <pattern
          id="section-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id="section-ground"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="var(--ink-soft)"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id="section-concrete"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="var(--ink)"
            strokeOpacity="0.16"
            strokeWidth="1"
          />
        </pattern>
        <marker
          id="section-arrow"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--blueprint)" />
        </marker>
      </defs>

      <rect width="760" height="520" fill="url(#section-grid)" />

      <g className="dwg">
        <g className="dwg-draw">
          <line x1="70" y1="440" x2="690" y2="440" className="dwg-wall" />
          <rect x="70" y="440" width="620" height="40" fill="url(#section-ground)" />

          <rect x="150" y="440" width="90" height="18" fill="url(#section-concrete)" stroke="var(--ink)" strokeWidth="1" />
          <rect x="520" y="440" width="90" height="18" fill="url(#section-concrete)" stroke="var(--ink)" strokeWidth="1" />

          <rect x="178" y="200" width="26" height="240" fill="url(#section-concrete)" stroke="var(--ink)" strokeWidth="1" />
          <rect x="556" y="200" width="26" height="240" fill="url(#section-concrete)" stroke="var(--ink)" strokeWidth="1" />

          <rect x="130" y="300" width="500" height="20" fill="url(#section-concrete)" stroke="var(--ink)" strokeWidth="1" />
          <rect x="168" y="320" width="424" height="24" fill="url(#section-concrete)" stroke="var(--ink)" strokeWidth="1" />

          <rect x="130" y="160" width="500" height="20" fill="url(#section-concrete)" stroke="var(--ink)" strokeWidth="1" />
          <rect x="168" y="180" width="424" height="24" fill="url(#section-concrete)" stroke="var(--ink)" strokeWidth="1" />

          <line x1="204" y1="200" x2="204" y2="440" className="dwg-thin" />
          <line x1="582" y1="200" x2="582" y2="440" className="dwg-thin" />
        </g>

        <g className="dwg-draw dwg-draw--2">
          <path d="M 300 440 L 300 420 L 330 420 L 330 400 L 360 400 L 360 380 L 390 380 L 390 360 L 420 360 L 420 340 L 450 340 L 450 320" className="dwg-line" />
          <line x1="300" y1="440" x2="450" y2="440" className="dwg-thin" />
          <line x1="450" y1="320" x2="450" y2="300" className="dwg-thin" />
          <text x="318" y="382" className="dwg-label" transform="rotate(-90 318 382)">
            Escalier
          </text>
        </g>

        <g className="dwg-draw dwg-draw--3">
          <line x1="191" y1="210" x2="191" y2="430" className="dwg-accent" strokeDasharray="2 4" />
          <line x1="569" y1="210" x2="569" y2="430" className="dwg-accent" strokeDasharray="2 4" />
          <circle cx="504" cy="315" r="3" className="dwg-accent" fill="var(--laterite)" />
          <circle cx="504" cy="330" r="3" className="dwg-accent" fill="var(--laterite)" />
          <circle cx="504" cy="345" r="3" className="dwg-accent" fill="var(--laterite)" />
        </g>

        <g className="dwg-draw dwg-draw--4">
          <line x1="60" y1="160" x2="60" y2="440" className="dwg-dim" markerStart="url(#section-arrow)" markerEnd="url(#section-arrow)" />
          <line x1="52" y1="160" x2="68" y2="160" className="dwg-dim" />
          <line x1="52" y1="440" x2="68" y2="440" className="dwg-dim" />
          <text x="46" y="300" className="dwg-label dwg-label--blue" transform="rotate(-90 46 300)" textAnchor="middle">
            H = 6,40 m
          </text>

          <line x1="130" y1="500" x2="630" y2="500" className="dwg-dim" markerStart="url(#section-arrow)" markerEnd="url(#section-arrow)" />
          <line x1="130" y1="492" x2="130" y2="508" className="dwg-dim" />
          <line x1="630" y1="492" x2="630" y2="508" className="dwg-dim" />
          <text x="380" y="518" className="dwg-label dwg-label--blue" textAnchor="middle">
            18,00 m
          </text>
        </g>

        <g className="dwg-draw dwg-draw--5">
          <polyline points="360,310 420,280 452,280" className="dwg-dim" />
          <text x="460" y="276" className="dwg-label">Poutre 20×40</text>
          <polyline points="582,380 620,410" className="dwg-dim" />
          <text x="628" y="414" className="dwg-label">Poteau 30×30</text>
          <polyline points="400,170 440,140" className="dwg-dim" />
          <text x="448" y="136" className="dwg-label">Plancher BA</text>
          <polyline points="195,458 240,480" className="dwg-dim" />
          <text x="248" y="484" className="dwg-label">Semelle isolée</text>
        </g>

        <g className="dwg-draw dwg-draw--6">
          <line x1="130" y1="300" x2="130" y2="320" className="dwg-accent" />
          <line x1="630" y1="300" x2="630" y2="320" className="dwg-accent" />
          <text x="204" y="154" className="dwg-label" textAnchor="middle">Niveau +3,20</text>
          <text x="204" y="292" className="dwg-label" textAnchor="middle">Niveau 0,00</text>
        </g>

        <g className="dwg">
          <text x="80" y="498" className="dwg-label">COUPE STRUCTURELLE — ÉCH. 1:50</text>
          <text x="680" y="498" className="dwg-label" textAnchor="end">PL-03.1</text>
        </g>
      </g>
    </svg>
  );
}

export function ProjectDrawing({
  kind,
  className,
  decorative = false,
}: DrawingProps & { kind: DrawingKind }) {
  if (kind === "plan") {
    return <PlanDrawing className={className} decorative={decorative} />;
  }

  if (kind === "elevation") {
    return <ElevationDrawing className={className} decorative={decorative} />;
  }

  return <SectionDrawing className={className} decorative={decorative} />;
}

type DrawingFrameProps = {
  kind: DrawingKind;
  code: string;
  caption: string;
  drawingTitle: string;
  meta?: string;
  decorative?: boolean;
  className?: string;
};

export function DrawingFrame({
  kind,
  code,
  caption,
  drawingTitle,
  meta = "Éch. 1:100",
  decorative = false,
  className = "",
}: DrawingFrameProps) {
  return (
    <figure className={`drawing ${className}`}>
      <div className="drawing__bar">
        <span>{drawingTitle}</span>{" "}
        <span>{meta}</span>
      </div>
      <div className="drawing__canvas">
        <ProjectDrawing kind={kind} decorative={decorative} />
      </div>
      <figcaption className="drawing__caption">
        <span>{code}</span>{" "}
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

type MediaFrameProps = {
  media: ProjectMedia;
  drawingTitle?: string;
  meta?: string;
  decorative?: boolean;
  className?: string;
};

export function MediaFrame({
  media,
  drawingTitle,
  meta,
  decorative = false,
  className = "",
}: MediaFrameProps) {
  if (media.kind === "drawing" && media.drawingKind) {
    return (
      <DrawingFrame
        kind={media.drawingKind}
        code={media.code}
        drawingTitle={drawingTitle ?? media.code}
        meta={meta}
        caption={media.caption}
        decorative={decorative}
        className={className}
      />
    );
  }

  if (media.kind === "image" && media.url) {
    return (
      <figure className={`drawing ${className}`}>
        <div className="drawing__bar">
          <span>{drawingTitle ?? media.code}</span>{" "}
          <span>{meta ?? "Document"}</span>
        </div>
        <div className="drawing__canvas drawing__canvas--media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.url}
            alt={decorative ? "" : media.caption}
            className="drawing__image"
            loading="lazy"
          />
        </div>
        <figcaption className="drawing__caption">
          <span>{media.code}</span> <span>{media.caption}</span>
        </figcaption>
      </figure>
    );
  }

  if (media.kind === "pdf" && media.url) {
    return (
      <figure className={`drawing ${className}`}>
        <div className="drawing__bar">
          <span>{drawingTitle ?? media.code}</span> <span>PDF</span>
        </div>
        <div className="drawing__canvas drawing__canvas--document">
          <a
            className="document-link"
            href={media.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className="document-link__label">Document PDF</span>
            <span className="document-link__title">{media.caption}</span>
            <span className="document-link__action">Ouvrir le document</span>
          </a>
        </div>
        <figcaption className="drawing__caption">
          <span>{media.code}</span> <span>{media.caption}</span>
        </figcaption>
      </figure>
    );
  }

  return null;
}

export function MediaPreview({ media }: { media?: ProjectMedia | null }) {
  if (!media) {
    return <PlanDrawing decorative />;
  }

  if (media.kind === "drawing" && media.drawingKind) {
    return <ProjectDrawing kind={media.drawingKind} decorative />;
  }

  if (media.kind === "image" && media.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.url}
        alt=""
        className="project-row__image"
        loading="lazy"
      />
    );
  }

  return (
    <span className="project-row__document">
      <span>PDF</span>
      <span>{media.code}</span>
    </span>
  );
}

export function HeroDrawingFrame({ className = "" }: { className?: string }) {
  return (
    <figure className={`drawing drawing--hero ${className}`}>
      <div className="drawing__bar">
        <span>Ossature BA — poteaux, poutres, plancher</span>{" "}
        <span>Étude structurelle</span>
      </div>
      <div className="drawing__canvas drawing__canvas--hero">
        <HeroStructure />
      </div>
      <figcaption className="drawing__caption">
        <span>Éch. 1:50</span>{" "}
        <span>INSTI Lokossa</span>
      </figcaption>
    </figure>
  );
}
