import { z } from "zod";
import { WorkerTask, TASK_STATUS } from "../models/WorkerTask.js";
import { Booking, BOOKING_STATUS } from "../models/Booking.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";
import { emitBookingUpdate } from "../utils/realtime.js";

export const listMyTasks = asyncHandler(async (req, res) => {
  const items = await WorkerTask.find({ worker: req.user.id })
    .populate("booking")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ items });
});

export const startTask = asyncHandler(async (req, res) => {
  const task = await WorkerTask.findOne({ _id: req.params.id, worker: req.user.id });
  if (!task) throw new AppError("Task not found", { statusCode: 404 });
  if (task.status === TASK_STATUS.COMPLETED) throw new AppError("Task already completed", { statusCode: 400 });

  task.status = TASK_STATUS.STARTED;
  task.startedAt = task.startedAt ?? new Date();
  await task.save();

  const booking = await Booking.findById(task.booking);
  if (booking) {
    booking.status = BOOKING_STATUS.IN_PROGRESS;
    booking.timeline.push({ by: req.user.id, status: booking.status, note: "Work started" });
    await booking.save();
    emitBookingUpdate(req.app, booking.toObject());
  }

  res.json(task);
});

export const completeTask = asyncHandler(async (req, res) => {
  const body = z
    .object({
      finalPrice: z.number().nonnegative().optional(),
    })
    .parse(req.body ?? {});

  const task = await WorkerTask.findOne({ _id: req.params.id, worker: req.user.id });
  if (!task) throw new AppError("Task not found", { statusCode: 404 });

  task.status = TASK_STATUS.COMPLETED;
  task.completedAt = new Date();
  await task.save();

  const booking = await Booking.findById(task.booking);
  if (booking) {
    booking.status = BOOKING_STATUS.COMPLETED;
    if (typeof body.finalPrice === "number") booking.finalPrice = body.finalPrice;
    booking.timeline.push({ by: req.user.id, status: booking.status, note: "Work completed" });
    await booking.save();
    emitBookingUpdate(req.app, booking.toObject());
  }

  res.json(task);
});

