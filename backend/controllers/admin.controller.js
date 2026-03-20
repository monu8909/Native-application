import bcrypt from "bcryptjs";
import { z } from "zod";

import { Attendance } from "../models/Attendance.js";
import { Booking, BOOKING_STATUS } from "../models/Booking.js";
import { User, USER_ROLES, } from "../models/User.js";
import { WorkerPaymentRecord } from "../models/WorkerPaymentRecord.js";
import { Workers } from "../models/Workers.js";
import { TASK_STATUS, WorkerTask } from "../models/WorkerTask.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";
import { emitBookingUpdate } from "../utils/realtime.js";

export const dashboard = asyncHandler(async (_req, res) => {
  const [bookingsTotal, userTotal, workersTotal, bookingsByStatus] = await Promise.all([
    Booking.countDocuments({}),
    User.countDocuments({ role: USER_ROLES.WORKER }),
    Workers.countDocuments({}),


    Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  res.json({
    bookingsTotal,
    userTotal,
    workersTotal,
    bookingsByStatus,
  });
});

export const listWorkers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Workers.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Workers.countDocuments({}),
  ]);

  res.json({ items, page, limit, total });
});

export const createWorker = asyncHandler(async (req, res) => {
  const body = z
    .object({
      name: z.string().trim().min(1).max(120),
      phone: z.string().trim().min(8).max(20).optional(),
      email: z.string().trim().email().optional(),
      password: z.string().min(6).max(200),
      employeeCode: z.string().trim().max(40).optional(),
      dailyWage: z.number().nonnegative().optional(),
      salaryType: z.enum(["daily", "monthly"]).optional(),
    })
    .parse(req.body);

  const passwordHash = await bcrypt.hash(body.password, 10);
  const user = await User.create({
    name: body.name,
    phone: body.phone,
    email: body.email,
    role: USER_ROLES.WORKER,
    passwordHash,
    workerProfile: {
      employeeCode: body.employeeCode,
      dailyWage: body.dailyWage ?? 0,
      salaryType: body.salaryType ?? "daily",
    },
  });

  res.status(201).json({ id: String(user._id) });
});

export const updateWorker = asyncHandler(async (req, res) => {
  const body = z
    .object({
      name: z.string().trim().min(1).max(120).optional(),
      phone: z.string().trim().min(8).max(20).optional(),
      email: z.string().trim().email().optional(),
      isActive: z.boolean().optional(),
      password: z.string().min(6).max(200).optional(),
      employeeCode: z.string().trim().max(40).optional(),
      dailyWage: z.number().nonnegative().optional(),
      salaryType: z.enum(["daily", "monthly"]).optional(),
    })
    .parse(req.body);

  const user = await User.findOne({ _id: req.params.id, role: USER_ROLES.WORKER });
  if (!user) throw new AppError("Worker not found", { statusCode: 404 });

  if (body.name) user.name = body.name;
  if (body.phone) user.phone = body.phone;
  if (body.email) user.email = body.email;
  if (typeof body.isActive === "boolean") user.isActive = body.isActive;
  if (body.password) user.passwordHash = await bcrypt.hash(body.password, 10);
  user.workerProfile = {
    ...(user.workerProfile?.toObject?.() ?? user.workerProfile ?? {}),
    employeeCode: body.employeeCode ?? user.workerProfile?.employeeCode,
    dailyWage: body.dailyWage ?? user.workerProfile?.dailyWage ?? 0,
    salaryType: body.salaryType ?? user.workerProfile?.salaryType ?? "daily",
  };

  await user.save();
  res.json({ ok: true });
});

export const deleteWorker = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: USER_ROLES.WORKER });
  if (!user) throw new AppError("Worker not found", { statusCode: 404 });
  user.isActive = false;
  await user.save();
  res.json({ ok: true });
});

export const listBookings = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const status = req.query.status ? String(req.query.status) : undefined;
  const q = {};
  if (status) q.status = status;

  const [items, total] = await Promise.all([
    Booking.find(q)
      .populate("customer", "name phone")
      .populate("assignedWorker", "name phone")
      .populate("serviceID", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(q),
  ]);
  res.json({ items, page, limit, total });
});

export const updateBooking = asyncHandler(async (req, res) => {
  const body = z
    .object({
      status: z.enum(Object.values(BOOKING_STATUS)).optional(),
      estimatedPrice: z.number().nonnegative().optional(),
      notesInternal: z.string().trim().max(2000).optional(),
    })
    .parse(req.body);

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError("Booking not found", { statusCode: 404 });

  if (body.status) booking.status = body.status;
  if (typeof body.estimatedPrice === "number") booking.estimatedPrice = body.estimatedPrice;
  if (body.notesInternal) booking.notesInternal = body.notesInternal;
  booking.timeline.push({ by: req.user.id, status: booking.status, note: "Admin updated booking" });
  await booking.save();

  emitBookingUpdate(req.app, booking.toObject());
  res.json(booking);
});

export const assignBookingToWorker = asyncHandler(async (req, res) => {
  const body = z.object({ workerId: z.string().min(1) }).parse(req.body);

  const [booking, worker] = await Promise.all([
    Booking.findById(req.params.id),
    User.findOne({ _id: body.workerId, role: USER_ROLES.WORKER, isActive: true }),
  ]);
  if (!booking) throw new AppError("Booking not found", { statusCode: 404 });
  if (!worker) throw new AppError("Worker not found", { statusCode: 404 });

  booking.assignedWorker = worker._id;
  booking.status = BOOKING_STATUS.ASSIGNED;
  booking.timeline.push({ by: req.user.id, status: booking.status, note: `Assigned to ${worker.name}` });
  await booking.save();

  const task = await WorkerTask.findOneAndUpdate(
    { booking: booking._id, worker: worker._id },
    { booking: booking._id, worker: worker._id, status: TASK_STATUS.ASSIGNED },
    { new: true, upsert: true }
  );

  emitBookingUpdate(req.app, booking.toObject());
  res.json({ booking, task });
});

export const markAttendance = asyncHandler(async (req, res) => {
  const body = z
    .object({
      workerId: z.string().min(1),
      date: z.string().min(1),
      status: z.enum(["present", "leave"]),
      note: z.string().optional(),
    })
    .parse(req.body);

  const attendanceDate = new Date(body.date);
  attendanceDate.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOneAndUpdate(
    { worker: body.workerId, date: attendanceDate },
    {
      worker: body.workerId,
      date: attendanceDate,
      status: body.status,
      note: body.note,
      markedBy: req.user.id,
    },
    { upsert: true, new: true }
  );

  res.json(attendance);
});

export const getWorkerStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Try to find in Workers collection first (user's preferred model now)
  let worker = await Workers.findById(id).lean();
  let dailyWage = 0;
  let name = "";

  if (worker) {
    dailyWage = worker.price || 0;
    name = worker.name || `${worker.firstName} ${worker.lastName}`;
  } else {
    // Fallback to User collection
    const u = await User.findOne({ _id: id, role: USER_ROLES.WORKER }).lean();
    if (!u) throw new AppError("Worker not found", { statusCode: 404 });
    worker = u;
    dailyWage = u.workerProfile?.dailyWage || 0;
    name = u.name;
  }

  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [tasksCount, attendanceHistory, payments] = await Promise.all([
    WorkerTask.countDocuments({ worker: id, status: TASK_STATUS.COMPLETED }),
    Attendance.find({ worker: id, date: { $gte: startOfLastMonth } }).sort({ date: -1 }).lean(),
    WorkerPaymentRecord.find({ worker: id }).sort({ paymentDate: -1 }).lean(),
  ]);

  const attendanceDays = attendanceHistory.filter(a => a.status === "present").length;
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalEarned = attendanceDays * dailyWage;
  const balance = totalEarned - totalPaid;

  res.json({
    worker: { ...worker, name, dailyWage },
    stats: {
      tasksCount,
      attendanceDays,
      totalEarned,
      totalPaid,
      balance: balance >= 0 ? balance : 0,
      advance: balance < 0 ? Math.abs(balance) : 0,
    },
    attendanceHistory,
    payments,
  });
});


export const recordWorkerPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = z
    .object({
      amount: z.number().positive(),
      notes: z.string().optional(),
      method: z.enum(["cash", "online", "bank_transfer"]).optional(),
    })
    .parse(req.body);

  const worker = await User.findOne({ _id: id, role: USER_ROLES.WORKER });
  if (!worker) throw new AppError("Worker not found", { statusCode: 404 });

  const payment = await WorkerPaymentRecord.create({
    worker: id,
    amount: body.amount,
    notes: body.notes,
    method: body.method || "cash",
    admin: req.user.id,
  });

  res.status(201).json(payment);
});


