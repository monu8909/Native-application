import { Router } from "express";

import { requireAuth } from "../middlewares/auth.js";
import { upload, uploadToCloudinary } from "../controllers/upload.controller.js";

const router = Router();

router.post("/cloudinary", requireAuth, upload.single("file"), uploadToCloudinary);

export default router;

