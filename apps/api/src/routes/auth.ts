import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { prisma } from "../db";
import { HttpError, asyncHandler } from "../errors";
import {
  clearAdminCookie,
  createAdminToken,
  requireAdmin,
  setAdminCookie,
} from "../auth";
import { loginSchema } from "../validation";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Trop de tentatives. Réessayez dans quelques minutes." },
});

authRouter.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
    });

    if (!admin) {
      throw new HttpError(401, "Adresse e-mail ou mot de passe incorrect.");
    }

    const validPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!validPassword) {
      throw new HttpError(401, "Adresse e-mail ou mot de passe incorrect.");
    }

    const session = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };

    setAdminCookie(res, createAdminToken(session));
    res.json({ user: session });
  }),
);

authRouter.get(
  "/me",
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json({ user: req.admin });
  }),
);

authRouter.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    clearAdminCookie(res);
    res.json({ ok: true });
  }),
);
