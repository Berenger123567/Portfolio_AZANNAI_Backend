import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
});

const themeInit = `
(function () {
  try {
    var theme = localStorage.getItem("azanai_theme");
    if (theme !== "vellum" && theme !== "blueprint") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "blueprint"
        : "vellum";
    }
    document.documentElement.dataset.theme = theme;
  } catch (error) {}
})();
`;

export const metadata: Metadata = {
  title: {
    default: "AZANNAÏ Luc Emmaüs — Génie civil & construction",
    template: "%s — AZANNAÏ Luc Emmaüs",
  },
  description:
    "Portfolio de AZANNAÏ Luc Emmaüs Sèdjro, diplômé en génie civil à l’INSTI de Lokossa. Conception architecturale, dimensionnement des structures et suivi de chantier.",
  authors: [{ name: "AZANNAÏ Luc Emmaüs Sèdjro" }],
  openGraph: {
    title: "AZANNAÏ Luc Emmaüs — Génie civil & construction",
    description:
      "Conception architecturale, dimensionnement des structures et suivi de chantier. Portfolio de AZANNAÏ Luc Emmaüs Sèdjro.",
    locale: "fr_BJ",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-theme="vellum"
      suppressHydrationWarning
      className={`${archivo.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body id="top">{children}</body>
    </html>
  );
}
