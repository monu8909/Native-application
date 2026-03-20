import { z } from "zod";
import { Design } from "../models/Design.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

export const getDesignsHandler = asyncHandler(async (req, res) => {
  const designs = await Design.find().sort({ createdAt: -1 });
  res.json({ designs });
});

export const uploadDesignHandler = asyncHandler(async (req, res) => {
  if (!req.file) throw new Error("No image file uploaded");

  // Upload to cloudinary
  const result = await uploadBufferToCloudinary(req.file.buffer, "home-decor-designs");

  const body = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).parse(req.body);

  const design = await Design.create({
    title: body.title,
    description: body.description,
    imageUrl: result.secure_url,
    uploadedBy: req.user.id,
  });

  res.status(201).json({ design });
});

export const deleteDesignHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Design.findByIdAndDelete(id);
  res.json({ ok: true });
});
