import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env";
import { HttpError } from "./errors";

export const COOKIE_NAME = "azanai_admin";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export type AdminSession = {
  id: string;
  email: string;
  name: string;
};

declare global {
  namespace Express {
    interface Request {
      admin?: AdminSession;
    }
  }
}

type AdminTokenPayload = jwt.JwtPayload & {
  email: string;
  name: string;
};

export function createAdminToken(admin: AdminSession) {
  return jwt.sign(
    { email: admin.email, name: admin.name },
    env.jwtSecret,
    {
      subject: admin.id,
      expiresIn: "7d",
    },
  );
}

export function verifyAdminToken(token: string): AdminSession {
  const payload = jwt.verify(token, env.jwtSecret) as AdminTokenPayload;

  if (!payload.sub || !payload.email || !payload.name) {
    throw new HttpError(401, "Session invalide.");
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  };
}

function getCookieOptions() {
  const isProd = env.isProduction;

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ("none" as const) : ("lax" as const),
    path: "/",
  };
}

export function setAdminCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    ...getCookieOptions(),
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearAdminCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, getCookieOptions());
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    next(new HttpError(401, "Authentification requise."));
    return;
  }

  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    next(new HttpError(401, "Session expirée ou invalide."));
  }
}

export function sameOrigin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  const origin = req.get("origin");

  if (!origin || env.webOrigins.includes(origin)) {
    next();
    return;
  }

  res.status(403).json({ error: "Origine non autorisée." });
}
