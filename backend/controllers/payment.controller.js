import { z } from "zod";
import { Payment } from "../models/Payment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listPayments = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Payment.find()
      .populate("customer", "name email phone")
      .populate({
        path: "booking",
        populate: { path: "serviceID", select: "name" },
        select: "serviceID status scheduledAt",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.countDocuments(),
  ]);

  res.json({ items, page, limit, total });
});
