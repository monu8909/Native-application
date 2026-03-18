import { Router } from "express";

import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { listMyTasks, startTask, completeTask } from "../controllers/worker.controller.js";

const router = Router();

router.use(requireAuth, requireRole("worker"));

router.get("/me/tasks", listMyTasks);
router.patch("/tasks/:id/start", startTask);
router.patch("/tasks/:id/complete", completeTask);

export default router;

