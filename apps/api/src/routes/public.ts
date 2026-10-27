import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../db";
import { HttpError, asyncHandler } from "../errors";
import { messageSchema } from "../validation";

export const publicRouter = Router();

const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Trop de messages envoyés. Réessayez plus tard." },
});

publicRouter.get(
  "/site",
  asyncHandler(async (_req, res) => {
    const [profile, education, experiences, training, skills, projects] =
      await Promise.all([
        prisma.profile.findUnique({ where: { id: 1 } }),
        prisma.education.findMany({
          orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
        }),
        prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.training.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.skill.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.project.findMany({
          where: { published: true },
          orderBy: { sortOrder: "asc" },
          include: {
            media: { orderBy: { sortOrder: "asc" } },
          },
        }),
      ]);

    if (!profile) {
      throw new HttpError(503, "Le contenu du site n’est pas initialisé.");
    }

    res.json({
      profile,
      education,
      experiences,
      training,
      skills,
      projects,
    });
  }),
);

publicRouter.get(
  "/projects/:slug",
  asyncHandler(async (req, res) => {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    if (!slug) {
      throw new HttpError(400, "Slug invalide.");
    }

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        media: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!project || !project.published) {
      throw new HttpError(404, "Projet introuvable.");
    }

    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, plate: true, title: true },
    });

    const currentIndex = projects.findIndex(
      (item) => item.slug === project.slug,
    );
    const nextProject =
      projects.length > 1
        ? projects[(currentIndex + 1) % projects.length]
        : null;

    res.json({ project, nextProject });
  }),
);

publicRouter.post(
  "/messages",
  messageLimiter,
  asyncHandler(async (req, res) => {
    const data = messageSchema.parse(req.body);

    if (data.website) {
      res.json({ ok: true });
      return;
    }

    const message = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        body: data.body,
      },
      select: { id: true },
    });

    res.status(201).json({ ok: true, id: message.id });
  }),
);
