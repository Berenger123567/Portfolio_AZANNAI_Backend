import { cache } from "react";
import type {
  ProjectDetailData,
  SiteData,
} from "./types";

import { fallbackSiteData, getFallbackProject } from "./static-data";

const API_URL = (process.env.API_URL ?? "http://localhost:3001").replace(
  /\/$/,
  "",
);

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`L’API a répondu ${response.status} sur ${path}.`);
  }

  return (await response.json()) as T;
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  try {
    return await getJson<SiteData>("/api/public/site");
  } catch {
    return fallbackSiteData;
  }
});

export const getProjectData = cache(async (slug: string): Promise<ProjectDetailData | null> => {
  try {
    const response = await fetch(
      `${API_URL}/api/public/projects/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      },
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return getFallbackProject(slug);
    }

    return (await response.json()) as ProjectDetailData;
  } catch {
    return getFallbackProject(slug);
  }
});
