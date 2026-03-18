import { z } from "zod";
import multer from "multer";

import { initCloudinary, cloudinary } from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";

initCloudinary();

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

async function uploadBuffer({ buffer, mimetype, folder }) {
  if (!cloudinary?.uploader) throw new AppError("Cloudinary not configured", { statusCode: 500 });

  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimetype};base64,${base64}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "auto",
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export const uploadToCloudinary = asyncHandler(async (req, res) => {
  const body = z
    .object({
      folder: z.string().trim().min(1).max(120).default("home-decor"),
    })
    .parse(req.body ?? {});

  const file = req.file;
  if (!file) throw new AppError("Missing file", { statusCode: 400 });

  const uploaded = await uploadBuffer({ buffer: file.buffer, mimetype: file.mimetype, folder: body.folder });
  res.status(201).json(uploaded);
});

