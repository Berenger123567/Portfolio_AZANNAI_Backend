"use client";

export class AdminApiError extends Error {
  status: number;
  issues: { path: string; message: string }[];

  constructor(
    message: string,
    status: number,
    issues: { path: string; message: string }[] = [],
  ) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.issues = issues;
  }
}

type AdminRequestOptions = {
  method?: string;
  body?: unknown;
  form?: FormData;
};

export async function adminRequest<T>(
  path: string,
  options: AdminRequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  let body: BodyInit | undefined;

  if (options.form) {
    body = options.form;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
  const requestUrl = path.startsWith("http") ? path : apiBase ? `${apiBase}${path}` : path;

  const response = await fetch(requestUrl, {
    method: options.method ?? (body ? "POST" : "GET"),
    headers,
    body,
    credentials: "include",
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    issues?: { path: string; message: string }[];
  };

  if (response.status === 401) {
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/admin/login")
    ) {
      window.location.assign(
        new URL("/admin/login", window.location.origin).toString(),
      );
    }

    throw new AdminApiError("Session expirée. Reconnectez-vous.", 401);
  }

  if (!response.ok) {
    throw new AdminApiError(
      data.issues?.[0]?.message ??
        data.error ??
        "Une erreur est survenue. Réessayez.",
      response.status,
      data.issues,
    );
  }

  return data as T;
}

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
