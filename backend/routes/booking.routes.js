import { Router } from "express";

import { requireAuth } from "../middlewares/auth.js";
import { createBooking, getBookingById, listMyBookings } from "../controllers/booking.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", listMyBookings);
router.post("/", createBooking);
router.get("/:id", getBookingById);

export default router;

