import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { getDesignsHandler, uploadDesignHandler, deleteDesignHandler } from "../controllers/design.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// Publicly readable
router.get("/", getDesignsHandler);

// Admin only
router.use(requireAuth, requireRole("admin"));
router.post("/", upload.single("image"), uploadDesignHandler);
router.delete("/:id", deleteDesignHandler);

export default router;
