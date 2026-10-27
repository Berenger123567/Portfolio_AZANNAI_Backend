export type DrawingKind = "plan" | "elevation" | "section";

export type MediaKind = "drawing" | "image" | "pdf";

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
