import { z } from "zod";

const shortText = z.string().trim().min(1).max(240);
const mediumText = z.string().trim().min(1).max(1200);
const longText = z.string().trim().min(1).max(8000);
const textList = z.array(z.string().trim().min(1).max(1000)).max(60);
const sortOrder = z.coerce.number().int().min(0).max(9999).default(0);
const slug = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Le slug doit contenir uniquement des minuscules, chiffres et tirets.",
  );

export const loginSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

export const profileSchema = z.object({
  fullName: shortText,
  firstName: shortText,
  lastName: shortText,
  role: shortText,
  location: shortText,
  school: shortText,
  degree: shortText,
  objective: shortText,
  email: z.string().trim().email("Adresse e-mail invalide."),
  phone: shortText,
  linkedin: z.union([z.literal(""), z.string().trim().url("URL invalide.")]),
  github: z.union([z.literal(""), z.string().trim().url("URL invalide.")]),
  facebook: z.union([z.literal(""), z.string().trim().url("URL invalide.")]),
  intro: longText,
  statement: mediumText,
  method: longText,
  vision: longText,
  cvUrl: z.string().trim().max(2048).nullable().optional(),
  cvPublicId: z.string().trim().max(2048).nullable().optional(),
  avatarUrl: z.string().trim().max(2048).nullable().optional(),
  avatarPublicId: z.string().trim().max(2048).nullable().optional(),
  heroIndex: z.string().trim().max(200).nullable().optional(),
  heroCopy: z.string().trim().max(500).nullable().optional(),
  heroLinkText: z.string().trim().max(200).nullable().optional(),
  projectsLabel: z.string().trim().max(200).nullable().optional(),
  projectsTitle: z.string().trim().max(200).nullable().optional(),
  projectsIntro: z.string().trim().max(1000).nullable().optional(),
  registerLabel: z.string().trim().max(200).nullable().optional(),
  registerTitle: z.string().trim().max(200).nullable().optional(),
  registerNote: z.string().trim().max(1000).nullable().optional(),
  fieldNote1Src: z.string().trim().max(2048).nullable().optional(),
  fieldNote1Alt: z.string().trim().max(500).nullable().optional(),
  fieldNote1Index: z.string().trim().max(50).nullable().optional(),
  fieldNote1Meta: z.string().trim().max(200).nullable().optional(),
  fieldNote1Caption: z.string().trim().max(500).nullable().optional(),
  fieldNote1Class: z.string().trim().max(50).nullable().optional(),
  fieldNote2Src: z.string().trim().max(2048).nullable().optional(),
  fieldNote2Alt: z.string().trim().max(500).nullable().optional(),
  fieldNote2Index: z.string().trim().max(50).nullable().optional(),
  fieldNote2Meta: z.string().trim().max(200).nullable().optional(),
  fieldNote2Caption: z.string().trim().max(500).nullable().optional(),
  fieldNote2Class: z.string().trim().max(50).nullable().optional(),
  fieldNote3Src: z.string().trim().max(2048).nullable().optional(),
  fieldNote3Alt: z.string().trim().max(500).nullable().optional(),
  fieldNote3Index: z.string().trim().max(50).nullable().optional(),
  fieldNote3Meta: z.string().trim().max(200).nullable().optional(),
  fieldNote3Caption: z.string().trim().max(500).nullable().optional(),
  fieldNote3Class: z.string().trim().max(50).nullable().optional(),
});

export const educationSchema = z.object({
  year: z.string().trim().min(1).max(20),
  degree: mediumText,
  school: mediumText,
  detail: mediumText,
  sortOrder,
});

export const experienceSchema = z.object({
  company: mediumText,
  period: z.string().trim().min(1).max(120),
  focus: mediumText,
  missions: textList,
  sortOrder,
});

export const trainingSchema = z.object({
  title: mediumText,
  provider: mediumText,
  detail: mediumText,
  sortOrder,
});

export const skillSchema = z.object({
  name: mediumText,
  category: z.string().trim().min(1).max(120),
  level: z.string().trim().min(1).max(120),
  ticks: z.coerce.number().int().min(1).max(5),
  sortOrder,
});

export const projectSchema = z.object({
  slug,
  plate: z.string().trim().min(1).max(30),
  title: mediumText,
  category: mediumText,
  period: z.string().trim().min(1).max(120),
  summary: mediumText,
  description: textList,
  scope: textList,
  role: mediumText,
  tools: textList,
  published: z.boolean().default(true),
  sortOrder,
  coverMediaId: z.string().trim().max(191).nullable().optional(),
  introLine1: z.string().trim().max(200).nullable().optional(),
  introLine2: z.string().trim().max(200).nullable().optional(),
  technicalSheetTitle: z.string().trim().max(200).nullable().optional(),
  technicalSheetSubtitle: z.string().trim().max(200).nullable().optional(),
  technicalProject: z.string().trim().max(500).nullable().optional(),
  technicalPlateRef: z.string().trim().max(200).nullable().optional(),
  technicalScale: z.string().trim().max(200).nullable().optional(),
  technicalDiscipline: z.string().trim().max(200).nullable().optional(),
  technicalNorm: z.string().trim().max(500).nullable().optional(),
  technicalMaterials: z.string().trim().max(500).nullable().optional(),
  technicalEstablishment: z.string().trim().max(200).nullable().optional(),
  intentNoteTitle: z.string().trim().max(200).nullable().optional(),
  intentNote: z.string().trim().max(2000).nullable().optional(),
  conformText: z.string().trim().max(200).nullable().optional(),
});

const drawingKind = z.enum(["plan", "elevation", "section"]);

export const mediaCreateSchema = z
  .object({
    kind: z.enum(["drawing", "image", "pdf", "model"]),
    drawingKind: drawingKind.nullable().optional(),
    url: z.string().trim().max(2048).nullable().optional(),
    publicId: z.string().trim().max(2048).nullable().optional(),
    mimeType: z.string().trim().max(200).nullable().optional(),
    code: z.string().trim().min(1).max(40),
    caption: mediumText,
    sortOrder,
  })
  .superRefine((value, ctx) => {
    if (value.kind === "drawing" && !value.drawingKind) {
      ctx.addIssue({
        code: "custom",
        path: ["drawingKind"],
        message: "Le type de dessin est requis.",
      });
    }

    if (value.kind !== "drawing" && !value.url) {
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: "Le fichier est requis.",
      });
    }
  });

export const mediaUpdateSchema = z
  .object({
    drawingKind: drawingKind.nullable().optional(),
    code: z.string().trim().min(1).max(40).optional(),
    caption: mediumText.optional(),
    sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
  })
  .strict();

export const mediaReplaceSchema = z.object({
  code: z.string().trim().min(1).max(40).optional(),
  caption: mediumText.optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
});

export const mediaUploadSchema = z.object({
  code: z.string().trim().min(1).max(40),
  caption: mediumText,
  sortOrder,
});

export const messageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email("Adresse e-mail invalide."),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().min(2).max(200),
  body: z
    .string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères.")
    .max(5000),
  website: z.string().trim().max(500).optional().default(""),
});

export const messageReadSchema = z.object({
  read: z.boolean(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type MediaCreateInput = z.infer<typeof mediaCreateSchema>;
export type MediaReplaceInput = z.infer<typeof mediaReplaceSchema>;
