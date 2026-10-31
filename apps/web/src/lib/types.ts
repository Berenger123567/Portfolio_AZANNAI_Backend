export type DrawingKind = "plan" | "elevation" | "section";

export type MediaKind = "drawing" | "image" | "pdf" | "model";

export type Profile = {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  role: string;
  location: string;
  school: string;
  degree: string;
  objective: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  facebook: string;
  intro: string;
  statement: string;
  method: string;
  vision: string;
  cvUrl: string | null;
  cvPublicId: string | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  heroIndex: string | null;
  heroCopy: string | null;
  heroLinkText: string | null;
  projectsLabel: string | null;
  projectsTitle: string | null;
  projectsIntro: string | null;
  registerLabel: string | null;
  registerTitle: string | null;
  registerNote: string | null;
  fieldNote1Src: string | null;
  fieldNote1Alt: string | null;
  fieldNote1Index: string | null;
  fieldNote1Meta: string | null;
  fieldNote1Caption: string | null;
  fieldNote1Class: string | null;
  fieldNote2Src: string | null;
  fieldNote2Alt: string | null;
  fieldNote2Index: string | null;
  fieldNote2Meta: string | null;
  fieldNote2Caption: string | null;
  fieldNote2Class: string | null;
  fieldNote3Src: string | null;
  fieldNote3Alt: string | null;
  fieldNote3Index: string | null;
  fieldNote3Meta: string | null;
  fieldNote3Caption: string | null;
  fieldNote3Class: string | null;
  fieldNotes?: any;
  heroImageSrc?: string | null;
  heroImageAlt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Education = {
  id: string;
  year: string;
  degree: string;
  school: string;
  detail: string;
  sortOrder: number;
};

export type Experience = {
  id: string;
  company: string;
  period: string;
  focus: string;
  missions: string[];
  sortOrder: number;
};

export type Training = {
  id: string;
  title: string;
  provider: string;
  detail: string;
  sortOrder: number;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: string;
  ticks: number;
  sortOrder: number;
};

export type ProjectMedia = {
  id: string;
  projectId: string;
  kind: MediaKind;
  drawingKind: DrawingKind | null;
  url: string | null;
  publicId: string | null;
  mimeType: string | null;
  code: string;
  caption: string;
  sortOrder: number;
};

export type Project = {
  id: string;
  slug: string;
  plate: string;
  title: string;
  category: string;
  period: string;
  summary: string;
  description: string[];
  scope: string[];
  role: string;
  tools: string[];
  published: boolean;
  sortOrder: number;
  media: ProjectMedia[];
  coverMediaId: string | null;
  introLine1: string | null;
  introLine2: string | null;
  technicalSheetTitle: string | null;
  technicalSheetSubtitle: string | null;
  technicalProject: string | null;
  technicalPlateRef: string | null;
  technicalScale: string | null;
  technicalDiscipline: string | null;
  technicalNorm: string | null;
  technicalMaterials: string | null;
  technicalEstablishment: string | null;
  intentNoteTitle: string | null;
  intentNote: string | null;
  conformText: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectSummary = {
  slug: string;
  plate: string;
  title: string;
};

export type SiteData = {
  profile: Profile;
  education: Education[];
  experiences: Experience[];
  training: Training[];
  skills: Skill[];
  projects: Project[];
};

export type ProjectDetailData = {
  project: Project;
  nextProject: ProjectSummary | null;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
};
