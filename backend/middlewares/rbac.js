import { AppError } from "../utils/errors.js";

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError("Unauthorized", { statusCode: 401 }));
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", { statusCode: 403 }));
    }
    next();
  };
}

