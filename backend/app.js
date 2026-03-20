import compression from "compression";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import designRoutes from "./routes/design.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import workerRoutes from "./routes/worker.routes.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(compression());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    })
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Sanitize data manually to support Express 5
  app.use((req, res, next) => {
    ["body", "params", "headers", "query"].forEach((k) => {
      if (req[k]) {
        mongoSanitize.sanitize(req[k]);
      }
    });
    next();
  });

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (env.CORS_ORIGINS.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
  }

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/workers", workerRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/designs", designRoutes);
  app.use("/api/gallery", galleryRoutes);
  app.use("/api/payments", paymentRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

