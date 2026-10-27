import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteData } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile, education, experiences, skills } = await getSiteData();

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <SiteHeader
        profile={profile}
        education={education}
        experiences={experiences}
        skills={skills}
      />
      <main id="contenu">{children}</main>
      <SiteFooter
        profile={profile}
        education={education}
        experiences={experiences}
        skills={skills}
      />
    </>
  );
}
