import { Router } from "express";

import {
  assignBookingToWorker,
  createWorker,
  dashboard,
  deleteWorker,
  listBookings,
  listWorkers,
  getWorkerStats,
  markAttendance,
  recordWorkerPayment,
  updateBooking,
  updateWorker,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", dashboard);

router.get("/workers", listWorkers);
router.post("/workers", createWorker);
router.patch("/workers/:id", updateWorker);
router.delete("/workers/:id", deleteWorker);
router.get("/workers/:id/stats", getWorkerStats);
router.post("/workers/:id/pay", recordWorkerPayment);
router.post("/attendance", markAttendance);

router.get("/bookings", listBookings);
router.patch("/bookings/:id", updateBooking);
router.post("/bookings/:id/assign", assignBookingToWorker);

export default router;

