import { Router } from "express";
import { prisma } from "../db";
import { HttpError, asyncHandler } from "../errors";
import { requireAdmin } from "../auth";
import { deleteUpload, storeUpload, upload } from "../uploads";
import {
  educationSchema,
  experienceSchema,
  mediaCreateSchema,
  mediaReplaceSchema,
  mediaUpdateSchema,
  mediaUploadSchema,
  messageReadSchema,
  messageSchema,
  profileSchema,
  projectSchema,
  skillSchema,
  trainingSchema,
} from "../validation";

export const adminRouter = Router();

adminRouter.use(requireAdmin);

function paramId(value: string | string[] | undefined) {
  const id = Array.isArray(value) ? value[0] : value;

  if (!id || !id.trim()) {
    throw new HttpError(400, "Identifiant invalide.");
  }

  return id;
}

async function ensureProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!project) {
    throw new HttpError(404, "Projet introuvable.");
  }
}

adminRouter.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const [
      projects,
      publishedProjects,
      messages,
      unreadMessages,
      education,
      skills,
      recentMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.message.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.education.count(),
      prisma.skill.count(),
      prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    res.json({
      counts: {
        projects,
        publishedProjects,
        messages,
        unreadMessages,
        education,
        skills,
      },
      recentMessages,
    });
  }),
);

adminRouter.get(
  "/profile",
  asyncHandler(async (_req, res) => {
    const profile = await prisma.profile.findUnique({ where: { id: 1 } });

    if (!profile) {
      throw new HttpError(404, "Profil introuvable.");
    }

    res.json({ profile });
  }),
);

adminRouter.put(
  "/profile",
  asyncHandler(async (req, res) => {
    const data = profileSchema.parse(req.body);
    const existing = await prisma.profile.findUnique({ where: { id: 1 } });

    const profile = await prisma.profile.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    if (
      existing?.cvPublicId &&
      data.cvPublicId !== undefined &&
      data.cvPublicId !== existing.cvPublicId
    ) {
      await deleteUpload(existing.cvPublicId);
    }

    res.json({ profile });
  }),
);

adminRouter.get(
  "/education",
  asyncHandler(async (_req, res) => {
    const education = await prisma.education.findMany({
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    });

    res.json({ education });
  }),
);

adminRouter.post(
  "/education",
  asyncHandler(async (req, res) => {
    const data = educationSchema.parse(req.body);
    const item = await prisma.education.create({ data });
    res.status(201).json({ item });
  }),
);

adminRouter.put(
  "/education/:id",
  asyncHandler(async (req, res) => {
    const data = educationSchema.parse(req.body);
    const item = await prisma.education.update({
      where: { id: paramId(req.params.id) },
      data,
    });

    res.json({ item });
  }),
);

adminRouter.delete(
  "/education/:id",
  asyncHandler(async (req, res) => {
    await prisma.education.delete({ where: { id: paramId(req.params.id) } });
    res.json({ ok: true });
  }),
);

adminRouter.get(
  "/experiences",
  asyncHandler(async (_req, res) => {
    const experiences = await prisma.experience.findMany({
      orderBy: { sortOrder: "asc" },
    });

    res.json({ experiences });
  }),
);

adminRouter.post(
  "/experiences",
  asyncHandler(async (req, res) => {
    const data = experienceSchema.parse(req.body);
    const item = await prisma.experience.create({ data });
    res.status(201).json({ item });
  }),
);

adminRouter.put(
  "/experiences/:id",
  asyncHandler(async (req, res) => {
    const data = experienceSchema.parse(req.body);
    const item = await prisma.experience.update({
      where: { id: paramId(req.params.id) },
      data,
    });

    res.json({ item });
  }),
);

adminRouter.delete(
  "/experiences/:id",
  asyncHandler(async (req, res) => {
    await prisma.experience.delete({ where: { id: paramId(req.params.id) } });
    res.json({ ok: true });
  }),
);

adminRouter.get(
  "/training",
  asyncHandler(async (_req, res) => {
    const training = await prisma.training.findMany({
      orderBy: { sortOrder: "asc" },
    });

    res.json({ training });
  }),
);

adminRouter.post(
  "/training",
  asyncHandler(async (req, res) => {
    const data = trainingSchema.parse(req.body);
    const item = await prisma.training.create({ data });
    res.status(201).json({ item });
  }),
);

adminRouter.put(
  "/training/:id",
  asyncHandler(async (req, res) => {
    const data = trainingSchema.parse(req.body);
    const item = await prisma.training.update({
      where: { id: paramId(req.params.id) },
      data,
    });

    res.json({ item });
  }),
);

adminRouter.delete(
  "/training/:id",
  asyncHandler(async (req, res) => {
    await prisma.training.delete({ where: { id: paramId(req.params.id) } });
    res.json({ ok: true });
  }),
);

adminRouter.get(
  "/skills",
  asyncHandler(async (_req, res) => {
    const skills = await prisma.skill.findMany({
      orderBy: { sortOrder: "asc" },
    });

    res.json({ skills });
  }),
);

adminRouter.post(
  "/skills",
  asyncHandler(async (req, res) => {
    const data = skillSchema.parse(req.body);
    const item = await prisma.skill.create({ data });
    res.status(201).json({ item });
  }),
);

adminRouter.put(
  "/skills/:id",
  asyncHandler(async (req, res) => {
    const data = skillSchema.parse(req.body);
    const item = await prisma.skill.update({
      where: { id: paramId(req.params.id) },
      data,
    });

    res.json({ item });
  }),
);

adminRouter.delete(
  "/skills/:id",
  asyncHandler(async (req, res) => {
    await prisma.skill.delete({ where: { id: paramId(req.params.id) } });
    res.json({ ok: true });
  }),
);

adminRouter.get(
  "/projects",
  asyncHandler(async (_req, res) => {
    const projects = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { media: true } } },
    });

    res.json({ projects });
  }),
);

adminRouter.get(
  "/projects/:id",
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findUnique({
      where: { id: paramId(req.params.id) },
      include: { media: { orderBy: { sortOrder: "asc" } } },
    });

    if (!project) {
      throw new HttpError(404, "Projet introuvable.");
    }

    res.json({ project });
  }),
);

adminRouter.post(
  "/projects",
  asyncHandler(async (req, res) => {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data,
      include: { media: { orderBy: { sortOrder: "asc" } } },
    });
    res.status(201).json({ project });
  }),
);

adminRouter.put(
  "/projects/:id",
  asyncHandler(async (req, res) => {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.update({
      where: { id: paramId(req.params.id) },
      data,
      include: { media: { orderBy: { sortOrder: "asc" } } },
    });

    res.json({ project });
  }),
);

adminRouter.delete(
  "/projects/:id",
  asyncHandler(async (req, res) => {
    const id = paramId(req.params.id);
    const media = await prisma.projectMedia.findMany({
      where: { projectId: id },
      select: { publicId: true },
    });

    await prisma.project.delete({ where: { id } });
    await Promise.all(media.map((item) => deleteUpload(item.publicId)));

    res.json({ ok: true });
  }),
);

adminRouter.post(
  "/projects/:id/media/drawing",
  asyncHandler(async (req, res) => {
    const projectId = paramId(req.params.id);
    await ensureProject(projectId);

    const data = mediaCreateSchema.parse(req.body);

    if (data.kind !== "drawing") {
      throw new HttpError(
        400,
        "Ce point dâ€™entrÃ©e accepte uniquement les dessins gÃ©nÃ©rÃ©s.",
      );
    }

    const media = await prisma.projectMedia.create({
      data: {
        projectId,
        kind: "drawing",
        drawingKind: data.drawingKind,
        code: data.code,
        caption: data.caption,
        sortOrder: data.sortOrder,
      },
    });

    res.status(201).json({ media });
  }),
);

adminRouter.post(
  "/projects/:id/media/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const projectId = paramId(req.params.id);
    await ensureProject(projectId);

    if (!req.file) {
      throw new HttpError(400, "Fichier requis.");
    }

    const data = mediaUploadSchema.parse(req.body);
    const stored = await storeUpload(req.file, "projects");

    try {
      const media = await prisma.projectMedia.create({
        data: {
          projectId,
          kind: stored.kind,
          url: stored.url,
          publicId: stored.publicId,
          mimeType: stored.mimeType,
          code: data.code,
          caption: data.caption,
          sortOrder: data.sortOrder,
        },
      });

      res.status(201).json({ media });
    } catch (error) {
      await deleteUpload(stored.publicId);
      throw error;
    }
  }),
);

adminRouter.put(
  "/projects/:projectId/media/:mediaId",
  asyncHandler(async (req, res) => {
    const projectId = paramId(req.params.projectId);
    const mediaId = paramId(req.params.mediaId);
    const data = mediaUpdateSchema.parse(req.body);

    const current = await prisma.projectMedia.findFirst({
      where: { id: mediaId, projectId },
    });

    if (!current) {
      throw new HttpError(404, "Média introuvable.");
    }

    if (current.kind === "drawing" && data.drawingKind === null) {
      throw new HttpError(400, "Le type de dessin est requis.");
    }

    const media = await prisma.projectMedia.update({
      where: { id: mediaId },
      data,
    });

    res.json({ media });
  }),
);

adminRouter.put(
  "/projects/:projectId/media/:mediaId/replace",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const projectId = paramId(req.params.projectId);
    const mediaId = paramId(req.params.mediaId);

    if (!req.file) {
      throw new HttpError(400, "Fichier requis.");
    }

    const allowed = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
    if (!allowed.has(req.file.mimetype)) {
      throw new HttpError(400, "Format de fichier non autorisé.");
    }

    const current = await prisma.projectMedia.findFirst({
      where: { id: mediaId, projectId },
    });

    if (!current) {
      throw new HttpError(404, "Média introuvable.");
    }

    if (current.kind === "drawing") {
      throw new HttpError(400, "Impossible de remplacer un dessin généré.");
    }

    const parsed = mediaReplaceSchema.safeParse({
      code: req.body.code,
      caption: req.body.caption,
      sortOrder: req.body.sortOrder,
    });

    if (!parsed.success) {
      throw new HttpError(400, parsed.error.issues[0]?.message ?? "Données invalides.");
    }

    const stored = await storeUpload(req.file, "projects");
    try {
      const media = await prisma.projectMedia.update({
        where: { id: mediaId },
        data: {
          kind: stored.kind,
          url: stored.url,
          publicId: stored.publicId,
          mimeType: stored.mimeType,
          ...(parsed.data.code !== undefined ? { code: parsed.data.code } : {}),
          ...(parsed.data.caption !== undefined ? { caption: parsed.data.caption } : {}),
          ...(parsed.data.sortOrder !== undefined ? { sortOrder: parsed.data.sortOrder } : {}),
        },
      });

      await deleteUpload(current.publicId);
      res.json({ media });
    } catch (error) {
      await deleteUpload(stored.publicId);
      throw error;
    }
  }),
);

adminRouter.delete(
  "/projects/:projectId/media/:mediaId",
  asyncHandler(async (req, res) => {
    const projectId = paramId(req.params.projectId);
    const mediaId = paramId(req.params.mediaId);

    const media = await prisma.projectMedia.findFirst({
      where: { id: mediaId, projectId },
    });

    if (!media) {
      throw new HttpError(404, "MÃ©dia introuvable.");
    }

    await prisma.projectMedia.delete({ where: { id: mediaId } });
    await deleteUpload(media.publicId);

    res.json({ ok: true });
  }),
);

adminRouter.post(
  "/uploads/cv",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new HttpError(400, "Fichier requis.");
    }

    if (req.file.mimetype !== "application/pdf") {
      throw new HttpError(400, "Le CV doit être un fichier PDF.");
    }

    const file = await storeUpload(req.file, "cv");
    res.json({ file });
  }),
);

adminRouter.post(
  "/uploads/avatar",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new HttpError(400, "Fichier requis.");
    }

    if (!req.file.mimetype.startsWith("image/")) {
      throw new HttpError(400, "L'avatar doit être une image.");
    }

    const file = await storeUpload(req.file, "avatar");
    res.json({ file });
  }),
);

adminRouter.get(
  "/messages",
  asyncHandler(async (req, res) => {
    const unreadOnly = req.query.unread === "1";
    const messages = await prisma.message.findMany({
      where: unreadOnly ? { read: false } : undefined,
      orderBy: { createdAt: "desc" },
    });

    res.json({ messages });
  }),
);

adminRouter.get(
  "/messages/:id",
  asyncHandler(async (req, res) => {
    const message = await prisma.message.findUnique({
      where: { id: paramId(req.params.id) },
    });

    if (!message) {
      throw new HttpError(404, "Message introuvable.");
    }

    res.json({ message });
  }),
);

adminRouter.patch(
  "/messages/:id/read",
  asyncHandler(async (req, res) => {
    const { read } = messageReadSchema.parse(req.body);
    const message = await prisma.message.update({
      where: { id: paramId(req.params.id) },
      data: { read },
    });

    res.json({ message });
  }),
);

adminRouter.delete(
  "/messages/:id",
  asyncHandler(async (req, res) => {
    await prisma.message.delete({ where: { id: paramId(req.params.id) } });
    res.json({ ok: true });
  }),
);

