import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const profile = {
  fullName: "AZANNAÏ Luc Emmaüs Sèdjro",
  firstName: "Luc Emmaüs Sèdjro",
  lastName: "AZANNAÏ",
  role: "Génie civil · Architecture · Construction",
  location: "Ouidah, Bénin",
  school: "INSTI, Lokossa",
  degree: "Licence professionnelle en génie civil — 2026",
  objective: "Formation supérieure en architecture et construction",
  email: "lucemmaus05@gmail.com",
  phone: "(+229) 01 46 06 40 24",
  linkedin: "",
  github: "",
  facebook: "",
  intro:
    "Diplômé en génie civil à l’Institut National Supérieur de Technologie Industrielle de Lokossa, je souhaite approfondir mes connaissances à travers une formation supérieure en architecture et construction.",
  statement:
    "De la lecture de plans au suivi de chantier, une même exigence : comprendre ce qui tient, et pourquoi.",
  method:
    "Mon parcours m’a permis d’acquérir des bases techniques en conception, dimensionnement des structures, construction et suivi de chantier. À travers mes projets académiques et mes expériences pratiques, je développe une approche intégrée qui associe créativité architecturale, rigueur de l’ingénierie et maîtrise de l’exécution.",
  vision:
    "Titulaire d’une licence en génie civil obtenue à l’INSTI de Lokossa, je souhaite intégrer un parcours Bi-Cursus Architecte-Ingénieur afin d’approfondir mes compétences en architecture et construction. Mon ambition est de concevoir et de contribuer à des projets innovants, durables et fonctionnels, puis de mettre mon expertise au service du développement du secteur de la construction au Bénin.",
};

const education = [
  {
    year: "2026",
    degree: "Licence professionnelle en Génie civil",
    school: "INSTI, Lokossa",
    detail: "Conception, dimensionnement des structures et suivi de chantier.",
    sortOrder: 0,
  },
  {
    year: "2023",
    degree: "Diplôme du Technicien en Bâtiment et Travaux Publics (DT-BTP)",
    school: "Lycée Technique et Professionnel de Ouidah",
    detail: "Formation technique en bâtiment et travaux publics.",
    sortOrder: 1,
  },
  {
    year: "2023",
    degree: "Baccalauréat série F4",
    school: "Lycée Technique et Professionnel de Ouidah",
    detail: "Série technique, mathématiques et sciences appliquées.",
    sortOrder: 2,
  },
  {
    year: "2022",
    degree:
      "Certificat d’aptitude professionnelle en Construction Bâtiment (CAP-CB)",
    school: "Lycée Technique et Professionnel de Ouidah",
    detail: "Premiers fondamentaux du bâtiment et de la construction.",
    sortOrder: 3,
  },
];

const experiences = [
  {
    company: "NINO GROUP SARL",
    period: "Février – mai 2026",
    focus: "Bureau d’études et suivi de chantier",
    missions: [
      "Lecture et interprétation de plans.",
      "Redimensionnement des structures : planchers, poutres et poteaux.",
      "Évaluation des quantités de matériaux.",
      "Rédaction de rapports journaliers et hebdomadaires.",
      "Participation au contrôle de la qualité et au respect des règles HSE.",
    ],
    sortOrder: 0,
  },
  {
    company: "C.U.B.E.",
    period: "Juillet – août 2025",
    focus: "Suivi de chantier — hôtel cinq étoiles",
    missions: [
      "Participation au suivi de la construction d’un hôtel cinq étoiles.",
      "Appui à la coordination des équipes.",
      "Participation aux réunions de fin de journée.",
    ],
    sortOrder: 1,
  },
  {
    company: "JOSAPHA SERVICE",
    period: "Août – septembre 2024",
    focus: "Rénovation et pavage",
    missions: [
      "Participation aux travaux de rénovation de la Maison de la Culture de Ouidah.",
      "Participation aux travaux de pavage des parkings et des allées.",
      "Participation à la préfabrication et à la supervision des équipes.",
      "Préparation d’attachements et de rapports journaliers.",
    ],
    sortOrder: 2,
  },
];

const training = [
  {
    title: "Organisation de chantier",
    provider: "Cursa",
    detail:
      "Planification et préparation du chantier, gestion des équipes et des ressources.",
    sortOrder: 0,
  },
];

const skills = [
  {
    name: "ArchiCAD 27",
    category: "Conception",
    level: "Intermédiaire",
    ticks: 3,
    sortOrder: 0,
  },
  {
    name: "DAO et dessin technique",
    category: "Conception",
    level: "Intermédiaire",
    ticks: 3,
    sortOrder: 1,
  },
  {
    name: "Conception architecturale",
    category: "Conception",
    level: "Intermédiaire",
    ticks: 3,
    sortOrder: 2,
  },
  {
    name: "Lecture de plans",
    category: "Exécution",
    level: "Très bien",
    ticks: 5,
    sortOrder: 3,
  },
  {
    name: "Dimensionnement des structures",
    category: "Structure",
    level: "Intermédiaire",
    ticks: 3,
    sortOrder: 4,
  },
  {
    name: "ROBOT structural",
    category: "Structure",
    level: "Notions de base",
    ticks: 2,
    sortOrder: 5,
  },
  {
    name: "Suivi et organisation de chantier",
    category: "Exécution",
    level: "Très bien",
    ticks: 5,
    sortOrder: 6,
  },
  {
    name: "Quantification des matériaux",
    category: "Exécution",
    level: "Très bien",
    ticks: 5,
    sortOrder: 7,
  },
];

const projects = [
  {
    slug: "maison-rdc",
    plate: "PL-01",
    title: "Maison habitable en RDC",
    category: "Architecture",
    period: "Projet académique",
    summary:
      "Conception d’une maison de plain-pied : organisation des espaces, plans 2D, coupes, façades et rendus 3D.",
    description: [
      "Ce projet porte sur la conception architecturale d’une maison habitable au rez-de-chaussée. Le travail commence par l’organisation des espaces intérieurs, puis se poursuit par la production des plans, des coupes et des façades.",
      "La dernière étape est la modélisation de rendus architecturaux 3D, pour vérifier la cohérence entre le plan, les volumes et la perception extérieure du bâtiment.",
    ],
    scope: [
      "Plans architecturaux 2D",
      "Organisation des espaces intérieurs",
      "Coupes et façades",
      "Modélisation de rendus 3D",
    ],
    role: "Conception architecturale, dessin de plans, coupes et façades, rendus 3D",
    tools: ["ArchiCAD 27", "DAO", "Rendu 3D"],
    published: true,
    sortOrder: 0,
    media: [
      {
        kind: "drawing",
        drawingKind: "plan",
        code: "PL-01.1",
        caption: "Plan du rez-de-chaussée — organisation des espaces",
        sortOrder: 0,
      },
      {
        kind: "drawing",
        drawingKind: "elevation",
        code: "PL-01.2",
        caption: "Façade principale — proportions et ouvertures",
        sortOrder: 1,
      },
      {
        kind: "drawing",
        drawingKind: "section",
        code: "PL-01.3",
        caption: "Coupe de principe — relation intérieur/extérieur",
        sortOrder: 2,
      },
    ],
  },
  {
    slug: "maison-chambres-louer",
    plate: "PL-02",
    title: "Maison avec chambres à louer",
    category: "Architecture",
    period: "Projet académique",
    summary:
      "Un rez-de-chaussée habitable, des chambres destinées à la location et un espace vert : trois usages dans une même parcelle.",
    description: [
      "Ce projet explore un programme mixte : un logement au rez-de-chaussée, des chambres à louer et un espace vert. L’enjeu est de faire cohabiter plusieurs usages sans perdre la clarté des circulations.",
      "Le travail comprend les plans architecturaux 2D, l’organisation des espaces intérieurs, les coupes et les façades.",
    ],
    scope: [
      "Plans architecturaux 2D",
      "Organisation des espaces intérieurs",
      "Coupes et façades",
      "Intégration d’un espace vert",
    ],
    role: "Conception architecturale, organisation du programme, plans et façades",
    tools: ["ArchiCAD 27", "DAO"],
    published: true,
    sortOrder: 1,
    media: [
      {
        kind: "drawing",
        drawingKind: "elevation",
        code: "PL-02.2",
        caption: "Façade — lecture des deux volumes",
        sortOrder: 0,
      },
      {
        kind: "drawing",
        drawingKind: "plan",
        code: "PL-02.1",
        caption: "Plan de masse — logement, chambres et espace vert",
        sortOrder: 1,
      },
      {
        kind: "drawing",
        drawingKind: "section",
        code: "PL-02.3",
        caption: "Coupe — rapports entre les espaces",
        sortOrder: 2,
      },
    ],
  },
  {
    slug: "memoire-licence",
    plate: "PL-03",
    title: "Redimensionnement d’un bloc pédagogique",
    category: "Structure",
    period: "Mémoire de licence — 2026",
    summary:
      "Étude des planchers, poutres et poteaux d’un bloc pédagogique à l’INSTI de Lokossa, selon le BAEL 91 révisé 99.",
    description: [
      "Ce mémoire porte sur le redimensionnement et la mise en œuvre des éléments porteurs d’un bloc pédagogique à l’INSTI de Lokossa. L’étude couvre les planchers, les poutres et les poteaux.",
      "Le travail comprend la vérification du dimensionnement des éléments porteurs et l’application des principes de calcul du béton armé selon le BAEL 91 révisé 99, avec une attention particulière portée au suivi de l’exécution et au contrôle de la qualité.",
    ],
    scope: [
      "Étude des planchers, poutres et poteaux",
      "Vérification du dimensionnement",
      "Calcul du béton armé — BAEL 91 révisé 99",
      "Suivi de l’exécution et contrôle de la qualité",
    ],
    role: "Analyse structurelle, dimensionnement, vérification et contrôle de la qualité",
    tools: ["BAEL 91 révisé 99", "ROBOT structural", "Calcul béton armé"],
    published: true,
    sortOrder: 2,
    media: [
      {
        kind: "drawing",
        drawingKind: "section",
        code: "PL-03.1",
        caption: "Coupe structurelle — plancher, poutre et poteau",
        sortOrder: 0,
      },
      {
        kind: "drawing",
        drawingKind: "plan",
        code: "PL-03.2",
        caption: "Plan de coffrage — trame porteuse",
        sortOrder: 1,
      },
      {
        kind: "drawing",
        drawingKind: "elevation",
        code: "PL-03.3",
        caption: "Élévation — lecture des niveaux",
        sortOrder: 2,
      },
    ],
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@azanai.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe-2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: "Administrateur", passwordHash },
    create: { email: adminEmail, name: "Administrateur", passwordHash },
  });

  const existingProfile = await prisma.profile.findUnique({ where: { id: 1 } });
  if (!existingProfile) {
    await prisma.profile.create({ data: { id: 1, ...profile } });
  }

  if ((await prisma.education.count()) === 0) {
    await prisma.education.createMany({ data: education });
  }

  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.createMany({ data: experiences });
  }

  if ((await prisma.training.count()) === 0) {
    await prisma.training.createMany({ data: training });
  }

  if ((await prisma.skill.count()) === 0) {
    await prisma.skill.createMany({ data: skills });
  }

  if ((await prisma.project.count()) === 0) {
    for (const project of projects) {
      const { media, ...projectData } = project;
      await prisma.project.create({
        data: {
          ...projectData,
          media: { create: media },
        },
      });
    }
  }

  console.log(`Seed terminé. Admin : ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
