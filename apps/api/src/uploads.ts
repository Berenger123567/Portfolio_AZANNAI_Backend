import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { cloudinaryConfigured, env } from "./env";
import { HttpError } from "./errors";

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

fs.mkdirSync(env.uploadDir, { recursive: true });

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "model/gltf-binary",
  "model/gltf+json",
  "application/octet-stream",
  "model/obj",
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new HttpError(400, "Format de fichier non autorisé."));
      return;
    }

    callback(null, true);
  },
});

type UploadFile = Express.Multer.File;

export type UploadedFile = {
  url: string;
  publicId: string;
  mimeType: string;
  kind: "image" | "pdf" | "model";
};

function safeExtension(file: UploadFile) {
  const extension = path.extname(file.originalname).toLowerCase();
  if (extension && [".glb", ".gltf", ".obj", ".pdf"].includes(extension)) {
    return extension;
  }
  if (extension && extension.length <= 8 && ![".exe", ".sh", ".bat"].includes(extension)) {
    return extension;
  }

  if (file.mimetype === "application/pdf") return ".pdf";
  if (file.mimetype === "model/gltf-binary") return ".glb";
  if (file.mimetype === "model/gltf+json") return ".gltf";
  if (file.mimetype === "model/obj") return ".obj";
  return ".jpg";
}

async function uploadToCloudinary(
  file: UploadFile,
  folder: string,
): Promise<UploadedFile> {
  const result = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Échec de l’envoi vers Cloudinary."));
          return;
        }

        resolve(uploadResult);
      },
    );

    stream.end(file.buffer);
  });

  const ext = path.extname(file.originalname).toLowerCase();
  let kind: "image" | "pdf" | "model" = "image";
  if (file.mimetype === "application/pdf") kind = "pdf";
  else if (file.mimetype.startsWith("model/") || ext === ".glb" || ext === ".gltf" || ext === ".obj") kind = "model";
  return {
    url: result.secure_url,
    publicId: result.public_id,
    mimeType: file.mimetype,
    kind,
  };
}

function uploadToLocal(file: UploadFile, folder: string): UploadedFile {
  const relativeFolder = folder
    .split("/")
    .map((part) => part.replace(/[^a-zA-Z0-9_-]/g, ""))
    .filter(Boolean)
    .join(path.sep);
  const targetFolder = path.join(env.uploadDir, relativeFolder);
  fs.mkdirSync(targetFolder, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomUUID()}${safeExtension(file)}`;
  fs.writeFileSync(path.join(targetFolder, filename), file.buffer);

  const relativePath = path.posix.join(
    folder,
    filename.replaceAll(path.sep, "/"),
  );

  const ext = path.extname(file.originalname).toLowerCase();
  let kind: "image" | "pdf" | "model" = "image";
  if (file.mimetype === "application/pdf") kind = "pdf";
  else if (file.mimetype.startsWith("model/") || ext === ".glb" || ext === ".gltf" || ext === ".obj") kind = "model";
  return {
    url: `/uploads/${relativePath}`,
    publicId: `local:${relativePath}`,
    mimeType: file.mimetype,
    kind,
  };
}

export async function storeUpload(
  file: UploadFile,
  folder = "azanai",
): Promise<UploadedFile> {
  if (cloudinaryConfigured) {
    return uploadToCloudinary(file, folder);
  }

  if (env.isProduction) {
    console.warn(
      "Cloudinary n’est pas configuré : les fichiers sont stockés localement.",
    );
  }

  return uploadToLocal(file, folder);
}

export async function deleteUpload(publicId: string | null | undefined) {
  if (!publicId) {
    return;
  }

  if (publicId.startsWith("local:")) {
    const relativePath = publicId.slice("local:".length);
    const absolutePath = path.resolve(env.uploadDir, relativePath);
    const uploadRoot = path.resolve(env.uploadDir);

    if (!absolutePath.startsWith(uploadRoot + path.sep)) {
      return;
    }

    fs.rm(absolutePath, { force: true }, () => undefined);
    return;
  }

  if (!cloudinaryConfigured) {
    return;
  }

  for (const resourceType of ["image", "raw"] as const) {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return;
    } catch {
      // Try the next resource type.
    }
  }
}
