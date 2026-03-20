import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { listPayments } from "../controllers/payment.controller.js";

const router = Router();

// Admin only
router.use(requireAuth, requireRole("admin"));
router.get("/", listPayments);

export default router;
