import { AppError } from "../utils/errors.js";

export function errorHandler(err, _req, res, _next) {
  const isApp = err instanceof AppError;

  const status = isApp ? err.statusCode : 500;
  const message = isApp ? err.message : "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production"
      ? {
          details: isApp ? err.details : undefined,
          stack: err.stack,
        }
      : {}),
  });
}

