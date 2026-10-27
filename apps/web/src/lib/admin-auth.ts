import { cookies } from "next/headers";
import type { AdminUser } from "./types";

const API_URL = (process.env.API_URL ?? "http://localhost:3001").replace(
  /\/$/,
  "",
);

export async function getAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();

  if (!cookie) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Accept: "application/json", cookie },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { user: AdminUser };
    return data.user;
  } catch {
    return null;
  }
}
