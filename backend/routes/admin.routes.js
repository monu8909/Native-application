import { Router } from "express";

import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import {
  assignBookingToWorker,
  createWorker,
  dashboard,
  deleteWorker,
  listBookings,
  listWorkers,
  updateBooking,
  updateWorker,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", dashboard);

router.get("/workers", listWorkers);
router.post("/workers", createWorker);
router.patch("/workers/:id", updateWorker);
router.delete("/workers/:id", deleteWorker);

router.get("/bookings", listBookings);
router.patch("/bookings/:id", updateBooking);
router.post("/bookings/:id/assign", assignBookingToWorker);

export default router;

