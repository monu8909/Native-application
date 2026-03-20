import { Router } from "express";
import multer from "multer";
import {
  deleteGalleryHandler,
  getGalleryHandler,
  uploadGalleryHandler,
} from "../controllers/gallery.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getGalleryHandler);

// Admin only routes
router.use(requireAuth, requireRole("admin"));
router.post("/upload", upload.single("image"), uploadGalleryHandler);
router.delete("/:id", deleteGalleryHandler);

export default router;
