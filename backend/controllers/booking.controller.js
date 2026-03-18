import { z } from "zod";
import { Booking, BOOKING_STATUS } from "../models/Booking.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";
import { emitBookingUpdate } from "../utils/realtime.js";

const createBookingSchema = z.object({
  serviceType: z.enum(["wall_design", "pop", "putty", "ceiling", "other"]),
  address: z.object({
    label: z.string().trim().max(50).optional(),
    line1: z.string().trim().min(3).max(200),
    line2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    postalCode: z.string().trim().max(20).optional(),
    country: z.string().trim().max(2).optional(),
    geo: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  scheduledAt: z.coerce.date(),
  description: z.string().trim().max(2000).optional(),
});

export const createBooking = asyncHandler(async (req, res) => {
  const body = createBookingSchema.parse(req.body);

  const booking = await Booking.create({
    customer: req.user.id,
    ...body,
    timeline: [{ by: req.user.id, status: BOOKING_STATUS.PENDING, note: "Booking created" }],
  });

  emitBookingUpdate(req.app, booking.toObject());
  res.status(201).json(booking);
});

export const listMyBookings = asyncHandler(async (req, res) => {
  const items = await Booking.find({ customer: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json({ items });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).lean();
  if (!booking) throw new AppError("Booking not found", { statusCode: 404 });

  const canSee =
    booking.customer?.toString?.() === req.user.id ||
    booking.assignedWorker?.toString?.() === req.user.id ||
    req.user.role === "admin";
  if (!canSee) throw new AppError("Forbidden", { statusCode: 403 });

  res.json(booking);
});

