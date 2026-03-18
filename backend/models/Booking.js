import mongoose from "mongoose";

export const BOOKING_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true }, // e.g. Home / Office
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, default: "IN", trim: true },
    geo: { lat: Number, lng: Number },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceType: {
      type: String,
      required: true,
      enum: ["wall_design", "pop", "putty", "ceiling", "other"],
      index: true,
    },
    address: { type: addressSchema, required: true },
    scheduledAt: { type: Date, required: true, index: true },
    description: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
      index: true,
    },
    estimatedPrice: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    notesInternal: { type: String, trim: true, maxlength: 2000 },
    timeline: [
      {
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String },
        note: { type: String, trim: true, maxlength: 300 },
      },
    ],
  },
  { timestamps: true }
);

bookingSchema.index({ customer: 1, createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);

