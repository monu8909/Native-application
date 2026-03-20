import { z } from "zod";
import { Service } from "../models/Service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getServicesHandler = asyncHandler(async (req, res) => {
  const services = await Service.find({ active: true }).sort({ createdAt: -1 });
  res.json({ services });
});

export const createServiceHandler = asyncHandler(async (req, res) => {
  const body = z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    icon: z.string().optional(),
    basePrice: z.coerce.number().min(0),
    features: z.array(z.string()).optional(),
  }).parse(req.body);

  const service = await Service.create(body);
  res.status(201).json({ service });
});

export const deleteServiceHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findByIdAndUpdate(id, { active: false }, { new: true });
  res.json({ service });
});
