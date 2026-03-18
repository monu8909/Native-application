import { Router } from "express";

import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  requestOtpHandler,
  verifyOtpHandler,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/otp/request", requestOtpHandler);
router.post("/otp/verify", verifyOtpHandler);
router.post("/login", loginHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);

export default router;

