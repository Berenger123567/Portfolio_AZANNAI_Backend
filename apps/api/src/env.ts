import "dotenv/config";
import path from "node:path";

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL est requis.");
}

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET est requis en production.");
}

if (isProduction && !process.env.ADMIN_EMAIL) {
  throw new Error("ADMIN_EMAIL est requis en production.");
}

const webOrigins = (process.env.WEB_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  isProduction,
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: process.env.JWT_SECRET ?? "dev-only-secret-change-me",
  webOrigins,
  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? "uploads"),
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@azanai.local",
  adminPassword: process.env.ADMIN_PASSWORD ?? "ChangeMe-2026!",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  },
};

export const cloudinaryConfigured = Boolean(
  env.cloudinary.cloudName &&
    env.cloudinary.apiKey &&
    env.cloudinary.apiSecret,
);
