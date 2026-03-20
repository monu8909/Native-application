import bcrypt from "bcryptjs";
import { z } from "zod";

import { env } from "../config/env.js";
import { User, USER_ROLES } from "../models/User.js";
import { Workers } from "../models/Workers.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { saveOtp, verifyOtp } from "../utils/otpStore.js";

const phoneSchema = z
  .string()
  .trim()
  .min(8)
  .max(20)
  .regex(/^\+?[0-9]+$/, "Invalid phone");

export const requestOtpHandler = asyncHandler(async (req, res) => {
  const body = z.object({ phone: phoneSchema }).parse(req.body);

  const code = env.OTP_DEV_BYPASS ? env.OTP_DEV_CODE : String(Math.floor(100000 + Math.random() * 900000));
  saveOtp({ phone: body.phone, code, ttlMs: 5 * 60 * 1000 });

  // In production, send via provider. Here we only return dev code when bypass is enabled.
  res.json({
    ok: true,
    ...(env.OTP_DEV_BYPASS ? { devCode: code } : {}),
  });
});

export const verifyOtpHandler = asyncHandler(async (req, res) => {
  const body = z
    .object({
      phone: phoneSchema,
      code: z.string().trim().min(4).max(8),
      name: z.string().trim().min(1).max(120).optional(),
    })
    .parse(req.body);

  const ok = env.OTP_DEV_BYPASS ? body.code === env.OTP_DEV_CODE : verifyOtp({ phone: body.phone, code: body.code });
  if (!ok) throw new AppError("Invalid OTP", { statusCode: 401 });

  let user = await User.findOne({ phone: body.phone });
  if (!user) {
    user = await User.create({
      phone: body.phone,
      name: body.name ?? "Customer",
      role: USER_ROLES.CUSTOMER,
    });
  }
  if (!user.isActive) throw new AppError("Account disabled", { statusCode: 403 });

  const accessToken = signAccessToken({ sub: String(user._id), role: user.role });
  const { token: refreshToken, jti } = signRefreshToken({ sub: String(user._id), role: user.role });
  
  await User.updateOne(
    { _id: user._id },
    { $push: { refreshTokens: { $each: [jti], $slice: -20 } } }
  );

  res.json({
    accessToken,
    refreshToken,
    user: { id: String(user._id), role: user.role, name: user.name, phone: user.phone },
  });
});

export const loginHandler = asyncHandler(async (req, res) => {

  const body = z
    .object({
      phoneOrEmail: z.string().trim().min(3).max(120),
      password: z.string().min(6).max(200),
      mode: z.string().min(3).max(120),
    })
    .parse(req.body);


  if (body?.mode === "worker") {
    const worker_GET = await Workers.findOne({ phone: body.phoneOrEmail });
    console.log("req.bodyuuuuuu---->", worker_GET?.isActive);
    if (!worker_GET || !worker_GET.passwordHash) throw new AppError("Invalid credentials", { statusCode: 401 });
    if (![USER_ROLES.WORKER].includes(worker_GET.role)) {
      throw new AppError("Invalid credentials", { statusCode: 401 });
    }
    if (!worker_GET.isActive) throw new AppError("Account disabled", { statusCode: 403 });

    const ok = await bcrypt.compare(body.password, worker_GET.passwordHash);
    if (!ok) throw new AppError("Invalid credentials", { statusCode: 401 });

    const accessToken = signAccessToken({ sub: String(worker_GET._id), role: worker_GET.role });
    const { token: refreshToken, jti } = signRefreshToken({ sub: String(worker_GET._id), role: worker_GET.role });

    await Workers.updateOne(
      { _id: worker_GET._id },
      { $push: { refreshTokens: { $each: [jti], $slice: -20 } } }
    );

    res.json({
      accessToken,
      refreshToken,
      user: { id: String(worker_GET._id), role: worker_GET.role, name: worker_GET.name, phone: worker_GET.phone, email: worker_GET.email },
    });
  } else if (body?.mode === "customer") {
    const user = await User.findOne({
      $or: [{ phone: body.phoneOrEmail }, { email: body.phoneOrEmail.toLowerCase() }],
    });
    if (!user || !user.passwordHash) throw new AppError("Invalid credentials", { statusCode: 401 });
    if (![USER_ROLES.CUSTOMER].includes(user.role)) {
      throw new AppError("Invalid credentials", { statusCode: 401 });
    }
    if (!user.isActive) throw new AppError("Account disabled", { statusCode: 403 });

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) throw new AppError("Invalid credentials", { statusCode: 401 });

    const accessToken = signAccessToken({ sub: String(user._id), role: user.role });
    const { token: refreshToken, jti } = signRefreshToken({ sub: String(user._id), role: user.role });

    await User.updateOne(
      { _id: user._id },
      { $push: { refreshTokens: { $each: [jti], $slice: -20 } } }
    );

    res.json({
      accessToken,
      refreshToken,
      user: { id: String(user._id), role: user.role, name: user.name, phone: user.phone, email: user.email },
    });
  } else if (body?.mode === "admin") {
    const user = await User.findOne({
      $or: [{ phone: body.phoneOrEmail }, { email: body.phoneOrEmail.toLowerCase() }],
    });
    if (!user || !user.passwordHash) throw new AppError("Invalid credentials", { statusCode: 401 });
    if (user.role !== USER_ROLES.ADMIN) {
      throw new AppError("Access denied", { statusCode: 403 });
    }
    if (!user.isActive) throw new AppError("Account disabled", { statusCode: 403 });

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) throw new AppError("Invalid credentials", { statusCode: 401 });

    const accessToken = signAccessToken({ sub: String(user._id), role: user.role });
    const { token: refreshToken, jti } = signRefreshToken({ sub: String(user._id), role: user.role });

    await User.updateOne(
      { _id: user._id },
      { $push: { refreshTokens: { $each: [jti], $slice: -20 } } }
    );

    res.json({
      accessToken,
      refreshToken,
      user: { id: String(user._id), role: user.role, name: user.name, phone: user.phone, email: user.email },
    });
  } else {
    throw new AppError("Invalid login mode", { statusCode: 400 });
  }
});

export const refreshHandler = asyncHandler(async (req, res) => {
  const body = z.object({ refreshToken: z.string().min(10) }).parse(req.body);
  let decoded;
  try {
    decoded = verifyRefreshToken(body.refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", { statusCode: 401 });
  }

  // Check User model first
  let account = await User.findById(decoded.sub);

  if (!account) {
    // Check Workers model
    account = await Workers.findById(decoded.sub);
  }

  if (!account || !account.isActive) throw new AppError("Unauthorized", { statusCode: 401 });
  if (!decoded.jti || !(account.refreshTokens ?? []).includes(decoded.jti)) {
    throw new AppError("Refresh token revoked", { statusCode: 401 });
  }

  const accessToken = signAccessToken({ sub: String(account._id), role: account.role });
  const { token: refreshToken, jti } = signRefreshToken({ sub: String(account._id), role: account.role });

  const Model = account.constructor; // dynamically use User or Workers model
  await Model.updateOne(
    { _id: account._id },
    { 
      $pull: { refreshTokens: decoded.jti },
    }
  );
  await Model.updateOne(
    { _id: account._id },
    {
      $push: { refreshTokens: { $each: [jti], $slice: -20 } }
    }
  );

  res.json({ accessToken, refreshToken });
});

export const logoutHandler = asyncHandler(async (req, res) => {
  const body = z.object({ refreshToken: z.string().min(10) }).parse(req.body);
  let decoded;
  try {
    decoded = verifyRefreshToken(body.refreshToken);
  } catch {
    return res.json({ ok: true });
  }

  let account = await User.findById(decoded.sub);
  if (!account) {
    account = await Workers.findById(decoded.sub);
  }

  if (account) {
    const Model = account.constructor;
    await Model.updateOne(
      { _id: account._id },
      { $pull: { refreshTokens: decoded.jti } }
    );
  }
  res.json({ ok: true });
});


