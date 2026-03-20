import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { getServicesHandler, createServiceHandler, deleteServiceHandler } from "../controllers/service.controller.js";

const router = Router();

// Publicly readable
router.get("/", getServicesHandler);

// Admin only
router.use(requireAuth, requireRole("admin"));
router.post("/", createServiceHandler);
router.delete("/:id", deleteServiceHandler);

export default router;
