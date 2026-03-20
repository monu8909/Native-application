import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

function getBearer(req) {
  const h = req.headers.authorization;
  if (!h) return null;
  const [type, token] = h.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = getBearer(req);
  if (!token) throw new AppError("Unauthorized", { statusCode: 401 });

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new AppError("Invalid token", { statusCode: 401 });
  }

  const user = await User.findById(decoded.sub).lean();
  if (!user || !user.isActive) throw new AppError("Unauthorized", { statusCode: 401 });

  req.user = { id: String(user._id), role: user.role };
  next();
});

export const requireRole = (role) => {
  return (req, _res, next) => {
    if (!req.user || req.user.role !== role) {
      throw new AppError("Forbidden: Insufficient permissions", { statusCode: 403 });
    }
    next();
  };
};
