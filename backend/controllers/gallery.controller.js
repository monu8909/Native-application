import { z } from "zod";
import { Gallery } from "../models/Gallery.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

export const getGalleryHandler = asyncHandler(async (req, res) => {
  const items = await Gallery.find().sort({ createdAt: -1 });
  res.json({ items });
});

export const uploadGalleryHandler = asyncHandler(async (req, res) => {
  if (!req.file) throw new Error("No image file uploaded");

  // Upload to cloudinary
  const result = await uploadBufferToCloudinary(req.file.buffer, "home-decor-gallery");

  const body = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).parse(req.body);

  const galleryItem = await Gallery.create({
    title: body.title,
    description: body.description,
    imageUrl: result.secure_url,
    uploadedBy: req.user.id,
  });

  res.status(201).json({ galleryItem });
});

export const deleteGalleryHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Gallery.findByIdAndDelete(id);
  res.json({ ok: true });
});
