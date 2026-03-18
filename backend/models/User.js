import mongoose from "mongoose";

export const USER_ROLES = /** @type {const} */ ({
  CUSTOMER: "customer",
  WORKER: "worker",
  ADMIN: "admin",
});

const workerProfileSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, index: true },
    dailyWage: { type: Number, default: 0 },
    salaryType: { type: String, enum: ["daily", "monthly"], default: "daily" },
    address: { type: String },
    lastKnownLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 120 },
    phone: { type: String, trim: true, unique: true, sparse: true, index: true },
    email: { type: String, trim: true, lowercase: true, sparse: true, index: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER,
      index: true,
    },
    passwordHash: { type: String }, // for worker/admin login if enabled
    refreshTokens: [{ type: String }], // store refresh token ids (jti) to allow rotation/revoke
    isActive: { type: Boolean, default: true, index: true },
    avatarUrl: { type: String },
    fcmTokens: [{ type: String }],
    workerProfile: { type: workerProfileSchema },
  },
  { timestamps: true }
);

userSchema.index({ phone: 1, role: 1 });

export const User = mongoose.model("User", userSchema);

